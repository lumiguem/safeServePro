package com.safeserve.backend.infrastructure.persistence.entity;

import com.safeserve.backend.domain.model.Hallazgo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "hallazgos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HallazgoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "auditoria_id", nullable = false)
    private String auditoriaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evidencia_id", nullable = false)
    private EvidenciaEntity evidencia;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridad")
    @Builder.Default
    private Hallazgo.Prioridad prioridad = Hallazgo.Prioridad.MEDIUM;

    @Column(name = "accion_correctiva", columnDefinition = "TEXT")
    private String accionCorrectiva;

    @Column(name = "esta_resuelto")
    @Builder.Default
    private boolean estaResuelto = false;

    @Column(name = "fecha_hallazgo", columnDefinition = "TIMESTAMP")
    @Builder.Default
    private LocalDateTime fechaHallazgo = LocalDateTime.now();
}
