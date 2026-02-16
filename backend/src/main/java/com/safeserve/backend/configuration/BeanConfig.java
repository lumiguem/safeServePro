package com.safeserve.backend.configuration;


import com.safeserve.backend.application.usecase.CreateAuditoriaUseCase;
import com.safeserve.backend.application.usecase.DeleteAuditoriaUseCase;
import com.safeserve.backend.application.usecase.ListAuditoriasUseCase;
import com.safeserve.backend.application.usecase.UpdateAuditoriaPuntuacionUseCase;
import com.safeserve.backend.application.usecase.establecimiento.*;
import com.safeserve.backend.application.usecase.plantilla.CreatePlantillaUseCase;
import com.safeserve.backend.application.usecase.plantilla.DeletePlantillaUseCase;
import com.safeserve.backend.application.usecase.plantilla.GetPlantillaByIdUseCase;
import com.safeserve.backend.application.usecase.plantilla.ListPlantillasUseCase;
import com.safeserve.backend.application.usecase.plantilla.UpdatePlantillaUseCase;
import com.safeserve.backend.domain.repository.in.CreateEstablecimientoPort;
import com.safeserve.backend.domain.repository.out.AuditoriaRepositoryPort;
import com.safeserve.backend.domain.repository.out.EstablecimientoRepositoryPort;
import com.safeserve.backend.domain.repository.out.PlantillaRepositoryPort;
import com.safeserve.backend.infrastructure.adapter.out.PlantillaRepositoryAdapter;
import com.safeserve.backend.infrastructure.persistence.repository.PlantillaJpaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public CreateAuditoriaUseCase createAuditoriaUseCase(
            AuditoriaRepositoryPort auditoriaRepositoryPort) {
        return new CreateAuditoriaUseCase(auditoriaRepositoryPort);
    }

    @Bean
    public ListAuditoriasUseCase listAuditoriasUseCase(
            AuditoriaRepositoryPort auditoriaRepositoryPort) {
        return new ListAuditoriasUseCase(auditoriaRepositoryPort);
    }

    @Bean
    public DeleteAuditoriaUseCase deleteAuditoriaUseCase(
            AuditoriaRepositoryPort auditoriaRepositoryPort) {
        return new DeleteAuditoriaUseCase(auditoriaRepositoryPort);
    }

    @Bean
    public UpdateAuditoriaPuntuacionUseCase updateAuditoriaPuntuacionUseCase(
            AuditoriaRepositoryPort auditoriaRepositoryPort) {
        return new UpdateAuditoriaPuntuacionUseCase(auditoriaRepositoryPort);
    }

    @Bean
    public PlantillaRepositoryPort plantillaRepositoryPort(
            PlantillaJpaRepository jpaRepository) {
        return new PlantillaRepositoryAdapter(jpaRepository);
    }



    @Bean
    public ListEstablecimientosUseCase listEstablecimientosUseCase(
            EstablecimientoRepositoryPort port
    ) {
        return new ListEstablecimientosUseCase(port);
    }

    @Bean
    public GetEstablecimientoByIdUseCase getEstablecimientoByIdUseCase(
            EstablecimientoRepositoryPort port
    ) {
        return new GetEstablecimientoByIdUseCase(port);
    }

    @Bean
    public CreateEstablecimientoPort createEstablecimientoUseCase(
            EstablecimientoRepositoryPort port
    ) {
        return new CreateEstablecimientoUseCase(port);
    }

    @Bean
    public UpdateEstablecimientoUseCase updateEstablecimientoUseCase(
            EstablecimientoRepositoryPort port
    ) {
        return new UpdateEstablecimientoUseCase(port);
    }

    @Bean
    public DeleteEstablecimientoUseCase deleteEstablecimientoUseCase(
            EstablecimientoRepositoryPort port
    ) {
        return new DeleteEstablecimientoUseCase(port);
    }

    @Bean
    public CreatePlantillaUseCase createPlantillaUseCase(
            PlantillaRepositoryPort repository) {
        return new CreatePlantillaUseCase(repository);
    }

    @Bean
    public ListPlantillasUseCase listPlantillasUseCase(
            PlantillaRepositoryPort repository) {
        return new ListPlantillasUseCase(repository);
    }

    @Bean
    public GetPlantillaByIdUseCase getPlantillaByIdUseCase(
            PlantillaRepositoryPort repository) {
        return new GetPlantillaByIdUseCase(repository);
    }

    @Bean
    public DeletePlantillaUseCase deletePlantillaUseCase(
            PlantillaRepositoryPort repository) {
        return new DeletePlantillaUseCase(repository);
    }

    @Bean
    public UpdatePlantillaUseCase updatePlantillaUseCase(
            PlantillaRepositoryPort repository) {
        return new UpdatePlantillaUseCase(repository);
    }


}
