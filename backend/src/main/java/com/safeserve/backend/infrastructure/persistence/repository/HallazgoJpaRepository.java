package com.safeserve.backend.infrastructure.persistence.repository;

import com.safeserve.backend.infrastructure.persistence.entity.HallazgoEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface HallazgoJpaRepository extends JpaRepository<HallazgoEntity, Long> {
    // Borra hallazgos ligados a una auditoria para permitir eliminar la auditoria sin conflictos FK.
    @Modifying
    @Transactional
    @Query("DELETE FROM HallazgoEntity h WHERE h.auditoriaId = :auditoriaId")
    int deleteByAuditoriaId(@Param("auditoriaId") String auditoriaId);
}
