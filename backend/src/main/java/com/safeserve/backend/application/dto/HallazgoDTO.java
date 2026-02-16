package com.safeserve.backend.application.dto;

import com.safeserve.backend.domain.model.Hallazgo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HallazgoDTO {

    private Long id;
    private String auditoriaId;
    private Long evidenciaId;

    private String categoria;
    private String descripcion;
    private Hallazgo.Prioridad prioridad;
    private String accionCorrectiva;
    private boolean estaResuelto;
    private LocalDateTime fechaHallazgo;
}

