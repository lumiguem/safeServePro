package com.safeserve.backend.interfaces;


import com.safeserve.backend.application.dto.CreateEstablecimientoRequest;
import com.safeserve.backend.application.usecase.*;
import com.safeserve.backend.application.usecase.establecimiento.*;
import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.domain.repository.in.CreateEstablecimientoPort;
import com.safeserve.backend.interfaces.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/establecimientos")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class EstablecimientoController {

    private final ListEstablecimientosUseCase listUseCase;
    private final GetEstablecimientoByIdUseCase getByIdUseCase;
    private final CreateEstablecimientoPort createPort;
    private final UpdateEstablecimientoUseCase updateUseCase;
    private final DeleteEstablecimientoUseCase deleteUseCase;

    public EstablecimientoController(
            ListEstablecimientosUseCase listUseCase,
            GetEstablecimientoByIdUseCase getByIdUseCase,
            CreateEstablecimientoPort createPort,
            UpdateEstablecimientoUseCase updateUseCase,
            DeleteEstablecimientoUseCase deleteUseCase
    ) {
        this.listUseCase = listUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createPort = createPort;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Establecimiento>>> listar() {
        return ResponseEntity.ok(
                new ApiResponse<>(listUseCase.execute())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Establecimiento>> buscarPorId(
            @PathVariable String id) {
        return ResponseEntity.ok(
                new ApiResponse<>(getByIdUseCase.execute(id))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Establecimiento>> crear(
            @RequestBody CreateEstablecimientoRequest request
    ) {
        Establecimiento creado = createPort.crearEstablecimiento(
                request.getNombre(),
                request.getDireccion(),
                request.getRiesgoActual()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        creado,
                        "Establecimiento creado correctamente"
                ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Establecimiento>> actualizar(
            @PathVariable String id,
            @RequestBody CreateEstablecimientoRequest request
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        updateUseCase.execute(id, request.getNombre(), request.getDireccion(), request.getRiesgoActual()),
                        "Establecimiento actualizado correctamente"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable String id
    ) {
        deleteUseCase.execute(id);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "Establecimiento eliminado correctamente")
        );
    }
}
