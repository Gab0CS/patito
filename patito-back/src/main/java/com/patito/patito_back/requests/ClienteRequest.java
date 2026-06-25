package com.patito.patito_back.requests;

import jakarta.validation.constraints.NotBlank;

public record ClienteRequest(
        @NotBlank String nombre,
        String correo,
        String telefono
) {}
