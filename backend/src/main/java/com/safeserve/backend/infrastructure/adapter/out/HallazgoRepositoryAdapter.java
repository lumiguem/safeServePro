package com.safeserve.backend.infrastructure.adapter.out;

import com.safeserve.backend.domain.model.Hallazgo;
import com.safeserve.backend.domain.repository.out.HallazgoRepositoryPort;
import com.safeserve.backend.infrastructure.adapter.mapper.HallazgoMapper;
import com.safeserve.backend.infrastructure.persistence.entity.EvidenciaEntity;
import com.safeserve.backend.infrastructure.persistence.repository.EvidenciaJpaRepository;
import com.safeserve.backend.infrastructure.persistence.repository.HallazgoJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class HallazgoRepositoryAdapter implements HallazgoRepositoryPort {

    private final HallazgoJpaRepository repository;
    private final EvidenciaJpaRepository evidenciaRepository;

    public HallazgoRepositoryAdapter(
            HallazgoJpaRepository repository,
            EvidenciaJpaRepository evidenciaRepository
    ) {
        this.repository = repository;
        this.evidenciaRepository = evidenciaRepository;
    }

    @Override
    public Hallazgo save(Hallazgo hallazgo) {
        var evidenciaEntity = resolveEvidencia(hallazgo.getEvidenciaId());
        var entity = HallazgoMapper.toEntity(hallazgo, evidenciaEntity);
        var saved = repository.save(entity);
        return HallazgoMapper.toDomain(saved);
    }

    @Override
    public List<Hallazgo> saveAll(List<Hallazgo> hallazgos) {
        var entities = hallazgos.stream()
                .map(h -> HallazgoMapper.toEntity(h, resolveEvidencia(h.getEvidenciaId())))
                .toList();
        return repository.saveAll(entities)
                .stream()
                .map(HallazgoMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Hallazgo> findById(Long id) {
        return repository.findById(id)
                .map(HallazgoMapper::toDomain);
    }

    @Override
    public List<Hallazgo> findAll() {
        return repository.findAll()
                .stream()
                .map(HallazgoMapper::toDomain)
                .toList();
    }

    private EvidenciaEntity resolveEvidencia(Long evidenciaId) {
        if (evidenciaId == null) {
            return null;
        }
        return evidenciaRepository.findById(evidenciaId)
                .orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
