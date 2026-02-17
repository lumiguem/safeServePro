package com.safeserve.backend.application.usecase;

import com.safeserve.backend.application.dto.EvidenciaDTO;
import com.safeserve.backend.application.dto.HallazgoDTO;
import com.safeserve.backend.domain.model.Evidencia;
import com.safeserve.backend.domain.model.Hallazgo;
import com.safeserve.backend.domain.repository.out.EvidenciaRepositoryPort;
import com.safeserve.backend.domain.repository.out.HallazgoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvidenciaService {

    private final EvidenciaRepositoryPort evidenciaRepository;
    private final HallazgoRepositoryPort hallazgoRepository;
    private final AIAssessmentService aiAssessmentService;

    @Transactional
    public EvidenciaDTO createEvidencia(EvidenciaDTO evidenciaDTO) {

        Evidencia evidencia = Evidencia.builder()
                .auditoriaId(evidenciaDTO.getAuditoriaId())
                .urlArchivo(evidenciaDTO.getUrlArchivo())
                .tipoArchivo(evidenciaDTO.getTipoArchivo())
                .timestampCaptura(LocalDateTime.now())
                .build();

        Evidencia savedEvidencia = evidenciaRepository.save(evidencia);

        List<Hallazgo> hallazgos = List.of();
        if (shouldAnalyzeWithAI(savedEvidencia)) {
            hallazgos = aiAssessmentService.assessImage(savedEvidencia.getUrlArchivo());
        }

        if (hallazgos != null && !hallazgos.isEmpty()) {

            for (Hallazgo h : hallazgos) {
                h.setAuditoriaId(savedEvidencia.getAuditoriaId());
                h.setEvidenciaId(savedEvidencia.getId());
                h.setEstaResuelto(false);
                h.setFechaHallazgo(LocalDateTime.now());
            }

            hallazgoRepository.saveAll(hallazgos);
        }

        return toDTO(savedEvidencia);
    }

    @Transactional(readOnly = true)
    public Optional<EvidenciaDTO> findById(Long id) {
        return evidenciaRepository.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<EvidenciaDTO> findAll() {
        return evidenciaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvidenciaDTO> findByAuditoriaId(String auditoriaId) {
        return evidenciaRepository.findByAuditoriaId(auditoriaId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteEvidencia(Long id) {
        evidenciaRepository.deleteById(id);
    }

    private EvidenciaDTO toDTO(Evidencia evidencia) {

        List<HallazgoDTO> hallazgos = evidencia.getHallazgos() == null
                ? List.of()
                : evidencia.getHallazgos().stream()
                .map(h -> HallazgoDTO.builder()
                        .id(h.getId())
                        .auditoriaId(h.getAuditoriaId())
                        .evidenciaId(h.getEvidenciaId())
                        .categoria(h.getCategoria())
                        .descripcion(h.getDescripcion())
                        .prioridad(h.getPrioridad())
                        .accionCorrectiva(h.getAccionCorrectiva())
                        .estaResuelto(h.isEstaResuelto())
                        .fechaHallazgo(h.getFechaHallazgo())
                        .build())
                .toList();

        return EvidenciaDTO.builder()
                .id(evidencia.getId())
                .auditoriaId(evidencia.getAuditoriaId())
                .urlArchivo(evidencia.getUrlArchivo())
                .tipoArchivo(evidencia.getTipoArchivo())
                .timestampCaptura(evidencia.getTimestampCaptura())
                .hallazgos(hallazgos)
                .build();
    }

    private boolean shouldAnalyzeWithAI(Evidencia evidencia) {
        String url = evidencia.getUrlArchivo();
        String tipo = evidencia.getTipoArchivo();

        if (url == null || url.isBlank()) {
            return false;
        }

        boolean isHttpUrl = url.startsWith("http://") || url.startsWith("https://");
        boolean isImageType = tipo != null && tipo.toLowerCase().startsWith("image/");

        return isHttpUrl && isImageType;
    }
}
