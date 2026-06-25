package com.patito.patito_back.controllers;

import com.patito.patito_back.enums.StatusPedidoEnum;
import com.patito.patito_back.requests.PedidoRequest;
import com.patito.patito_back.responses.PedidoResponse;
import com.patito.patito_back.services.PedidosService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidosController {

    private final PedidosService pedidosService;

    @PostMapping
    public ResponseEntity<PedidoResponse> crear(@Valid @RequestBody PedidoRequest request,
                                                 HttpServletRequest httpRequest) {
        String ip = obtenerIp(httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidosService.crearPedido(request, ip));
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar() {
        return ResponseEntity.ok(pedidosService.listarPedidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(pedidosService.obtenerPedido(id));
    }

    @PatchMapping("/{id}/estatus")
    public ResponseEntity<PedidoResponse> cambiarEstatus(@PathVariable Long id,
                                                          @RequestBody Map<String, String> body) {
        StatusPedidoEnum nuevoEstatus = StatusPedidoEnum.valueOf(body.get("estatus").toUpperCase());
        return ResponseEntity.ok(pedidosService.cambiarEstatus(id, nuevoEstatus));
    }

    private String obtenerIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
