package com.safeserve.backend.application.usecase.plantilla;

import com.safeserve.backend.domain.port.out.PlantillaRepositoryPort;

public class DeletePlantillaUseCase {

    private final PlantillaRepositoryPort repository;

    public DeletePlantillaUseCase(PlantillaRepositoryPort repository) {
        this.repository = repository;
    }

    public void execute(String id) {
        repository.deleteById(id);
    }
}

