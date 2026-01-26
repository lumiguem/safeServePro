package com.safeserve.backend.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEstablecimientoRequest {
    private String nombre;
    private String direccion;
    private int riesgoActual;
}
