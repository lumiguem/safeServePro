package com.safeserve.backend.domain.repository.in;


import com.safeserve.backend.domain.model.Auditoria;

public interface CreateAuditoriaPort {
    Auditoria crearAuditoria(String establecimientoId, String plantillaId);
}
