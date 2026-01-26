package com.safeserve.backend.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plantilla {

    private String id;
    private String titulo;
    private String categoria;
    private String descripcion;

    public void actualizar(String titulo, String categoria, String descripcion) {
        this.titulo = titulo;
        this.categoria = categoria;
        this.descripcion = descripcion;
    }
}
