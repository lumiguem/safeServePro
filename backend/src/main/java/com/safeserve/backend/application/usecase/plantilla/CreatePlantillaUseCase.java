package com.safeserve.backend.application.usecase.plantilla;

import com.safeserve.backend.application.dto.CreatePlantillaRequest;
import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.model.PlantillaItem;
import com.safeserve.backend.domain.port.out.PlantillaRepositoryPort;

import java.util.Collections;
import java.util.List;

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

        Plantilla plantilla = new Plantilla(
                request.getId(),
                request.getTitulo(),
                request.getCategoria(),
                request.getDescripcion(),
                items
        );

        repository.save(plantilla);
    }
}
