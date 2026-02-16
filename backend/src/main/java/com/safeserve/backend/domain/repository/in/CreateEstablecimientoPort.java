package com.safeserve.backend.domain.repository.in;

import com.safeserve.backend.domain.model.Establecimiento;

public interface CreateEstablecimientoPort {

    Establecimiento crearEstablecimiento(String nombre, String direccion, int riesgoActual);
}
