package com.safeserve.backend.application.usecase;

import com.safeserve.backend.domain.repository.out.AuditoriaRepositoryPort;

public class DeleteAuditoriaUseCase {

    private final AuditoriaRepositoryPort repository;

    public DeleteAuditoriaUseCase(AuditoriaRepositoryPort repository) {
        this.repository = repository;
    }

    public void execute(String auditoriaId) {
        repository.deleteById(auditoriaId);
    }
}
