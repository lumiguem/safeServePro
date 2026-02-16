package com.safeserve.backend.application.usecase;

import com.safeserve.backend.domain.repository.out.AuditoriaRepositoryPort;

public class UpdateAuditoriaPuntuacionUseCase {

    private final AuditoriaRepositoryPort repository;

    public UpdateAuditoriaPuntuacionUseCase(AuditoriaRepositoryPort repository) {
        this.repository = repository;
    }

    public boolean execute(String auditoriaId, int progreso, int puntuacionCumplimiento) {
        return repository.updateResultado(auditoriaId, progreso, puntuacionCumplimiento);
    }
}
