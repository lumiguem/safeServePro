package com.safeserve.backend.domain.repository.out;

import com.safeserve.backend.domain.model.Plantilla;

import java.util.List;
import java.util.Optional;

public interface PlantillaRepositoryPort {

    void save(Plantilla plantilla);

    Optional<Plantilla> findById(String id);

    List<Plantilla> findAll();

    void deleteById(String id);
}
