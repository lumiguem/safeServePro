package com.safeserve.backend.interfaces;

import com.safeserve.backend.application.dto.AuditoriaDTO;
import com.safeserve.backend.application.usecase.DeleteAuditoriaUseCase;
import com.safeserve.backend.application.usecase.ListAuditoriasUseCase;
import com.safeserve.backend.application.usecase.UpdateAuditoriaPuntuacionUseCase;
import com.safeserve.backend.domain.model.Auditoria;
import com.safeserve.backend.domain.repository.in.CreateAuditoriaPort;
import com.safeserve.backend.interfaces.response.ApiResponse;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditorias")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class AuditoriaController {

    private final CreateAuditoriaPort createAuditoriaPort;
    private final ListAuditoriasUseCase listAuditoriasUseCase;
    private final DeleteAuditoriaUseCase deleteAuditoriaUseCase;
    private final UpdateAuditoriaPuntuacionUseCase updateAuditoriaPuntuacionUseCase;

    public AuditoriaController(
            CreateAuditoriaPort createAuditoriaPort,
            ListAuditoriasUseCase listAuditoriasUseCase,
            DeleteAuditoriaUseCase deleteAuditoriaUseCase,
            UpdateAuditoriaPuntuacionUseCase updateAuditoriaPuntuacionUseCase
    ) {
        this.createAuditoriaPort = createAuditoriaPort;
        this.listAuditoriasUseCase = listAuditoriasUseCase;
        this.deleteAuditoriaUseCase = deleteAuditoriaUseCase;
        this.updateAuditoriaPuntuacionUseCase = updateAuditoriaPuntuacionUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditoriaDTO>>> listarAuditorias() {
        List<AuditoriaDTO> auditorias = listAuditoriasUseCase.execute()
                .stream()
                .map(AuditoriaDTO::fromDomain)
                .toList();

        return ResponseEntity.ok(new ApiResponse<>(auditorias));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuditoriaDTO>> crearAuditoria(
            @RequestBody AuditoriaDTO dto
    ) {

        Auditoria auditoria = createAuditoriaPort.crearAuditoria(
                dto.getEstablecimientoId(),
                dto.getPlantillaId()
        );

        AuditoriaDTO response = AuditoriaDTO.fromDomain(auditoria);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        response,
                        "Auditoría creada correctamente"
                ));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuditoria(@PathVariable String id) {
        try {
            deleteAuditoriaUseCase.execute(id);
            return ResponseEntity.noContent().build();
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/puntuacion-cumplimiento")
    public ResponseEntity<ApiResponse<Void>> updatePuntuacionCumplimiento(
            @PathVariable String id,
            @RequestBody AuditoriaDTO dto
    ) {
        boolean updated = updateAuditoriaPuntuacionUseCase.execute(
                id,
                dto.getProgreso(),
                dto.getPuntuacionCumplimiento()
        );
        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(null, "Auditoria no encontrada"));
        }

        return ResponseEntity.ok(new ApiResponse<>(null, "Puntuacion de cumplimiento actualizada"));
    }
}

