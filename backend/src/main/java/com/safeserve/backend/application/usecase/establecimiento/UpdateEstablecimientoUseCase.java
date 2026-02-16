package com.safeserve.backend.application.usecase.establecimiento;

import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.domain.repository.out.EstablecimientoRepositoryPort;

public class UpdateEstablecimientoUseCase {

    private final EstablecimientoRepositoryPort repository;

    public UpdateEstablecimientoUseCase(EstablecimientoRepositoryPort repository) {
        this.repository = repository;
    }

    public Establecimiento execute(String id, String nombre, String direccion, int nuevoRiesgo) {
        Establecimiento est = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Establecimiento no encontrado"));

        est.actualizarDatos(nombre, direccion, nuevoRiesgo);
        return repository.save(est);
    }
}
