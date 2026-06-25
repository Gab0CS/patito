package com.patito.patito_back.responses;

import java.math.BigDecimal;

public record DetallePedidoResponse(
        Long id,
        String hawa,
        String nombreProducto,
        Integer cantidad,
        BigDecimal precioLista,
        BigDecimal descuento,
        BigDecimal precioFinal
) {}
