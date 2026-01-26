package com.safeserve.backend.domain.model;

public class Hallazgo {

    private final Long id;
    private final Long auditoriaId;
    private boolean resuelto;

    public Hallazgo(Long id, Long auditoriaId) {
        this.id = id;
        this.auditoriaId = auditoriaId;
        this.resuelto = false;
    }

    public void resolver() {
        this.resuelto = true;
    }

    public boolean isResuelto() {
        return resuelto;
    }
}
