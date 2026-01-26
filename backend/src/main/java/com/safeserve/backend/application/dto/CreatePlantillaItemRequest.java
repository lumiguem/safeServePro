package com.safeserve.backend.application.dto;

public class CreatePlantillaItemRequest {
    private String tarea;
    private boolean esCritico;

    public boolean isEsCritico() {
        return esCritico;
    }

    public void setEsCritico(boolean esCritico) {
        this.esCritico = esCritico;
    }

    public String getTarea() {
        return tarea;
    }

    public void setTarea(String tarea) {
        this.tarea = tarea;
    }
}
