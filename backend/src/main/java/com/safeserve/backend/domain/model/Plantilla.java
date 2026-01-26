package com.safeserve.backend.domain.model;

import lombok.*;

import java.util.List;

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
    private List<PlantillaItem> items;

    public void actualizar(String titulo, String categoria, String descripcion, List<PlantillaItem> items) {
        this.titulo = titulo;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.items = items;
    }
}
