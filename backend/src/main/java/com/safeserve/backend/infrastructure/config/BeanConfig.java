package com.safeserve.backend.infrastructure.config;


import com.safeserve.backend.application.usecase.CreateAuditoriaUseCase;
import com.safeserve.backend.application.usecase.establecimiento.*;
import com.safeserve.backend.domain.port.in.CreateEstablecimientoPort;
import com.safeserve.backend.domain.port.out.AuditoriaRepositoryPort;
import com.safeserve.backend.domain.port.out.EstablecimientoRepositoryPort;
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

}
