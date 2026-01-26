package com.safeserve.backend.domain.model;


public class PlantillaItem {

    private final String tarea;
    private final boolean esCritico;

    public PlantillaItem(String tarea, boolean esCritico) {
        this.tarea = tarea;
        this.esCritico = esCritico;
    }

    public String getTarea() {
        return tarea;
    }

    public boolean isEsCritico() {
        return esCritico;
    }
}
