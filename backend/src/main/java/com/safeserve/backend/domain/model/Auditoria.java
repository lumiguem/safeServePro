package com.safeserve.backend.domain.model;

public class Auditoria {

    private final String id;
    private final String establecimientoId;
    private final String plantillaId;
    private int progreso;
    private int puntuacionCumplimiento;

    // Constructor para CREAR una auditoría nueva
    public Auditoria(String id, String establecimientoId, String plantillaId) {
        this.id = id;
        this.establecimientoId = establecimientoId;
        this.plantillaId = plantillaId;
        this.progreso = 0;
        this.puntuacionCumplimiento = 0;
    }

    // Constructor para REHIDRATAR desde persistencia
    public Auditoria(
            String id,
            String establecimientoId,
            String plantillaId,
            int progreso,
            int puntuacionCumplimiento
    ) {
        this.id = id;
        this.establecimientoId = establecimientoId;
        this.plantillaId = plantillaId;
        this.progreso = progreso;
        this.puntuacionCumplimiento = puntuacionCumplimiento;
    }

    public String getId() {
        return id;
    }

    public String getEstablecimientoId() {
        return establecimientoId;
    }

    public String getPlantillaId() {
        return plantillaId;
    }

    public int getProgreso() {
        return progreso;
    }

    public int getPuntuacionCumplimiento() {
        return puntuacionCumplimiento;
    }

    public void actualizarProgreso(int progreso) {
        this.progreso = progreso;
    }

    public void calcularPuntuacion(int puntuacion) {
        this.puntuacionCumplimiento = puntuacion;
    }
}
