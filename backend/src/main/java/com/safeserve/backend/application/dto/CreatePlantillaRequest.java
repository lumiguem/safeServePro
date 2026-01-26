package com.safeserve.backend.application.dto;


import java.util.List;

public class CreatePlantillaRequest {

    private String id;
    private String titulo;
    private String categoria;
    private String descripcion;
    private List<CreatePlantillaItemRequest> items;

    public CreatePlantillaRequest() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<CreatePlantillaItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreatePlantillaItemRequest> items) {
        this.items = items;
    }
}
