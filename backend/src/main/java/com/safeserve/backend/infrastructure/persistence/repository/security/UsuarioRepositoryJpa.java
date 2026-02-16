package com.safeserve.backend.infrastructure.persistence.repository.security;


import com.safeserve.backend.infrastructure.persistence.entity.security.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepositoryJpa extends JpaRepository<UsuarioEntity, Long> {

    @Query("""
            SELECT DISTINCT u FROM UsuarioEntity u
            LEFT JOIN FETCH u.roles ur
            LEFT JOIN FETCH ur.rol
            WHERE u.activo = true AND u.username = :username
            """)
    Optional<UsuarioEntity> usuarioPorUsername(@Param("username") String username);
}
