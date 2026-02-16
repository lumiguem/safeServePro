package com.safeserve.backend.infrastructure.persistence.repository;


import com.safeserve.backend.infrastructure.persistence.entity.PlantillaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlantillaJpaRepository extends JpaRepository<PlantillaEntity, String> {
    @Query("""
        SELECT p
        FROM PlantillaEntity p
        LEFT JOIN FETCH p.items
    """)
    List<PlantillaEntity> findAllWithItems();
}

