package com.safeserve.backend.infrastructure.persistance.repository;


import com.safeserve.backend.infrastructure.persistance.entity.AuditoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaJpaRepository
        extends JpaRepository<AuditoriaEntity, String> {
}
