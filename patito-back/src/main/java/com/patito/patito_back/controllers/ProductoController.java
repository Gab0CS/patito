package com.patito.patito_back.controllers;

import com.patito.patito_back.responses.ProductoResponse;
import com.patito.patito_back.services.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping("/{hawa}")
    public ResponseEntity<ProductoResponse> obtenerPorHawa(@PathVariable String hawa) {
        return ResponseEntity.ok(productoService.obtenerPorHawa(hawa));
    }
}