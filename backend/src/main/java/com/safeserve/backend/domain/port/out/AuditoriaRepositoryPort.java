package com.safeserve.backend.domain.port.out;


import com.safeserve.backend.domain.model.Auditoria;

public interface AuditoriaRepositoryPort {
    Auditoria save(Auditoria auditoria);
}
