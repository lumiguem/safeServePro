package com.safeserve.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "establecimientos")
@Getter
@Setter
public class EstablecimientoEntity {

    @Id
    private String id;

    @Column (name = "nombre")
    private String nombre;

    @Column (name= "direccion")
    private String direccion;

    @Column(name = "riesgo_actual")
    private int riesgoActual;


}

