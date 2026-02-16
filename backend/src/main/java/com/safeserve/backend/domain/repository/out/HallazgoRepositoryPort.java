package com.safeserve.backend.domain.repository.out;

import com.safeserve.backend.domain.model.Hallazgo;

import java.util.List;
import java.util.Optional;

public interface HallazgoRepositoryPort {
    Hallazgo save(Hallazgo hallazgo);

    List<Hallazgo> saveAll(List<Hallazgo> hallazgos);

    Optional<Hallazgo> findById(Long id);

    List<Hallazgo> findAll();

    void deleteById(Long id);
}
