-- Tabla para almacenar los usuarios (clientes y administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    tipo_identificacion VARCHAR(10) NOT NULL,
    numero_identificacion VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- Aquí se debe guardar la contraseña encriptada (hash)
    rol VARCHAR(50) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear un índice para búsquedas más rápidas por correo (útil para el login)
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);

-- Tabla de vuelos disponibles para los clientes
CREATE TABLE IF NOT EXISTS vuelos (
    id_vuelo SERIAL PRIMARY KEY,
    numero_vuelo VARCHAR(20) UNIQUE NOT NULL,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    ciudad_destino VARCHAR(100) NOT NULL,
    fecha_salida DATE NOT NULL,
    hora_salida TIME NOT NULL,
    hora_llegada VARCHAR(50) NOT NULL,
    duracion_minutos INTEGER NOT NULL,
    escala VARCHAR(50) NOT NULL,
    clase VARCHAR(50) NOT NULL,
    tipo_avion VARCHAR(50) NOT NULL,
    precio_base INTEGER NOT NULL,
    imagen_url TEXT,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas realizadas por los usuarios
CREATE TABLE IF NOT EXISTS reservas (
    id_reserva SERIAL PRIMARY KEY,
    numero_reserva VARCHAR(30) UNIQUE NOT NULL,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    id_vuelo INTEGER REFERENCES vuelos(id_vuelo),
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada')),
    clase VARCHAR(50) NOT NULL,
    pasajeros INTEGER NOT NULL DEFAULT 1,
    tarifa_extra INTEGER NOT NULL DEFAULT 0,
    descuento INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_vuelos_origen_destino ON vuelos(origen, destino);
CREATE INDEX IF NOT EXISTS idx_vuelos_fecha ON vuelos(fecha_salida);
CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);

-- Vuelos iniciales usados en la sección de cliente
INSERT INTO vuelos (
    numero_vuelo, origen, destino, ciudad_destino, fecha_salida,
    hora_salida, hora_llegada, duracion_minutos, escala, clase,
    tipo_avion, precio_base, imagen_url, descripcion
) VALUES
('EL-204', 'Bogotá', 'Nueva York', 'Nueva York', '2026-04-15',
 '10:30', '17:00', 390, 'Directo', 'Económica',
 'Boeing', 3290000, '../../imagenes/nueva-york.jpg',
 'Disfruta de un increíble viaje a Nueva York, una de las ciudades más icónicas del mundo.'),

('EL-422', 'Bogotá', 'París', 'París', '2026-05-22',
 '09:15', '08:00 am (+1 día)', 765, 'Una escala', 'Económica',
 'Airbus', 4480000, '../../imagenes/paris.jpg',
 'Viaja a París y descubre una ciudad llena de historia, arte y elegancia.'),

('EL-310', 'Medellín', 'Cancún', 'Cancún', '2026-06-10',
 '07:40', '11:55', 255, 'Directo', 'Ejecutiva',
 'Boeing', 2170000, '../../imagenes/cancun.jpg',
 'Escápate a Cancún y disfruta playas de arena blanca y aguas cristalinas.'),

('EL-105', 'Cali', 'Madrid', 'Madrid', '2026-07-05',
 '18:20', '08:45 am (+1 día)', 860, 'Una escala', 'Primera clase',
 'Airbus', 3890000, '../../imagenes/madrid.jpg',
 'Conoce Madrid, una ciudad vibrante con gran riqueza cultural y gastronómica.'),

('EL-518', 'Bogotá', 'Buenos Aires', 'Buenos Aires', '2026-08-18',
 '12:10', '18:20', 370, 'Directo', 'Económica',
 'Boeing', 2760000, '../../imagenes/buenos-aires.jpg',
 'Descubre Buenos Aires, una ciudad llena de cultura, música y arquitectura.'),

('EL-267', 'Cartagena', 'Ciudad de México', 'Ciudad de México', '2026-09-02',
 '08:25', '14:20', 355, 'Una escala', 'Ejecutiva',
 'Airbus', 2340000, '../../imagenes/ciudad-mexico.jpg',
 'Explora Ciudad de México, un destino lleno de historia, sabores y lugares emblemáticos.')
ON CONFLICT (numero_vuelo) DO NOTHING;
