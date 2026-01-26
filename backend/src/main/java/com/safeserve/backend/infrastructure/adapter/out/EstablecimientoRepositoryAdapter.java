package com.safeserve.backend.infrastructure.adapter.out;

import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.domain.port.out.EstablecimientoRepositoryPort;
import com.safeserve.backend.infrastructure.adapter.out.mapper.EstablecimientoMapper;
import com.safeserve.backend.infrastructure.persistance.repository.EstablecimientoJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class EstablecimientoRepositoryAdapter implements EstablecimientoRepositoryPort {

    private final EstablecimientoJpaRepository jpaRepository;

    public EstablecimientoRepositoryAdapter(EstablecimientoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Establecimiento> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(EstablecimientoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Establecimiento> findById(String id) {
        return jpaRepository.findById(id)
                .map(EstablecimientoMapper::toDomain);
    }

    @Override
    public Establecimiento save(Establecimiento establecimiento) {
        var entity = EstablecimientoMapper.toEntity(establecimiento);
        var saved = jpaRepository.save(entity);
        return EstablecimientoMapper.toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
}
