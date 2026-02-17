package com.safeserve.backend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditoriaDetalleDTO {
    private AuditoriaDTO auditoria;
    private List<HallazgoDTO> hallazgos;
    private List<EvidenciaDTO> evidencias;
    private int totalHallazgos;
    private int hallazgosResueltos;
    private int hallazgosPendientes;
    private int totalEvidencias;
}
