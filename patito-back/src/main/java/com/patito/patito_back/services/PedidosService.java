package com.patito.patito_back.services;

import com.patito.patito_back.enums.StatusPedidoEnum;
import com.patito.patito_back.requests.PedidoRequest;
import com.patito.patito_back.responses.PedidoResponse;

import java.util.List;

public interface PedidosService {
    PedidoResponse crearPedido(PedidoRequest request, String ipUsuario);
    List<PedidoResponse> listarPedidos();
    PedidoResponse obtenerPedido(Long id);
    PedidoResponse cambiarEstatus(Long id, StatusPedidoEnum nuevoEstatus);
}
