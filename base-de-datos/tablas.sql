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



-- ===========================
-- TABLAS DE REFERENCIA
-- ===========================

-- Tabla de países
CREATE TABLE IF NOT EXISTS pais (
    id_pais SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de departamentos (referencia a pais)
CREATE TABLE IF NOT EXISTS departamento (
    id_departamento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_pais INT NOT NULL,
    CONSTRAINT fk_departamento_pais
        FOREIGN KEY (id_pais) REFERENCES pais(id_pais)
);

-- Tabla de ciudades (referencia a departamento)
CREATE TABLE IF NOT EXISTS ciudad (
    id_ciudad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_departamento INT NOT NULL,
    CONSTRAINT fk_ciudad_departamento
        FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento)
);

-- Tabla de roles del sistema
CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

-- Tabla de estados posibles de una reserva
CREATE TABLE IF NOT EXISTS estado_reserva (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);

-- ===========================
-- TABLAS OPERACIONALES
-- ===========================

-- Tabla de tiquetes asociados a reservas
CREATE TABLE IF NOT EXISTS tiquetes (
    id_tiquete SERIAL PRIMARY KEY,
    numero_asiento VARCHAR(10) NOT NULL,
    clase_tiquete VARCHAR(50) NOT NULL,
    precio_final NUMERIC(10,2) NOT NULL,
    id_reserva INT NOT NULL,
    CONSTRAINT fk_tiquete_reserva
        FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva)
);

-- Tabla de paquetes turísticos disponibles
CREATE TABLE IF NOT EXISTS paquetes_turisticos (
    id_paquete SERIAL PRIMARY KEY,
    nombre_paquete VARCHAR(100) NOT NULL,
    descripcion TEXT,
    sector_destino VARCHAR(100),
    estado VARCHAR(50),
    precio NUMERIC(10,2)
);

-- Tabla intermedia: reserva puede incluir uno o más paquetes
CREATE TABLE IF NOT EXISTS reserva_incluye_paquete (
    id_reserva INT NOT NULL,
    id_paquete INT NOT NULL,
    PRIMARY KEY (id_reserva, id_paquete),
    CONSTRAINT fk_rip_reserva
        FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    CONSTRAINT fk_rip_paquete
        FOREIGN KEY (id_paquete) REFERENCES paquetes_turisticos(id_paquete)
);

-- Historial de cambios de estado de una reserva
CREATE TABLE IF NOT EXISTS historial_estado_reserva (
    id_historial SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL,
    id_estado INT NOT NULL,
    fecha_hora_cambio TIMESTAMP NOT NULL,
    CONSTRAINT fk_historial_reserva
        FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    CONSTRAINT fk_historial_estado
        FOREIGN KEY (id_estado) REFERENCES estado_reserva(id_estado)
);