package com.patito.patito_back.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DetallePedidoRequest(
        @NotBlank String hawa,
        @NotNull @Min(1) Integer cantidad
) {}
