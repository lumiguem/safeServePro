package com.safeserve.backend.domain.repository.out;


import com.safeserve.backend.domain.model.Auditoria;

import java.util.List;
import java.util.Optional;

public interface AuditoriaRepositoryPort {
    Auditoria save(Auditoria auditoria);

    List<Auditoria> findAll();

    List<Auditoria> findAllWithNames();

    Optional<Auditoria> findByIdWithNames(String id);

    boolean updateResultado(String id, int progreso, int puntuacionCumplimiento);

    void deleteById(String id);
}
