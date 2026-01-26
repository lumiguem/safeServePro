package com.safeserve.backend.application.usecase.establecimiento;


import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.domain.port.in.CreateEstablecimientoPort;
import com.safeserve.backend.domain.port.out.EstablecimientoRepositoryPort;

import java.util.UUID;

public class CreateEstablecimientoUseCase implements CreateEstablecimientoPort {

    private final EstablecimientoRepositoryPort repository;

    public CreateEstablecimientoUseCase(EstablecimientoRepositoryPort repository) {
        this.repository = repository;
    }

    @Override
    public Establecimiento crearEstablecimiento(String nombre, String direccion, int riesgoActual) {

        String id = "LOC-" + UUID.randomUUID()
                .toString()
                .substring(0, 3)
                .toUpperCase();

        Establecimiento establecimiento = new Establecimiento(
                id,
                nombre,
                direccion,
                riesgoActual
        );

        repository.save(establecimiento);
        return establecimiento;
    }
}
