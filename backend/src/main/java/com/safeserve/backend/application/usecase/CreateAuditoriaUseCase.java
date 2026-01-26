package com.safeserve.backend.application.usecase;


import com.safeserve.backend.domain.model.Auditoria;
import com.safeserve.backend.domain.port.in.CreateAuditoriaPort;
import com.safeserve.backend.domain.port.out.AuditoriaRepositoryPort;

import java.util.UUID;

public class CreateAuditoriaUseCase implements CreateAuditoriaPort {

    private final AuditoriaRepositoryPort repository;

    public CreateAuditoriaUseCase(AuditoriaRepositoryPort repository) {
        this.repository = repository;
    }

    @Override
    public Auditoria crearAuditoria(String establecimientoId, String plantillaId) {

        String id = "AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Auditoria auditoria = new Auditoria(
                id,
                establecimientoId,
                plantillaId
        );

        repository.save(auditoria);
        return auditoria;
    }
}
