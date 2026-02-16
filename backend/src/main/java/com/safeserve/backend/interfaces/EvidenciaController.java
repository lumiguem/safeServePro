package com.safeserve.backend.interfaces;

import com.safeserve.backend.application.dto.EvidenciaDTO;
import com.safeserve.backend.application.usecase.EvidenciaService;
import com.safeserve.backend.interfaces.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidencias")
@RequiredArgsConstructor
public class EvidenciaController {

    private final EvidenciaService evidenciaService;

    @PostMapping
    public ResponseEntity<ApiResponse<EvidenciaDTO>> createEvidencia(@RequestBody EvidenciaDTO evidenciaDTO) {
        EvidenciaDTO createdEvidencia = evidenciaService.createEvidencia(evidenciaDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(createdEvidencia));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EvidenciaDTO>> getEvidenciaById(@PathVariable Long id) {
        return evidenciaService.findById(id)
                .map(evidencia -> ResponseEntity.ok(new ApiResponse<>(evidencia)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EvidenciaDTO>>> getAllEvidencias() {
        List<EvidenciaDTO> evidencias = evidenciaService.findAll();
        return ResponseEntity.ok(new ApiResponse<>(evidencias));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvidencia(@PathVariable Long id) {
        evidenciaService.deleteEvidencia(id);
        return ResponseEntity.noContent().build();
    }
}
