package com.safeserve.backend.application.usecase;

import com.safeserve.backend.domain.model.Auditoria;
import com.safeserve.backend.domain.repository.out.AuditoriaRepositoryPort;

import java.util.List;

public class ListAuditoriasUseCase {

    private final AuditoriaRepositoryPort repository;

    public ListAuditoriasUseCase(AuditoriaRepositoryPort repository) {
        this.repository = repository;
    }

    public List<Auditoria> execute() {
        return repository.findAllWithNames();
    }
}
