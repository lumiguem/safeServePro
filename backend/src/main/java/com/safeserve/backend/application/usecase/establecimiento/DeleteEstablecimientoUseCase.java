package com.safeserve.backend.application.usecase.establecimiento;

import com.safeserve.backend.domain.repository.out.EstablecimientoRepositoryPort;

public class DeleteEstablecimientoUseCase {

    private final EstablecimientoRepositoryPort repository;

    public DeleteEstablecimientoUseCase(EstablecimientoRepositoryPort repository) {
        this.repository = repository;
    }

    public void execute(String id) {
        repository.deleteById(id);
    }
}
