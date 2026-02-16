package com.safeserve.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evidencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenciaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "auditoria_id", nullable = false)
    private String auditoriaId;

    @Column(name = "url_archivo", nullable = false, columnDefinition = "TEXT")
    private String urlArchivo;

    @Column(name = "tipo_archivo")
    private String tipoArchivo;

    @Column(name = "timestamp_captura", columnDefinition = "DATETIME")
    @Builder.Default
    private LocalDateTime timestampCaptura = LocalDateTime.now();

    @OneToMany(mappedBy = "evidencia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HallazgoEntity> hallazgos;
}
