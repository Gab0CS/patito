package com.patito.patito_back.services.impl;

import com.patito.patito_back.entities.*;
import com.patito.patito_back.enums.StatusPedidoEnum;
import com.patito.patito_back.repositories.ClientesRepository;
import com.patito.patito_back.repositories.PedidosRepository;
import com.patito.patito_back.requests.DetallePedidoRequest;
import com.patito.patito_back.requests.PedidoRequest;
import com.patito.patito_back.responses.ClienteResponse;
import com.patito.patito_back.responses.DetallePedidoResponse;
import com.patito.patito_back.responses.PedidoResponse;
import com.patito.patito_back.services.PedidosService;
import com.patito.patito_back.services.ProductoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidosServiceImpl implements PedidosService {

    private final PedidosRepository pedidosRepository;
    private final ClientesRepository clientesRepository;
    private final ProductoService productoService;

    @Override
    @Transactional
    public PedidoResponse crearPedido(PedidoRequest request, String ipUsuario) {
        ClientesEntity cliente = ClientesEntity.builder()
                .nombre(request.cliente().nombre())
                .correo(request.cliente().correo())
                .telefono(request.cliente().telefono())
                .build();
        cliente = clientesRepository.save(cliente);

        PedidosEntity pedido = PedidosEntity.builder()
                .tiendaId(request.tiendaId())
                .vendedor(request.vendedor())
                .estatus(StatusPedidoEnum.PENDIENTE)
                .fechaCreacion(LocalDateTime.now())
                .ipUsuario(ipUsuario)
                .cliente(cliente)
                .detalles(new ArrayList<>())
                .build();

        for (DetallePedidoRequest detalleReq : request.detalles()) {
            ProductosEntity producto = productoService.obtenerEntidadPorHawa(detalleReq.hawa());

            if (producto.getExistencias() < detalleReq.cantidad()) {
                throw new IllegalStateException(
                        "Sin existencias suficientes para el producto: " + detalleReq.hawa());
            }

            BigDecimal precioFinal = producto.getPrecioLista()
                    .subtract(producto.getDescuento())
                    .multiply(BigDecimal.valueOf(detalleReq.cantidad()));

            DetallesPedidoEntity detalle = DetallesPedidoEntity.builder()
                    .pedido(pedido)
                    .producto(producto)
                    .cantidad(detalleReq.cantidad())
                    .precioLista(producto.getPrecioLista())
                    .descuento(producto.getDescuento())
                    .precioFinal(precioFinal)
                    .build();

            pedido.getDetalles().add(detalle);
            productoService.disminuirExistencias(producto.getId(), detalleReq.cantidad());
        }

        pedido = pedidosRepository.save(pedido);
        return toResponse(pedido);
    }

    @Override
    public List<PedidoResponse> listarPedidos() {
        return pedidosRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public PedidoResponse obtenerPedido(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public PedidoResponse cambiarEstatus(Long id, StatusPedidoEnum nuevoEstatus) {
        PedidosEntity pedido = findOrThrow(id);

        if (pedido.getEstatus() != StatusPedidoEnum.PENDIENTE) {
            throw new IllegalStateException("Solo se puede cambiar el estatus de pedidos PENDIENTES");
        }

        if (nuevoEstatus == StatusPedidoEnum.CANCELADO) {
            long minutosTranscurridos = java.time.Duration.between(pedido.getFechaCreacion(), LocalDateTime.now()).toMinutes();
            if (minutosTranscurridos > 10) {
                throw new IllegalStateException("No se puede cancelar el pedido después de 10 minutos de su creación");
            }
            // Bonus: devolver existencias al cancelar
            for (DetallesPedidoEntity detalle : pedido.getDetalles()) {
                productoService.aumentarExistencias(detalle.getProducto().getId(), detalle.getCantidad());
            }
        }

        if (nuevoEstatus == StatusPedidoEnum.ENTREGADO) {
            // Existencias ya fueron descontadas al crear el pedido, no se hace nada
        }

        pedido.setEstatus(nuevoEstatus);
        return toResponse(pedidosRepository.save(pedido));
    }

    private PedidosEntity findOrThrow(Long id) {
        return pedidosRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con id: " + id));
    }

    private PedidoResponse toResponse(PedidosEntity pedido) {
        ClienteResponse clienteResp = new ClienteResponse(
                pedido.getCliente().getId(),
                pedido.getCliente().getNombre(),
                pedido.getCliente().getCorreo(),
                pedido.getCliente().getTelefono()
        );

        List<DetallePedidoResponse> detalles = pedido.getDetalles().stream().map(d ->
                new DetallePedidoResponse(
                        d.getId(),
                        d.getProducto().getHawa(),
                        d.getProducto().getNombre(),
                        d.getCantidad(),
                        d.getPrecioLista(),
                        d.getDescuento(),
                        d.getPrecioFinal()
                )
        ).toList();

        return new PedidoResponse(
                pedido.getId(),
                pedido.getTiendaId(),
                pedido.getVendedor(),
                pedido.getEstatus(),
                pedido.getFechaCreacion(),
                pedido.getIpUsuario(),
                clienteResp,
                detalles
        );
    }
}
