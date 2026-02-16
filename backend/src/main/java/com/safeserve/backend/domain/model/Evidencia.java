package com.safeserve.backend.domain.model;

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
public class Evidencia {

    private Long id;
    private String auditoriaId;
    private String urlArchivo;
    private String tipoArchivo;
    @Builder.Default
    private LocalDateTime timestampCaptura = LocalDateTime.now();
    private List<Hallazgo> hallazgos;
}
