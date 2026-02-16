package com.safeserve.backend.infrastructure.persistence.repository;

public interface AuditoriaListProjection {
    String getId();
    String getEstablecimientoId();
    String getEstablecimientoNombre();
    String getPlantillaId();
    String getPlantillaLabel();
    long getNumeroHallazgos();
    int getProgreso();
    int getPuntuacionCumplimiento();
}
