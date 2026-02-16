package com.safeserve.backend.interfaces.security;


import com.safeserve.backend.application.dto.security.LoginRequestDto;
import com.safeserve.backend.application.dto.security.LoginResponseDto;
import com.safeserve.backend.application.dto.security.RefreshTokenRequestDto;
import com.safeserve.backend.interfaces.response.ApiResponse;
import com.safeserve.backend.infrastructure.security.JwtProperties;
import com.safeserve.backend.domain.model.security.SeguridadModel;
import com.safeserve.backend.domain.repository.in.security.SeguridadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/auth")
public class AuthController {

    private final JwtProperties jwtProperties;
    private final SeguridadService seguridadService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @Valid @RequestBody LoginRequestDto request
    ) {
        SeguridadModel seguridad = seguridadService.autenticacion(
                request.getUsername(),
                request.getPassword()
        );

        LoginResponseDto response = buildLoginResponse(
                seguridad.getToken(),
                seguridad.getRefresh()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(response, "Login exitoso")
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponseDto>> refresh(
            @Valid @RequestBody RefreshTokenRequestDto request
    ) {
        SeguridadModel seguridad = seguridadService.refrescar(
                request.getRefreshToken()
        );

        LoginResponseDto response = buildLoginResponse(
                seguridad.getToken(),
                seguridad.getRefresh()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(response, "Token refrescado")
        );
    }

    private LoginResponseDto buildLoginResponse(
            String accessToken,
            String refreshToken
    ) {
        long accessTtlSeconds =
                Duration.ofMillis(jwtProperties.getAccessTokenExpiration())
                        .toSeconds();

        return new LoginResponseDto(
                accessToken,
                refreshToken,
                accessTtlSeconds
        );
    }
}
