package com.patito.patito_back.responses;

public record ClienteResponse(
        Long id,
        String nombre,
        String correo,
        String telefono
) {}
