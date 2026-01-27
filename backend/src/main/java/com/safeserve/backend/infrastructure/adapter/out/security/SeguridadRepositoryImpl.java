package com.safeserve.backend.infrastructure.adapter.out.security;


import com.safeserve.backend.domain.model.security.RolModel;
import com.safeserve.backend.domain.model.security.UsuarioModel;
import com.safeserve.backend.domain.port.out.security.UsuarioRepository;
import com.safeserve.backend.infrastructure.persistance.repository.security.UsuarioRepositoryJpa;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class SeguridadRepositoryImpl implements UsuarioRepository {

    private final UsuarioRepositoryJpa usuarioRepositoryJpa;

    @Override
    public Optional<UsuarioModel> usuarioPorUserName(String username) {
        return usuarioRepositoryJpa.usuarioPorUsername(username)
                .map(u -> UsuarioModel.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .email(u.getEmail())
                        .password(u.getPasswordHash())
                        .apellido(u.getApellido())
                        .nombre(u.getNombre())
                        .activo(u.getActivo())
                        .roles(u.getRoles()
                                .stream()
                                .map(r -> RolModel.builder()
                                        .nombre(r.getRol().getNombre())
                                        .descripcion(r.getRol().getDescripcion())
                                        .build()
                                )
                                .collect(Collectors.toSet())
                        )
                        .build());
    }

    @Override
    public void guardarToken(String token) {
        log.info(token);
    }

    @Override
    public String obtenerTokenCache(String username) {
        return "";
    }
}
