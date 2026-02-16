package com.safeserve.backend.application.usecase.plantilla;

import com.safeserve.backend.application.dto.CreatePlantillaRequest;
import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.model.PlantillaItem;
import com.safeserve.backend.domain.repository.out.PlantillaRepositoryPort;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class CreatePlantillaUseCase {

    private final PlantillaRepositoryPort repository;

    public CreatePlantillaUseCase(PlantillaRepositoryPort repository) {
        this.repository = repository;
    }

    public void execute(CreatePlantillaRequest request) {

        List<PlantillaItem> items = request.getItems() == null
                ? Collections.emptyList()
                : request.getItems()
                .stream()
                .map(item -> new PlantillaItem(
                        item.getTarea(),
                        item.isEsCritico()
                ))
                .toList();

        String plantillaId = request.getId();
        if (plantillaId == null || plantillaId.isBlank()) {
            plantillaId = "TPL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        Plantilla plantilla = new Plantilla(
                plantillaId,
                request.getTitulo(),
                request.getCategoria(),
                request.getDescripcion(),
                items
        );

        repository.save(plantilla);
    }
}
