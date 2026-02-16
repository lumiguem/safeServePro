package com.safeserve.backend.domain.repository.out;


import com.safeserve.backend.domain.model.Establecimiento;

import java.util.List;
import java.util.Optional;

public interface EstablecimientoRepositoryPort {
    List<Establecimiento> findAll();

    Optional<Establecimiento> findById(String id);

    Establecimiento save(Establecimiento establecimiento);

    void deleteById(String id);
}
