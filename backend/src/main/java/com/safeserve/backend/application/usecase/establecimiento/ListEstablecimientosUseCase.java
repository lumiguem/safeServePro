package com.safeserve.backend.application.usecase.establecimiento;

import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.domain.port.out.EstablecimientoRepositoryPort;

import java.util.List;

public class ListEstablecimientosUseCase {

    private final EstablecimientoRepositoryPort repository;

    public ListEstablecimientosUseCase(EstablecimientoRepositoryPort repository) {
        this.repository = repository;
    }

    public List<Establecimiento> execute() {
        return repository.findAll();
    }
}
