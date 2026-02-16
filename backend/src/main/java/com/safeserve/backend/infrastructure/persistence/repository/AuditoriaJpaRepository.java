package com.safeserve.backend.infrastructure.persistence.repository;


import com.safeserve.backend.infrastructure.persistence.entity.AuditoriaEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AuditoriaJpaRepository
        extends JpaRepository<AuditoriaEntity, String> {

    @Query("""
        SELECT
            a.id AS id,
            a.establecimientoId AS establecimientoId,
            e.nombre AS establecimientoNombre,
            a.plantillaId AS plantillaId,
            p.titulo AS plantillaLabel,
            COUNT(h.id) AS numeroHallazgos,
            a.progreso AS progreso,
            a.puntuacionCumplimiento AS puntuacionCumplimiento
        FROM AuditoriaEntity a
        LEFT JOIN EstablecimientoEntity e ON e.id = a.establecimientoId
        LEFT JOIN PlantillaEntity p ON p.id = a.plantillaId
        LEFT JOIN HallazgoEntity h ON h.auditoriaId = a.id
        GROUP BY a.id, a.establecimientoId, e.nombre, a.plantillaId, p.titulo, a.progreso, a.puntuacionCumplimiento
    """)
    List<AuditoriaListProjection> findAllWithNames();

    @Modifying
    @Transactional
    @Query("""
        UPDATE AuditoriaEntity a
        SET a.progreso = :progreso,
            a.puntuacionCumplimiento = :puntuacionCumplimiento
        WHERE a.id = :id
    """)
    int updateResultadoById(
            @Param("id") String id,
            @Param("progreso") int progreso,
            @Param("puntuacionCumplimiento") int puntuacionCumplimiento
    );

    @Modifying
    @Transactional
    @Query("""
        UPDATE AuditoriaEntity a
        SET a.puntuacionCumplimiento = :puntuacionCumplimiento
        WHERE a.id = :id
    """)
    int updatePuntuacionCumplimientoById(
            @Param("id") String id,
            @Param("puntuacionCumplimiento") int puntuacionCumplimiento
    );
}
