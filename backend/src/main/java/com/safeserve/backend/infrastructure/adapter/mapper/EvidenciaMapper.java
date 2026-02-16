package com.safeserve.backend.infrastructure.adapter.mapper;

import com.safeserve.backend.domain.model.Evidencia;
import com.safeserve.backend.domain.model.Hallazgo;
import com.safeserve.backend.infrastructure.persistence.entity.EvidenciaEntity;

import java.util.Collections;
import java.util.List;

public class EvidenciaMapper {

    public static EvidenciaEntity toEntity(Evidencia domain) {
        EvidenciaEntity entity = new EvidenciaEntity();
        entity.setId(domain.getId());
        entity.setAuditoriaId(domain.getAuditoriaId());
        entity.setUrlArchivo(domain.getUrlArchivo());
        entity.setTipoArchivo(domain.getTipoArchivo());
        entity.setTimestampCaptura(domain.getTimestampCaptura());
        return entity;
    }

    public static Evidencia toDomain(EvidenciaEntity entity) {
        List<Hallazgo> hallazgos = entity.getHallazgos() == null
                ? Collections.emptyList()
                : entity.getHallazgos().stream()
                .map(HallazgoMapper::toDomain)
                .toList();

        return Evidencia.builder()
                .id(entity.getId())
                .auditoriaId(entity.getAuditoriaId())
                .urlArchivo(entity.getUrlArchivo())
                .tipoArchivo(entity.getTipoArchivo())
                .timestampCaptura(entity.getTimestampCaptura())
                .hallazgos(hallazgos)
                .build();
    }
}
