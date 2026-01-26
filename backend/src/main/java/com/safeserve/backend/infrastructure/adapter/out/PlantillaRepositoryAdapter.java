package com.safeserve.backend.infrastructure.adapter.out;

import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.domain.port.out.PlantillaRepositoryPort;
import com.safeserve.backend.infrastructure.adapter.mapper.PlantillaMapper;
import com.safeserve.backend.infrastructure.persistance.repository.PlantillaJpaRepository;

import java.util.List;
import java.util.Optional;

public class PlantillaRepositoryAdapter implements PlantillaRepositoryPort {

    private final PlantillaJpaRepository repository;

    public PlantillaRepositoryAdapter(PlantillaJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Plantilla> findAll() {
        return repository.findAllWithItems()
                .stream()
                .map(PlantillaMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Plantilla> findById(String id) {
        return repository.findById(id)
                .map(PlantillaMapper::toDomain);
    }

    @Override
    public void save(Plantilla plantilla) {
        throw new UnsupportedOperationException("Implementar en siguiente iteración");
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
