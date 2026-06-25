package com.patito.patito_back.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PedidoRequest(
        @NotBlank String tiendaId,
        @NotBlank String vendedor,
        @NotNull @Valid ClienteRequest cliente,
        @NotEmpty @Valid List<DetallePedidoRequest> detalles
) {}
