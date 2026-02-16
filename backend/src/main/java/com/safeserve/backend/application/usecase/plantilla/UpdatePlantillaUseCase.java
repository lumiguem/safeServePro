package com.safeserve.backend.application.usecase.plantilla;

import com.safeserve.backend.application.dto.CreatePlantillaItemRequest;
import com.safeserve.backend.application.dto.CreatePlantillaRequest;
import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.model.PlantillaItem;
import com.safeserve.backend.domain.repository.out.PlantillaRepositoryPort;

import java.util.Collections;
import java.util.List;

public class UpdatePlantillaUseCase {

    private final PlantillaRepositoryPort repository;

    public UpdatePlantillaUseCase(PlantillaRepositoryPort repository) {
        this.repository = repository;
    }

    public void execute(String id, CreatePlantillaRequest request) {
        Plantilla plantilla = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));

        List<PlantillaItem> items = request.getItems() == null
                ? Collections.emptyList()
                : request.getItems()
                .stream()
                .map(this::toDomainItem)
                .toList();

        plantilla.actualizar(
                request.getTitulo(),
                request.getCategoria(),
                request.getDescripcion(),
                items
        );

        repository.save(plantilla);
    }

    private PlantillaItem toDomainItem(CreatePlantillaItemRequest item) {
        return new PlantillaItem(item.getTarea(), item.isEsCritico());
    }
}
