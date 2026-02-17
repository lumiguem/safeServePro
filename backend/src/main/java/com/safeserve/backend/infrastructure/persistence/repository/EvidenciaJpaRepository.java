package com.safeserve.backend.infrastructure.persistence.repository;

import com.safeserve.backend.infrastructure.persistence.entity.EvidenciaEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EvidenciaJpaRepository extends JpaRepository<EvidenciaEntity, Long> {

    List<EvidenciaEntity> findByAuditoriaId(String auditoriaId);

    // Borra evidencias de la auditoria antes del delete final de auditoria.
    @Modifying
    @Transactional
    @Query("DELETE FROM EvidenciaEntity e WHERE e.auditoriaId = :auditoriaId")
    int deleteByAuditoriaId(@Param("auditoriaId") String auditoriaId);
}
