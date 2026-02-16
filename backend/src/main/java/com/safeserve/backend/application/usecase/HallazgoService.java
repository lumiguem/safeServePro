package com.safeserve.backend.application.usecase;

import com.safeserve.backend.application.dto.HallazgoDTO;
import com.safeserve.backend.domain.model.Hallazgo;
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
public class HallazgoService {

    private final HallazgoRepositoryPort hallazgoRepository;

    @Transactional
    public HallazgoDTO createHallazgo(HallazgoDTO hallazgoDTO) {
        Hallazgo hallazgo = toEntity(hallazgoDTO);
        hallazgo.setFechaHallazgo(LocalDateTime.now());
        Hallazgo savedHallazgo = hallazgoRepository.save(hallazgo);
        return toDTO(savedHallazgo);
    }

    @Transactional(readOnly = true)
    public Optional<HallazgoDTO> findById(Long id) {
        return hallazgoRepository.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<HallazgoDTO> findAll() {
        return hallazgoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public HallazgoDTO updateHallazgo(Long id, HallazgoDTO hallazgoDTO) {
        return hallazgoRepository.findById(id)
                .map(existingHallazgo -> {
                    existingHallazgo.setAuditoriaId(hallazgoDTO.getAuditoriaId());
                    existingHallazgo.setEvidenciaId(hallazgoDTO.getEvidenciaId());
                    existingHallazgo.setCategoria(hallazgoDTO.getCategoria());
                    existingHallazgo.setDescripcion(hallazgoDTO.getDescripcion());
                    existingHallazgo.setPrioridad(hallazgoDTO.getPrioridad());
                    existingHallazgo.setAccionCorrectiva(hallazgoDTO.getAccionCorrectiva());
                    existingHallazgo.setEstaResuelto(hallazgoDTO.isEstaResuelto());
                    // FechaHallazgo might not be updated here, or handled separately
                    return toDTO(hallazgoRepository.save(existingHallazgo));
                }).orElseThrow(() -> new RuntimeException("Hallazgo not found with id " + id)); // Custom exception handling
    }

    @Transactional
    public void deleteHallazgo(Long id) {
        hallazgoRepository.deleteById(id);
    }

    private HallazgoDTO toDTO(Hallazgo hallazgo) {
        return HallazgoDTO.builder()
                .id(hallazgo.getId())
                .auditoriaId(hallazgo.getAuditoriaId())
                .evidenciaId(hallazgo.getEvidenciaId())
                .categoria(hallazgo.getCategoria())
                .descripcion(hallazgo.getDescripcion())
                .prioridad(hallazgo.getPrioridad())
                .accionCorrectiva(hallazgo.getAccionCorrectiva())
                .estaResuelto(hallazgo.isEstaResuelto())
                .fechaHallazgo(hallazgo.getFechaHallazgo())
                .build();
    }

    private Hallazgo toEntity(HallazgoDTO hallazgoDTO) {
        return Hallazgo.builder()
                .id(hallazgoDTO.getId())
                .auditoriaId(hallazgoDTO.getAuditoriaId())
                .evidenciaId(hallazgoDTO.getEvidenciaId())
                .categoria(hallazgoDTO.getCategoria())
                .descripcion(hallazgoDTO.getDescripcion())
                .prioridad(hallazgoDTO.getPrioridad())
                .accionCorrectiva(hallazgoDTO.getAccionCorrectiva())
                .estaResuelto(hallazgoDTO.isEstaResuelto())
                .fechaHallazgo(hallazgoDTO.getFechaHallazgo())
                .build();
    }
}
