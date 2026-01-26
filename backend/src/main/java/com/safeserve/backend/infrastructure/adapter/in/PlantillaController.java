package com.safeserve.backend.infrastructure.adapter.in;

import com.safeserve.backend.application.dto.ChecklistTemplateDto;
import com.safeserve.backend.application.dto.CreatePlantillaRequest;
import com.safeserve.backend.application.usecase.plantilla.CreatePlantillaUseCase;
import com.safeserve.backend.application.usecase.plantilla.DeletePlantillaUseCase;
import com.safeserve.backend.application.usecase.plantilla.GetPlantillaByIdUseCase;
import com.safeserve.backend.application.usecase.plantilla.ListPlantillasUseCase;
import com.safeserve.backend.domain.model.Plantilla;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plantillas")
@CrossOrigin(origins = "http://localhost:5173")
public class PlantillaController {

    private final CreatePlantillaUseCase createUseCase;
    private final ListPlantillasUseCase listUseCase;
    private final GetPlantillaByIdUseCase getByIdUseCase;
    private final DeletePlantillaUseCase deleteUseCase;

    public PlantillaController(
            CreatePlantillaUseCase createUseCase,
            ListPlantillasUseCase listUseCase,
            GetPlantillaByIdUseCase getByIdUseCase,
            DeletePlantillaUseCase deleteUseCase) {
        this.createUseCase = createUseCase;
        this.listUseCase = listUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.deleteUseCase = deleteUseCase;
    }

    @PostMapping
    public void crear(@RequestBody CreatePlantillaRequest request) {
        createUseCase.execute(request);
    }

/*
    @GetMapping
    public List<Plantilla> listar() {
        return listUseCase.execute();
    }
*/

    @GetMapping
    public List<ChecklistTemplateDto> listar() {
        return listUseCase.execute()
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
    }


    @GetMapping("/{id}")
    public Plantilla obtener(@PathVariable String id) {
        return getByIdUseCase.execute(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) {
        deleteUseCase.execute(id);
    }
}
