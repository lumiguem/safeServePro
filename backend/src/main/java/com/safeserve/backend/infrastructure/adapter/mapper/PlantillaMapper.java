package com.safeserve.backend.infrastructure.adapter.mapper;

import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.model.PlantillaItem;
import com.safeserve.backend.infrastructure.persistance.entity.PlantillaEntity;
import com.safeserve.backend.infrastructure.persistance.entity.PlantillaItemEntity;

import java.util.Collections;
import java.util.List;

public class PlantillaMapper {

    public static Plantilla toDomain(PlantillaEntity entity) {

        List<PlantillaItem> items = entity.getItems() == null
                ? Collections.emptyList()
                : entity.getItems()
                .stream()
                .map(PlantillaMapper::toDomainItem)
                .toList();

        return new Plantilla(
                entity.getId(),
                entity.getTitulo(),
                entity.getCategoria(),
                entity.getDescripcion(),
                items
        );
    }

    private static PlantillaItem toDomainItem(PlantillaItemEntity entity) {
        return new PlantillaItem(
                entity.getTarea(),
                entity.isEsCritico()
        );
    }
}
