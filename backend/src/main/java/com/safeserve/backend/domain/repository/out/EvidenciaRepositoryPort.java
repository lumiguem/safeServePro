package com.safeserve.backend.domain.repository.out;

import com.safeserve.backend.domain.model.Evidencia;

import java.util.List;
import java.util.Optional;

public interface EvidenciaRepositoryPort {
    Evidencia save(Evidencia evidencia);

    Optional<Evidencia> findById(Long id);

    List<Evidencia> findAll();

    void deleteById(Long id);
}
