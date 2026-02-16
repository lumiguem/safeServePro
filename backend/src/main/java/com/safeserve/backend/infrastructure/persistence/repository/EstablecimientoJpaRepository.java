package com.safeserve.backend.infrastructure.persistence.repository;

import com.safeserve.backend.infrastructure.persistence.entity.EstablecimientoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstablecimientoJpaRepository
        extends JpaRepository<EstablecimientoEntity, String> {
}
