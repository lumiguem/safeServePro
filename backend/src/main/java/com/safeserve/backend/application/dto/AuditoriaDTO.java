package com.safeserve.backend.application.dto;

import com.safeserve.backend.domain.model.Auditoria;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditoriaDTO {

    private String id;
    private String establecimientoId;
    private String establecimientoNombre;
    private String plantillaId;
    private String plantillaLabel;
    private int progreso;
    private int puntuacionCumplimiento;
    private long numeroHallazgos;

    public static AuditoriaDTO fromDomain(Auditoria auditoria) {
        AuditoriaDTO dto = new AuditoriaDTO();
        dto.id = auditoria.getId();
        dto.establecimientoId = auditoria.getEstablecimientoId();
        dto.establecimientoNombre = auditoria.getEstablecimientoNombre();
        dto.plantillaId = auditoria.getPlantillaId();
        dto.plantillaLabel = auditoria.getPlantillaLabel();
        dto.progreso = auditoria.getProgreso();
        dto.puntuacionCumplimiento = auditoria.getPuntuacionCumplimiento();
        dto.numeroHallazgos = auditoria.getNumeroHallazgos();
        return dto;
    }

}
