package com.safeserve.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "auditorias")
@Getter
@Setter
public class AuditoriaEntity {

    @Id
    private String id;

    @Column(name = "establecimiento_id")
    private String establecimientoId;

    @Column(name = "plantilla_id")
    private String plantillaId;

    private int progreso;

    @Column(name = "puntuacion_cumplimiento")
    private int puntuacionCumplimiento;
}