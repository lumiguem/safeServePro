package com.safeserve.backend.infrastructure.adapter.mapper;

import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.infrastructure.persistance.entity.EstablecimientoEntity;

public class EstablecimientoMapper {

    public static EstablecimientoEntity toEntity(Establecimiento domain) {
        EstablecimientoEntity entity = new EstablecimientoEntity();
        entity.setId(domain.getId());
        entity.setNombre(domain.getNombre());
        entity.setDireccion(domain.getDireccion());
        entity.setRiesgoActual(domain.getRiesgoActual());
        return entity;
    }

    public static Establecimiento toDomain(EstablecimientoEntity entity) {
        return new Establecimiento(
                entity.getId(),
                entity.getNombre(),
                entity.getDireccion(),
                entity.getRiesgoActual()
        );
    }
}
