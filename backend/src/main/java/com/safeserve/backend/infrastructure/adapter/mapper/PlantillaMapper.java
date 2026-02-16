package com.safeserve.backend.infrastructure.adapter.mapper;

import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.model.PlantillaItem;
import com.safeserve.backend.infrastructure.persistence.entity.PlantillaEntity;
import com.safeserve.backend.infrastructure.persistence.entity.PlantillaItemEntity;

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

    public static PlantillaEntity toEntity(Plantilla domain) {
        PlantillaEntity entity = new PlantillaEntity();
        entity.setId(domain.getId());
        entity.setTitulo(domain.getTitulo());
        entity.setCategoria(domain.getCategoria());
        entity.setDescripcion(domain.getDescripcion());

        List<PlantillaItemEntity> items = domain.getItems() == null
                ? Collections.emptyList()
                : domain.getItems()
                .stream()
                .map(item -> toEntityItem(item, entity))
                .toList();

        entity.setItems(items);
        return entity;
    }

    private static PlantillaItemEntity toEntityItem(PlantillaItem domain, PlantillaEntity plantilla) {
        PlantillaItemEntity entity = new PlantillaItemEntity();
        entity.setTarea(domain.getTarea());
        entity.setEsCritico(domain.isEsCritico());
        entity.setPlantilla(plantilla);
        return entity;
    }
}
