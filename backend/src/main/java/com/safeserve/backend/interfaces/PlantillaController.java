package com.safeserve.backend.interfaces;

import com.safeserve.backend.application.dto.ChecklistTemplateDto;
import com.safeserve.backend.application.dto.CreatePlantillaRequest;
import com.safeserve.backend.application.usecase.plantilla.CreatePlantillaUseCase;
import com.safeserve.backend.application.usecase.plantilla.DeletePlantillaUseCase;
import com.safeserve.backend.application.usecase.plantilla.GetPlantillaByIdUseCase;
import com.safeserve.backend.application.usecase.plantilla.ListPlantillasUseCase;
import com.safeserve.backend.application.usecase.plantilla.UpdatePlantillaUseCase;
import com.safeserve.backend.domain.model.Plantilla;
import com.safeserve.backend.interfaces.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantillas")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class PlantillaController {

    private final CreatePlantillaUseCase createUseCase;
    private final ListPlantillasUseCase listUseCase;
    private final GetPlantillaByIdUseCase getByIdUseCase;
    private final DeletePlantillaUseCase deleteUseCase;
    private final UpdatePlantillaUseCase updateUseCase;

    public PlantillaController(
            CreatePlantillaUseCase createUseCase,
            ListPlantillasUseCase listUseCase,
            GetPlantillaByIdUseCase getByIdUseCase,
            DeletePlantillaUseCase deleteUseCase,
            UpdatePlantillaUseCase updateUseCase
    ) {
        this.createUseCase = createUseCase;
        this.listUseCase = listUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.deleteUseCase = deleteUseCase;
        this.updateUseCase = updateUseCase;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> crear(
            @RequestBody CreatePlantillaRequest request
    ) {
        createUseCase.execute(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        null,
                        "Plantilla creada correctamente"
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChecklistTemplateDto>>> listar() {

        List<ChecklistTemplateDto> response = listUseCase.execute()
                .stream()
                .map(p -> new ChecklistTemplateDto(
                        p.getId(),
                        p.getTitulo(),
                        p.getCategoria(),
                        p.getItems()
                                .stream()
                                .map(i -> i.getTarea())
                                .toList()
                ))
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(response)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Plantilla>> obtener(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        getByIdUseCase.execute(id)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable String id
    ) {
        deleteUseCase.execute(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        null,
                        "Plantilla eliminada correctamente"
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> actualizar(
            @PathVariable String id,
            @RequestBody CreatePlantillaRequest request
    ) {
        updateUseCase.execute(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        null,
                        "Plantilla actualizada correctamente"
                )
        );
    }
}
