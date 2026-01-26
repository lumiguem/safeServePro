package com.safeserve.backend.application.usecase.plantilla;
import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.port.out.PlantillaRepositoryPort;

import java.util.List;

public class ListPlantillasUseCase {

    private final PlantillaRepositoryPort repository;

    public ListPlantillasUseCase(PlantillaRepositoryPort repository) {
        this.repository = repository;
    }

    public List<Plantilla> execute() {
        return repository.findAll();
    }
}