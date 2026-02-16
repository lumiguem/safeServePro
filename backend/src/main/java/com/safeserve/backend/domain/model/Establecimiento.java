package com.safeserve.backend.domain.model;

    public class Establecimiento {

    private final String id;
    private String nombre;
    private String direccion;
    private int riesgoActual;

    public Establecimiento(String id, String nombre, String direccion, int riesgoActual) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.riesgoActual = riesgoActual;
    }

    public String getId() {
        return id;
    }

        public String getNombre() {
            return nombre;
        }

    public String getDireccion() {
        return direccion;
    }

    public int getRiesgoActual() {
        return riesgoActual;
    }

    public void actualizarRiesgo(int nuevoRiesgo) {
        this.riesgoActual = nuevoRiesgo;
    }

    public void actualizarDatos(String nombre, String direccion, int riesgoActual) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.riesgoActual = riesgoActual;
    }
}
