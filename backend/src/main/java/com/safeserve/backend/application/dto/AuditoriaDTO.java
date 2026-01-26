package com.safeserve.backend.application.dto;

import com.safeserve.backend.domain.model.Auditoria;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditoriaDTO {

    private String id;
    private String establecimientoId;
    private String plantillaId;

    public static AuditoriaDTO fromDomain(Auditoria auditoria) {
        AuditoriaDTO dto = new AuditoriaDTO();
        dto.id = auditoria.getId();
        dto.establecimientoId = auditoria.getEstablecimientoId();
        dto.plantillaId = auditoria.getPlantillaId();
        return dto;
    }

}
