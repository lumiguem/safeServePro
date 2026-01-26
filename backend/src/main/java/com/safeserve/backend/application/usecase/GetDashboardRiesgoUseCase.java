package com.safeserve.backend.application.usecase;


import com.safeserve.backend.domain.port.out.EstablecimientoRepositoryPort;

public class GetDashboardRiesgoUseCase {

    private final EstablecimientoRepositoryPort repository;

    public GetDashboardRiesgoUseCase(EstablecimientoRepositoryPort repository) {
        this.repository = repository;
    }

    public int obtenerRiesgo(String establecimientoId) {
        return repository.findById(establecimientoId)
                .map(e -> e.getRiesgoActual())
                .orElse(0);
    }
}
