package com.patito.patito_back.services.impl;

import com.patito.patito_back.entities.ProductosEntity;
import com.patito.patito_back.repositories.ProductoRepository;
import com.patito.patito_back.responses.ProductoResponse;
import com.patito.patito_back.services.ProductoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    @Override
    public ProductoResponse obtenerPorHawa(String hawa) {
        ProductosEntity entity = obtenerEntidadPorHawa(hawa);
        return toResponse(entity);
    }

    @Override
    public List<ProductoResponse> obtenerTodos() {
        return productoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ProductosEntity obtenerEntidadPorHawa(String hawa) {
        return productoRepository.findByHawa(hawa).orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con HAWA: " + hawa));
    }

    @Override
    public boolean tieneExistencias(String hawa, Integer cantidadSolicitada) {
        ProductosEntity entity = obtenerEntidadPorHawa(hawa);
        return entity.getExistencias() >= cantidadSolicitada;
    }

    @Override
    @Transactional
    public void disminuirExistencias(Long productoId, Integer cantidad) {
        ProductosEntity entity = productoRepository.findById(productoId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Producto no encontrado con id: " + productoId));

        if (entity.getExistencias() < cantidad) {
            throw new IllegalStateException(
                    "Existencias insuficientes para el producto: " + entity.getHawa());
        }

        entity.setExistencias(entity.getExistencias() - cantidad);
        productoRepository.save(entity);
    }

    @Override
    @Transactional
    public void aumentarExistencias(Long productoId, Integer cantidad) {
        ProductosEntity entity = productoRepository.findById(productoId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Producto no encontrado con id: " + productoId));

        entity.setExistencias(entity.getExistencias() + cantidad);
        productoRepository.save(entity);
    }

    private ProductoResponse toResponse(ProductosEntity entity) {
        return new ProductoResponse(
                entity.getId(),
                entity.getHawa(),
                entity.getNombre(),
                entity.getPrecioLista(),
                entity.getDescuento(),
                entity.getExistencias()
        );
    }
}
