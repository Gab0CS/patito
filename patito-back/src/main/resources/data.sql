IF NOT EXISTS (SELECT 1 FROM productos WHERE hawa = 'HAWA001')
    INSERT INTO productos (hawa, nombre, precio_lista, descuento, existencias)
    VALUES ('HAWA001', 'Ford Ranger', 850000.00, 15000.00, 5);

IF NOT EXISTS (SELECT 1 FROM productos WHERE hawa = 'HAWA002')
    INSERT INTO productos (hawa, nombre, precio_lista, descuento, existencias)
    VALUES ('HAWA002', 'Toyota Hilux', 920000.00, 10000.00, 10);

IF NOT EXISTS (SELECT 1 FROM productos WHERE hawa = 'HAWA003')
    INSERT INTO productos (hawa, nombre, precio_lista, descuento, existencias)
    VALUES ('HAWA003', 'Nissan Frontier', 890000.00, 0.00, 3);

IF NOT EXISTS (SELECT 1 FROM productos WHERE hawa = 'HAWA004')
    INSERT INTO productos (hawa, nombre, precio_lista, descuento, existencias)
    VALUES ('HAWA004', 'Chevrolet Colorado', 780000.00, 5000.00, 0);

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'admin')
    INSERT INTO usuarios (username, password, rol) VALUES ('admin', 'admin123', 'ADMIN');

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'vendedor1')
    INSERT INTO usuarios (username, password, rol) VALUES ('vendedor1', 'vendedor123', 'USER');
