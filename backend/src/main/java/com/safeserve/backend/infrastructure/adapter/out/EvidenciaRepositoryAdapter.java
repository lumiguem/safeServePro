package com.safeserve.backend.infrastructure.adapter.out;

import com.safeserve.backend.domain.model.Evidencia;
import com.safeserve.backend.domain.repository.out.EvidenciaRepositoryPort;
import com.safeserve.backend.infrastructure.adapter.mapper.EvidenciaMapper;
import com.safeserve.backend.infrastructure.persistence.repository.EvidenciaJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class EvidenciaRepositoryAdapter implements EvidenciaRepositoryPort {

    private final EvidenciaJpaRepository repository;

    public EvidenciaRepositoryAdapter(EvidenciaJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Evidencia save(Evidencia evidencia) {
        var entity = EvidenciaMapper.toEntity(evidencia);
        var saved = repository.save(entity);
        return EvidenciaMapper.toDomain(saved);
    }

    @Override
    public Optional<Evidencia> findById(Long id) {
        return repository.findById(id)
                .map(EvidenciaMapper::toDomain);
    }

    @Override
    public List<Evidencia> findAll() {
        return repository.findAll()
                .stream()
                .map(EvidenciaMapper::toDomain)
                .toList();
    }

    @Override
    public List<Evidencia> findByAuditoriaId(String auditoriaId) {
        return repository.findByAuditoriaId(auditoriaId)
                .stream()
                .map(EvidenciaMapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
