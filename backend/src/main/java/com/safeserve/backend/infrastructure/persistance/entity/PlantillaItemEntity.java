package com.safeserve.backend.infrastructure.persistance.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "plantilla_items")
public class PlantillaItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tarea;

    @Column(name = "es_critico")
    private boolean esCritico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plantilla_id")
    private PlantillaEntity plantilla;

    public Long getId() {
        return id;
    }

    public String getTarea() {
        return tarea;
    }

    public boolean isEsCritico() {
        return esCritico;
    }

    public PlantillaEntity getPlantilla() {
        return plantilla;
    }
}
