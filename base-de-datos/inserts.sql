-- ===========================
-- INSERTS DE USUARIOS
-- ===========================
INSERT INTO usuarios (
    tipo_identificacion,
    numero_identificacion,
    nombre_completo,
    correo,
    telefono,
    contrasena,
    rol
) VALUES
('CC', '100000001', 'Laura Gómez', 'laura.gomez@elaris.com', '3001110001', '$2a$10$hashdemo000000000000000000000000000000000000000000001', 'cliente'),
('CC', '100000002', 'Carlos Ramírez', 'carlos.ramirez@elaris.com', '3001110002', '$2a$10$hashdemo000000000000000000000000000000000000000000002', 'cliente'),
('CC', '100000003', 'María Torres', 'maria.torres@elaris.com', '3001110003', '$2a$10$hashdemo000000000000000000000000000000000000000000003', 'cliente'),
('CC', '100000004', 'Andrés López', 'andres.lopez@elaris.com', '3001110004', '$2a$10$hashdemo000000000000000000000000000000000000000000004', 'cliente'),
('CC', '100000005', 'Sofía Martínez', 'sofia.martinez@elaris.com', '3001110005', '$2a$10$hashdemo000000000000000000000000000000000000000000005', 'cliente'),
('CC', '100000006', 'Daniel Herrera', 'daniel.herrera@elaris.com', '3001110006', '$2a$10$hashdemo000000000000000000000000000000000000000000006', 'cliente'),
('CC', '100000007', 'Valentina Ríos', 'valentina.rios@elaris.com', '3001110007', '$2a$10$hashdemo000000000000000000000000000000000000000000007', 'cliente'),
('CC', '100000008', 'Juan Pérez', 'juan.perez@elaris.com', '3001110008', '$2a$10$hashdemo000000000000000000000000000000000000000000008', 'cliente'),
('CC', '100000009', 'Camila Ortega', 'camila.ortega@elaris.com', '3001110009', '$2a$10$hashdemo000000000000000000000000000000000000000000009', 'cliente'),
('CC', '100000010', 'Miguel Castro', 'miguel.castro@elaris.com', '3001110010', '$2a$10$hashdemo000000000000000000000000000000000000000000010', 'cliente'),
('CC', '100000011', 'Natalia Vargas', 'natalia.vargas@elaris.com', '3001110011', '$2a$10$hashdemo000000000000000000000000000000000000000000011', 'cliente'),
('CC', '100000012', 'Sebastián Mora', 'sebastian.mora@elaris.com', '3001110012', '$2a$10$hashdemo000000000000000000000000000000000000000000012', 'cliente'),
('CC', '100000013', 'Paula Sánchez', 'paula.sanchez@elaris.com', '3001110013', '$2a$10$hashdemo000000000000000000000000000000000000000000013', 'cliente'),
('CC', '100000014', 'Felipe Gómez', 'felipe.gomez@elaris.com', '3001110014', '$2a$10$hashdemo000000000000000000000000000000000000000000014', 'cliente'),
('CC', '100000015', 'Isabella Moreno', 'isabella.moreno@elaris.com', '3001110015', '$2a$10$hashdemo000000000000000000000000000000000000000000015', 'cliente'),
('CC', '100000016', 'Mateo Arias', 'mateo.arias@elaris.com', '3001110016', '$2a$10$hashdemo000000000000000000000000000000000000000000016', 'cliente'),
('CC', '100000017', 'Gabriela Ruiz', 'gabriela.ruiz@elaris.com', '3001110017', '$2a$10$hashdemo000000000000000000000000000000000000000000017', 'cliente'),
('CC', '100000018', 'Samuel Peña', 'samuel.pena@elaris.com', '3001110018', '$2a$10$hashdemo000000000000000000000000000000000000000000018', 'cliente'),
('CC', '100000019', 'Luciana Silva', 'luciana.silva@elaris.com', '3001110019', '$2a$10$hashdemo000000000000000000000000000000000000000000019', 'cliente'),
('CC', '100000020', 'Tomás Molina', 'tomas.molina@elaris.com', '3001110020', '$2a$10$hashdemo000000000000000000000000000000000000000000020', 'cliente'),
('CC', '100000021', 'Sara Cárdenas', 'sara.cardenas@elaris.com', '3001110021', '$2a$10$hashdemo000000000000000000000000000000000000000000021', 'cliente'),
('CC', '100000022', 'Nicolás Vega', 'nicolas.vega@elaris.com', '3001110022', '$2a$10$hashdemo000000000000000000000000000000000000000000022', 'cliente'),
('CC', '100000023', 'Daniela Pardo', 'daniela.pardo@elaris.com', '3001110023', '$2a$10$hashdemo000000000000000000000000000000000000000000023', 'cliente'),
('CC', '100000024', 'Esteban León', 'esteban.leon@elaris.com', '3001110024', '$2a$10$hashdemo000000000000000000000000000000000000000000024', 'cliente'),
('CC', '100000025', 'Manuela Castillo', 'manuela.castillo@elaris.com', '3001110025', '$2a$10$hashdemo000000000000000000000000000000000000000000025', 'admin')
ON CONFLICT (correo) DO NOTHING;

-- ===========================
-- INSERTS DE VUELOS
-- ===========================
INSERT INTO vuelos (
    numero_vuelo,
    origen,
    destino,
    ciudad_destino,
    fecha_salida,
    hora_salida,
    hora_llegada,
    duracion_minutos,
    escala,
    clase,
    tipo_avion,
    precio_base,
    imagen_url,
    descripcion
) VALUES
('EL-204', 'Bogotá', 'Nueva York', 'Nueva York', '2026-04-15', '10:30', '17:00', 390, 'Directo', 'Económica', 'Boeing', 3290000, '../../imagenes/nueva-york.jpg', 'Disfruta de un increíble viaje a Nueva York, una de las ciudades más icónicas del mundo.'),
('EL-422', 'Bogotá', 'París', 'París', '2026-05-22', '09:15', '08:00 am (+1 día)', 765, 'Una escala', 'Económica', 'Airbus', 4480000, '../../imagenes/paris.jpg', 'Viaja a París y descubre una ciudad llena de historia, arte y elegancia.'),
('EL-310', 'Medellín', 'Cancún', 'Cancún', '2026-06-10', '07:40', '11:55', 255, 'Directo', 'Ejecutiva', 'Boeing', 2170000, '../../imagenes/cancun.jpg', 'Escápate a Cancún y disfruta playas de arena blanca y aguas cristalinas.'),
('EL-105', 'Cali', 'Madrid', 'Madrid', '2026-07-05', '18:20', '08:45 am (+1 día)', 860, 'Una escala', 'Primera clase', 'Airbus', 3890000, '../../imagenes/madrid.jpg', 'Conoce Madrid, una ciudad vibrante con gran riqueza cultural y gastronómica.'),
('EL-518', 'Bogotá', 'Buenos Aires', 'Buenos Aires', '2026-08-18', '12:10', '18:20', 370, 'Directo', 'Económica', 'Boeing', 2760000, '../../imagenes/buenos-aires.jpg', 'Descubre Buenos Aires, una ciudad llena de cultura, música y arquitectura.'),
('EL-267', 'Cartagena', 'Ciudad de México', 'Ciudad de México', '2026-09-02', '08:25', '14:20', 355, 'Una escala', 'Ejecutiva', 'Airbus', 2340000, '../../imagenes/ciudad-mexico.jpg', 'Explora Ciudad de México, un destino lleno de historia, sabores y lugares emblemáticos.'),
('EL-601', 'Bogotá', 'Londres', 'Londres', '2026-09-18', '21:10', '14:30 (+1 día)', 800, 'Una escala', 'Económica', 'Boeing', 4620000, '../../imagenes/londres.jpg', 'Conoce Londres, una ciudad moderna llena de historia, cultura y lugares emblemáticos.'),
('EL-602', 'Medellín', 'Miami', 'Miami', '2026-10-03', '06:45', '11:25', 280, 'Directo', 'Económica', 'Airbus', 1980000, '../../imagenes/miami.jpg', 'Viaja a Miami y disfruta sus playas, compras y ambiente internacional.'),
('EL-603', 'Cali', 'Lima', 'Lima', '2026-10-12', '13:20', '16:10', 170, 'Directo', 'Económica', 'Regional', 1450000, '../../imagenes/lima.jpg', 'Descubre Lima, una ciudad con gran tradición gastronómica y cultural.'),
('EL-604', 'Bogotá', 'Roma', 'Roma', '2026-10-25', '19:35', '13:15 (+1 día)', 820, 'Una escala', 'Ejecutiva', 'Airbus', 4750000, '../../imagenes/roma.jpg', 'Explora Roma y sus monumentos históricos en una experiencia inolvidable.'),
('EL-605', 'Cartagena', 'Punta Cana', 'Punta Cana', '2026-11-04', '09:00', '12:30', 210, 'Directo', 'Económica', 'Boeing', 1890000, '../../imagenes/punta-cana.jpg', 'Disfruta Punta Cana con playas paradisíacas y descanso total.'),
('EL-606', 'Bogotá', 'Toronto', 'Toronto', '2026-11-16', '08:15', '15:45', 450, 'Una escala', 'Económica', 'Airbus', 3520000, '../../imagenes/toronto.jpg', 'Visita Toronto, una ciudad diversa, moderna y llena de experiencias urbanas.'),
('EL-607', 'Medellín', 'Santiago', 'Santiago', '2026-11-28', '11:40', '18:10', 390, 'Directo', 'Ejecutiva', 'Boeing', 2680000, '../../imagenes/santiago.jpg', 'Conoce Santiago de Chile y disfruta sus paisajes urbanos rodeados de montañas.'),
('EL-608', 'Cali', 'San José', 'San José', '2026-12-05', '07:30', '10:20', 170, 'Directo', 'Económica', 'Regional', 1580000, '../../imagenes/san-jose.jpg', 'Viaja a San José y descubre la naturaleza y cultura de Costa Rica.'),
('EL-609', 'Bogotá', 'Barcelona', 'Barcelona', '2026-12-18', '20:50', '15:10 (+1 día)', 860, 'Una escala', 'Primera clase', 'Airbus', 4980000, '../../imagenes/barcelona.jpg', 'Disfruta Barcelona, su arquitectura, playas y vida cultural.'),
('EL-610', 'Medellín', 'Orlando', 'Orlando', '2027-01-08', '05:55', '10:40', 285, 'Directo', 'Económica', 'Boeing', 2050000, '../../imagenes/orlando.jpg', 'Viaja a Orlando y vive una experiencia llena de entretenimiento.'),
('EL-611', 'Cartagena', 'Panamá', 'Ciudad de Panamá', '2027-01-19', '14:10', '15:35', 85, 'Directo', 'Económica', 'Regional', 980000, '../../imagenes/panama.jpg', 'Conecta con Ciudad de Panamá, un destino cercano y moderno.'),
('EL-612', 'Bogotá', 'Ámsterdam', 'Ámsterdam', '2027-02-02', '22:20', '16:45 (+1 día)', 865, 'Una escala', 'Ejecutiva', 'Boeing', 4860000, '../../imagenes/amsterdam.jpg', 'Explora Ámsterdam, sus canales, museos y ambiente cultural.'),
('EL-613', 'Cali', 'Quito', 'Quito', '2027-02-14', '10:05', '11:55', 110, 'Directo', 'Económica', 'Regional', 1120000, '../../imagenes/quito.jpg', 'Conoce Quito, una ciudad andina con gran riqueza histórica.'),
('EL-614', 'Bogotá', 'Los Ángeles', 'Los Ángeles', '2027-03-01', '16:30', '23:20', 410, 'Una escala', 'Primera clase', 'Boeing', 4200000, '../../imagenes/los-angeles.jpg', 'Viaja a Los Ángeles y descubre entretenimiento, playas y cultura urbana.'),
('EL-615', 'Medellín', 'Montevideo', 'Montevideo', '2027-03-12', '12:45', '19:15', 390, 'Una escala', 'Económica', 'Airbus', 2510000, '../../imagenes/montevideo.jpg', 'Descubre Montevideo, una ciudad tranquila con encanto costero.'),
('EL-616', 'Bogotá', 'Lisboa', 'Lisboa', '2027-03-25', '18:40', '13:05 (+1 día)', 825, 'Una escala', 'Ejecutiva', 'Airbus', 4550000, '../../imagenes/lisboa.jpg', 'Conoce Lisboa, sus miradores, historia y ambiente atlántico.'),
('EL-617', 'Cartagena', 'Santo Domingo', 'Santo Domingo', '2027-04-07', '08:50', '11:25', 155, 'Directo', 'Económica', 'Regional', 1320000, '../../imagenes/santo-domingo.jpg', 'Visita Santo Domingo y disfruta su historia caribeña.'),
('EL-618', 'Cali', 'Buenos Aires', 'Buenos Aires', '2027-04-18', '15:15', '22:05', 410, 'Una escala', 'Económica', 'Boeing', 2890000, '../../imagenes/buenos-aires.jpg', 'Vive Buenos Aires desde Cali con una experiencia cultural completa.'),
('EL-619', 'Bogotá', 'Tokio', 'Tokio', '2027-05-05', '23:55', '06:40 (+2 días)', 1225, 'Dos o más', 'Primera clase', 'Boeing', 5000000, '../../imagenes/tokio.jpg', 'Explora Tokio, una ciudad donde tradición y tecnología se encuentran.')
ON CONFLICT (numero_vuelo) DO NOTHING;

-- ===========================
-- INSERTS DE RESERVAS
-- ===========================
INSERT INTO reservas (
    numero_reserva,
    id_usuario,
    id_vuelo,
    estado,
    clase,
    pasajeros,
    tarifa_extra,
    descuento,
    total
) VALUES
('RES-0001', 1, 1, 'Confirmada', 'Económica', 1, 0, 658000, 2632000),
('RES-0002', 2, 2, 'Pendiente', 'Económica', 2, 0, 896000, 3584000),
('RES-0003', 3, 3, 'Cancelada', 'Ejecutiva', 1, 890000, 434000, 2626000),
('RES-0004', 4, 4, 'Confirmada', 'Primera clase', 1, 1300000, 778000, 4412000),
('RES-0005', 5, 5, 'Pendiente', 'Económica', 1, 0, 552000, 2208000),
('RES-0006', 6, 6, 'Confirmada', 'Ejecutiva', 2, 890000, 468000, 2762000),
('RES-0007', 7, 7, 'Confirmada', 'Económica', 1, 0, 924000, 3696000),
('RES-0008', 8, 8, 'Pendiente', 'Económica', 1, 0, 396000, 1584000),
('RES-0009', 9, 9, 'Cancelada', 'Económica', 1, 0, 290000, 1160000),
('RES-0010', 10, 10, 'Confirmada', 'Ejecutiva', 1, 890000, 950000, 4690000),
('RES-0011', 11, 11, 'Pendiente', 'Económica', 2, 0, 378000, 1512000),
('RES-0012', 12, 12, 'Confirmada', 'Económica', 1, 0, 704000, 2816000),
('RES-0013', 13, 13, 'Confirmada', 'Ejecutiva', 1, 890000, 536000, 3034000),
('RES-0014', 14, 14, 'Pendiente', 'Económica', 1, 0, 316000, 1264000),
('RES-0015', 15, 15, 'Cancelada', 'Primera clase', 1, 1300000, 996000, 5284000),
('RES-0016', 16, 16, 'Confirmada', 'Económica', 3, 0, 410000, 1640000),
('RES-0017', 17, 17, 'Pendiente', 'Económica', 1, 0, 196000, 784000),
('RES-0018', 18, 18, 'Confirmada', 'Ejecutiva', 1, 890000, 972000, 4778000),
('RES-0019', 19, 19, 'Pendiente', 'Económica', 1, 0, 224000, 896000),
('RES-0020', 20, 20, 'Confirmada', 'Primera clase', 1, 1300000, 840000, 4660000),
('RES-0021', 21, 21, 'Cancelada', 'Económica', 2, 0, 502000, 2008000),
('RES-0022', 22, 22, 'Confirmada', 'Ejecutiva', 1, 890000, 910000, 4530000),
('RES-0023', 23, 23, 'Pendiente', 'Económica', 1, 0, 264000, 1056000),
('RES-0024', 24, 24, 'Confirmada', 'Económica', 1, 0, 578000, 2312000),
('RES-0025', 25, 25, 'Pendiente', 'Primera clase', 1, 1300000, 1000000, 5300000)
ON CONFLICT (numero_reserva) DO NOTHING;



INSERT INTO roles (nombre_rol) VALUES
('Super Administrador'),
('Agente de Aerolinea'),
('Cliente')
ON CONFLICT DO NOTHING;

INSERT INTO estado_reserva (nombre_estado) VALUES
('Reservada'),
('Confirmada'),
('Cancelada'),
('Expirada')
ON CONFLICT DO NOTHING;