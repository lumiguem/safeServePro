package com.safeserve.backend.infrastructure.adapter.mapper;

import com.safeserve.backend.domain.model.Hallazgo;
import com.safeserve.backend.infrastructure.persistence.entity.EvidenciaEntity;
import com.safeserve.backend.infrastructure.persistence.entity.HallazgoEntity;

public class HallazgoMapper {

    public static HallazgoEntity toEntity(Hallazgo domain, EvidenciaEntity evidenciaEntity) {
        HallazgoEntity entity = new HallazgoEntity();
        entity.setId(domain.getId());
        entity.setAuditoriaId(domain.getAuditoriaId());
        entity.setEvidencia(evidenciaEntity);
        entity.setCategoria(domain.getCategoria());
        entity.setDescripcion(domain.getDescripcion());
        entity.setPrioridad(domain.getPrioridad());
        entity.setAccionCorrectiva(domain.getAccionCorrectiva());
        entity.setEstaResuelto(domain.isEstaResuelto());
        entity.setFechaHallazgo(domain.getFechaHallazgo());
        return entity;
    }

    public static Hallazgo toDomain(HallazgoEntity entity) {
        Long evidenciaId = entity.getEvidencia() == null ? null : entity.getEvidencia().getId();
        return Hallazgo.builder()
                .id(entity.getId())
                .auditoriaId(entity.getAuditoriaId())
                .evidenciaId(evidenciaId)
                .categoria(entity.getCategoria())
                .descripcion(entity.getDescripcion())
                .prioridad(entity.getPrioridad())
                .accionCorrectiva(entity.getAccionCorrectiva())
                .estaResuelto(entity.isEstaResuelto())
                .fechaHallazgo(entity.getFechaHallazgo())
                .build();
    }
}
