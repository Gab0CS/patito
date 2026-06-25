package com.patito.patito_back.services;

import com.patito.patito_back.entities.ProductosEntity;
import com.patito.patito_back.responses.ProductoResponse;

import java.util.List;

public interface ProductoService {
    ProductoResponse obtenerPorHawa(String hawa);
    List<ProductoResponse> obtenerTodos();
    ProductosEntity obtenerEntidadPorHawa(String hawa);
    boolean tieneExistencias(String hawa, Integer cantidadSolicitada);
    void disminuirExistencias(Long productoId, Integer cantidad);
    void aumentarExistencias(Long productoId, Integer cantidad);
}