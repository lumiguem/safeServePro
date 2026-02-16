package com.safeserve.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hallazgo {

    private Long id;
    private String auditoriaId;
    private Long evidenciaId;
    private String categoria;
    private String descripcion;
    @Builder.Default
    private Prioridad prioridad = Prioridad.MEDIUM;
    private String accionCorrectiva;
    @Builder.Default
    private boolean estaResuelto = false;
    @Builder.Default
    private LocalDateTime fechaHallazgo = LocalDateTime.now();

    public enum Prioridad {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
