package com.safeserve.backend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenciaDTO {

    private Long id;
    private String auditoriaId;
    private String urlArchivo;
    private String tipoArchivo;
    private LocalDateTime timestampCaptura;

    private List<HallazgoDTO> hallazgos;
}

