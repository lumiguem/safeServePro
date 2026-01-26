package com.safeserve.backend.infrastructure.adapter.in;


import com.safeserve.backend.application.dto.CreateEstablecimientoRequest;
import com.safeserve.backend.application.usecase.*;
import com.safeserve.backend.application.usecase.establecimiento.*;
import com.safeserve.backend.domain.model.Establecimiento;
import com.safeserve.backend.domain.port.in.CreateEstablecimientoPort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/establecimientos")
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
    public List<Establecimiento> listar() {
        return listUseCase.execute();
    }

    @GetMapping("/{id}")
    public Establecimiento buscarPorId(@PathVariable String id) {
        return getByIdUseCase.execute(id);
    }

    @PostMapping
    public Establecimiento crear(
            @RequestBody CreateEstablecimientoRequest request
    ) {
        return createPort.crearEstablecimiento(
                request.getNombre(),
                request.getDireccion(),
                request.getRiesgoActual()
        );
    }


    @PutMapping("/{id}")
    public Establecimiento actualizar(
            @PathVariable String id,
            @RequestParam int riesgoActual
    ) {
        return updateUseCase.execute(id, riesgoActual);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) {
        deleteUseCase.execute(id);
    }
}
