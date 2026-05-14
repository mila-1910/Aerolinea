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

-- Evitar reservas activas duplicadas para el mismo usuario y vuelo
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservas_usuario_vuelo_activa
ON reservas(id_usuario, id_vuelo)
WHERE estado IN ('Pendiente', 'Confirmada');
