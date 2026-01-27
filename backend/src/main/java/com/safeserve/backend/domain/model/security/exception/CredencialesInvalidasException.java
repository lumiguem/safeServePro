package com.safeserve.backend.domain.model.security.exception;

/**
 * Excepción de dominio para credenciales inválidas.
 */
public class CredencialesInvalidasException extends DominioException {
    public CredencialesInvalidasException(String mensaje) {
        super(mensaje);
    }
}
