package com.patito.patito_back.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "productos")
public class ProductosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String hawa;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private BigDecimal precioLista;

    @Column(nullable = false)
    private BigDecimal descuento;

    @Column(nullable = false)
    private Integer existencias;
}
