package com.patito.patito_back.repositories;

import com.patito.patito_back.entities.PedidosEntity;
import com.patito.patito_back.enums.StatusPedidoEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidosRepository extends JpaRepository<PedidosEntity, Long> {
    List<PedidosEntity> findByEstatus(StatusPedidoEnum estatus);
}


