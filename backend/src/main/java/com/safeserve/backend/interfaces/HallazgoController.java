package com.safeserve.backend.interfaces;

import com.safeserve.backend.application.dto.HallazgoDTO;
import com.safeserve.backend.application.usecase.HallazgoService;
import com.safeserve.backend.interfaces.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hallazgos")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
@RequiredArgsConstructor
public class HallazgoController {

    private final HallazgoService hallazgoService;

    @PostMapping
    public ResponseEntity<ApiResponse<HallazgoDTO>> createHallazgo(@RequestBody HallazgoDTO hallazgoDTO) {
        HallazgoDTO createdHallazgo = hallazgoService.createHallazgo(hallazgoDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(createdHallazgo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HallazgoDTO>> getHallazgoById(@PathVariable Long id) {
        return hallazgoService.findById(id)
                .map(hallazgo -> ResponseEntity.ok(new ApiResponse<>(hallazgo)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HallazgoDTO>>> getAllHallazgos() {
        List<HallazgoDTO> hallazgos = hallazgoService.findAll();
        return ResponseEntity.ok(new ApiResponse<>(hallazgos));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HallazgoDTO>> updateHallazgo(@PathVariable Long id, @RequestBody HallazgoDTO hallazgoDTO) {
        try {
            HallazgoDTO updatedHallazgo = hallazgoService.updateHallazgo(id, hallazgoDTO);
            return ResponseEntity.ok(new ApiResponse<>(updatedHallazgo));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHallazgo(@PathVariable Long id) {
        hallazgoService.deleteHallazgo(id);
        return ResponseEntity.noContent().build();
    }
}
