package com.safeserve.backend.application.usecase.plantilla;

import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.repository.out.PlantillaRepositoryPort;

public class GetPlantillaByIdUseCase {

    private final PlantillaRepositoryPort repository;

    public GetPlantillaByIdUseCase(PlantillaRepositoryPort repository) {
        this.repository = repository;
    }

    public Plantilla execute(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
    }
}
