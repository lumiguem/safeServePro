package com.safeserve.backend.domain.model;

public class Auditoria {

    private final String id;
    private final String establecimientoId;
    private final String plantillaId;
    private final String establecimientoNombre;
    private final String plantillaLabel;
    private final long numeroHallazgos;
    private int progreso;
    private int puntuacionCumplimiento;

    // Constructor para CREAR una auditoría nueva
    public Auditoria(String id, String establecimientoId, String plantillaId) {
        this.id = id;
        this.establecimientoId = establecimientoId;
        this.plantillaId = plantillaId;
        this.establecimientoNombre = null;
        this.plantillaLabel = null;
        this.numeroHallazgos = 0;
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
        this.establecimientoNombre = null;
        this.plantillaLabel = null;
        this.numeroHallazgos = 0;
        this.progreso = progreso;
        this.puntuacionCumplimiento = puntuacionCumplimiento;
    }

    public Auditoria(
            String id,
            String establecimientoId,
            String establecimientoNombre,
            String plantillaId,
            String plantillaLabel,
            long numeroHallazgos,
            int progreso,
            int puntuacionCumplimiento
    ) {
        this.id = id;
        this.establecimientoId = establecimientoId;
        this.establecimientoNombre = establecimientoNombre;
        this.plantillaId = plantillaId;
        this.plantillaLabel = plantillaLabel;
        this.numeroHallazgos = numeroHallazgos;
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

    public String getEstablecimientoNombre() {
        return establecimientoNombre;
    }

    public String getPlantillaLabel() {
        return plantillaLabel;
    }

    public long getNumeroHallazgos() {
        return numeroHallazgos;
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
