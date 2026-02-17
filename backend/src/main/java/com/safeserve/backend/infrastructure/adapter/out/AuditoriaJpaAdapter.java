package com.safeserve.backend.infrastructure.adapter.out;

import com.safeserve.backend.domain.model.Auditoria;
import com.safeserve.backend.domain.repository.out.AuditoriaRepositoryPort;
import com.safeserve.backend.infrastructure.persistence.entity.AuditoriaEntity;
import com.safeserve.backend.infrastructure.persistence.repository.AuditoriaJpaRepository;
import com.safeserve.backend.infrastructure.persistence.repository.EvidenciaJpaRepository;
import com.safeserve.backend.infrastructure.persistence.repository.HallazgoJpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
public class AuditoriaJpaAdapter implements AuditoriaRepositoryPort {

    private final AuditoriaJpaRepository repository;
    private final HallazgoJpaRepository hallazgoRepository;
    private final EvidenciaJpaRepository evidenciaRepository;

    public AuditoriaJpaAdapter(
            AuditoriaJpaRepository repository,
            HallazgoJpaRepository hallazgoRepository,
            EvidenciaJpaRepository evidenciaRepository
    ) {
        this.repository = repository;
        this.hallazgoRepository = hallazgoRepository;
        this.evidenciaRepository = evidenciaRepository;
    }

    @Override
    public Auditoria save(Auditoria auditoria) {

        // Domain -> Entity
        AuditoriaEntity entity = new AuditoriaEntity();
        entity.setId(auditoria.getId());
        entity.setEstablecimientoId(auditoria.getEstablecimientoId());
        entity.setPlantillaId(auditoria.getPlantillaId());
        entity.setProgreso(auditoria.getProgreso());
        entity.setPuntuacionCumplimiento(auditoria.getPuntuacionCumplimiento());
        entity.setFechaAuditoria(auditoria.getFechaAuditoria());

        // Persistencia
        AuditoriaEntity savedEntity = repository.save(entity);

        // Entity -> Domain
        return new Auditoria(
                savedEntity.getId(),
                savedEntity.getEstablecimientoId(),
                savedEntity.getPlantillaId(),
                savedEntity.getFechaAuditoria(),
                savedEntity.getProgreso(),
                savedEntity.getPuntuacionCumplimiento()
        );
    }

    @Override
    public List<Auditoria> findAll() {
        return repository.findAll()
                .stream()
                .map(entity -> new Auditoria(
                        entity.getId(),
                        entity.getEstablecimientoId(),
                        entity.getPlantillaId(),
                        entity.getFechaAuditoria(),
                        entity.getProgreso(),
                        entity.getPuntuacionCumplimiento()
                ))
                .toList();
    }

    @Override
    public List<Auditoria> findAllWithNames() {
        return repository.findAllWithNames()
                .stream()
                .map(row -> new Auditoria(
                        row.getId(),
                        row.getEstablecimientoId(),
                        row.getEstablecimientoNombre(),
                        row.getPlantillaId(),
                        row.getPlantillaLabel(),
                        row.getNumeroHallazgos(),
                        row.getFechaAuditoria(),
                        row.getProgreso(),
                        row.getPuntuacionCumplimiento()
                ))
                .toList();
    }

    @Override
    public Optional<Auditoria> findByIdWithNames(String id) {
        return repository.findByIdWithNames(id)
                .map(row -> new Auditoria(
                        row.getId(),
                        row.getEstablecimientoId(),
                        row.getEstablecimientoNombre(),
                        row.getPlantillaId(),
                        row.getPlantillaLabel(),
                        row.getNumeroHallazgos(),
                        row.getFechaAuditoria(),
                        row.getProgreso(),
                        row.getPuntuacionCumplimiento()
                ));
    }

    @Override
    public boolean updateResultado(String id, int progreso, int puntuacionCumplimiento) {
        return repository.updateResultadoById(id, progreso, puntuacionCumplimiento) > 0;
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        // Borrado defensivo: eliminamos hijos por auditoriaId antes de borrar la auditoria.
        // Esto evita depender de ON DELETE CASCADE en la BD y previene auditorias "huerfanas".
        hallazgoRepository.deleteByAuditoriaId(id);
        evidenciaRepository.deleteByAuditoriaId(id);
        repository.deleteById(id);
    }
}

