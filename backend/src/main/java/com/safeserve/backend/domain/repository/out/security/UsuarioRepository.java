package com.safeserve.backend.domain.repository.out.security;


import com.safeserve.backend.domain.model.security.UsuarioModel;

import java.util.Optional;

/**
 * Contrato de repositorio del agregado Usuario.
 * Responsabilidades:
 * - Proveer acceso a los usuarios por criterios de consulta del dominio.
 * - Gestionar datos auxiliares del agregado (p. ej. cache de tokens si aplica al dominio).
 *
 * Este contrato NO debe exponer detalles de infraestructura.
 */
public interface UsuarioRepository {
    Optional<UsuarioModel> usuarioPorUserName(String username);

    void guardarToken(String token);

    String obtenerTokenCache(String username);
}
