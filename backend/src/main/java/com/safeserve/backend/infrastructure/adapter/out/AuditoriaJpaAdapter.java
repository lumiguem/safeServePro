package com.safeserve.backend.infrastructure.adapter.out;

import com.safeserve.backend.domain.model.Auditoria;
import com.safeserve.backend.domain.port.out.AuditoriaRepositoryPort;
import com.safeserve.backend.infrastructure.persistance.entity.AuditoriaEntity;
import com.safeserve.backend.infrastructure.persistance.repository.AuditoriaJpaRepository;
import org.springframework.stereotype.Component;

@Component
public class AuditoriaJpaAdapter implements AuditoriaRepositoryPort {

    private final AuditoriaJpaRepository repository;

    public AuditoriaJpaAdapter(AuditoriaJpaRepository repository) {
        this.repository = repository;
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

        // Persistencia
        AuditoriaEntity savedEntity = repository.save(entity);

        // Entity -> Domain
        return new Auditoria(
                savedEntity.getId(),
                savedEntity.getEstablecimientoId(),
                savedEntity.getPlantillaId(),
                savedEntity.getProgreso(),
                savedEntity.getPuntuacionCumplimiento()
        );
    }
}

