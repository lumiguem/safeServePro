package com.safeserve.backend.infrastructure.persistence.repository;

import java.time.LocalDateTime;

public interface AuditoriaListProjection {
    String getId();
    String getEstablecimientoId();
    String getEstablecimientoNombre();
    String getPlantillaId();
    String getPlantillaLabel();
    long getNumeroHallazgos();
    int getProgreso();
    int getPuntuacionCumplimiento();
    LocalDateTime getFechaAuditoria();
}
