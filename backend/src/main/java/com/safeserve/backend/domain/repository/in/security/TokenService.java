package com.safeserve.backend.domain.repository.in.security;

import com.safeserve.backend.domain.model.security.UsuarioModel;

public interface TokenService {
    String generarTokenAcceso(UsuarioModel usuario);

    String generarTokenRefresco(UsuarioModel usuario);

    String extraerUsuario(String token);

    boolean esTokenValido(String token);
}
