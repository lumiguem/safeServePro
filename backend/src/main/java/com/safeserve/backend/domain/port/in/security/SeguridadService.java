package com.safeserve.backend.domain.port.in.security;


import com.safeserve.backend.domain.model.security.SeguridadModel;

public interface SeguridadService {
    SeguridadModel autenticacion(String username, String password);

    SeguridadModel refrescar(String token);
}
