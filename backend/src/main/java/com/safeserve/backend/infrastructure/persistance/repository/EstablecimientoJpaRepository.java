package com.safeserve.backend.infrastructure.persistance.repository;

import com.safeserve.backend.infrastructure.persistance.entity.EstablecimientoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstablecimientoJpaRepository
        extends JpaRepository<EstablecimientoEntity, String> {
}
