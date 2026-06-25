package com.patito.patito_back.repositories;

import com.patito.patito_back.entities.ProductosEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductoRepository extends JpaRepository<ProductosEntity, Long> {
    Optional<ProductosEntity> findByHawa(String hawa);
}
