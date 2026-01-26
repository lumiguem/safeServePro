package com.safeserve.backend.infrastructure.persistance.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "plantillas")
public class PlantillaEntity {

    @Id
    private String id;

    private String titulo;
    private String categoria;
    private String descripcion;
    @OneToMany(
            mappedBy = "plantilla",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<PlantillaItemEntity> items;

    public String getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public List<PlantillaItemEntity> getItems() {
        return items;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setItems(List<PlantillaItemEntity> items) {this.items = items;}
}
