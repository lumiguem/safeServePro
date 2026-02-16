package com.safeserve.backend.application.usecase;

import com.safeserve.backend.domain.repository.out.HallazgoRepositoryPort;

public class ResolverHallazgoUseCase {

    private final HallazgoRepositoryPort hallazgoRepository;

    public ResolverHallazgoUseCase(HallazgoRepositoryPort hallazgoRepository) {
        this.hallazgoRepository = hallazgoRepository;
    }

    public void resolver(Long hallazgoId) {
        hallazgoRepository.findById(hallazgoId).ifPresent(h -> {
            h.setEstaResuelto(true);
            hallazgoRepository.save(h);
        });
    }
}
