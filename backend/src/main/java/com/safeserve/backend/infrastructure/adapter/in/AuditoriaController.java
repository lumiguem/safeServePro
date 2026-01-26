package com.safeserve.backend.infrastructure.adapter.in;

import com.safeserve.backend.application.dto.AuditoriaDTO;
import com.safeserve.backend.domain.model.Auditoria;
import com.safeserve.backend.domain.port.in.CreateAuditoriaPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auditorias")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditoriaController {

    private final CreateAuditoriaPort createAuditoriaPort;

    public AuditoriaController(CreateAuditoriaPort createAuditoriaPort) {
        this.createAuditoriaPort = createAuditoriaPort;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AuditoriaDTO crearAuditoria(@RequestBody AuditoriaDTO dto) {

        Auditoria auditoria = createAuditoriaPort.crearAuditoria(
                dto.getEstablecimientoId(),
                dto.getPlantillaId()
        );

        return AuditoriaDTO.fromDomain(auditoria);
    }
}
