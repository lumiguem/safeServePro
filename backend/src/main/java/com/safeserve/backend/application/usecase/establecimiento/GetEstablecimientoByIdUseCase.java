package com.safeserve.backend.application.usecase.establecimiento;

import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.domain.port.out.EstablecimientoRepositoryPort;

public class GetEstablecimientoByIdUseCase {

    private final EstablecimientoRepositoryPort repository;

    public GetEstablecimientoByIdUseCase(EstablecimientoRepositoryPort repository) {
        this.repository = repository;
    }

    public Establecimiento execute(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Establecimiento no encontrado"));
    }
}
