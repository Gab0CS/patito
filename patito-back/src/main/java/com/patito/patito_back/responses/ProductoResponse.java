package com.patito.patito_back.responses;

import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        String hawa,
        String nombre,
        BigDecimal precioLista,
        BigDecimal descuento,
        Integer existencias
) {
}
