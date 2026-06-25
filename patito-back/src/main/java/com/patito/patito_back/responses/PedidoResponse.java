package com.patito.patito_back.responses;

import com.patito.patito_back.enums.StatusPedidoEnum;

import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String tiendaId,
        String vendedor,
        StatusPedidoEnum estatus,
        LocalDateTime fechaCreacion,
        String ipUsuario,
        ClienteResponse cliente,
        List<DetallePedidoResponse> detalles
) {}
