--kamila marin,juan fernando muñoz,santigo rios,jhonatan varon= "Equipo de Desarrollo - Aerolínea ELARIS"--

-- Tabla de países
CREATE TABLE IF NOT EXISTS pais (
    id_pais   SERIAL PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL
);

-- Tabla de departamentos / estados (pertenece a un único país)
CREATE TABLE IF NOT EXISTS departamento (
    id_departamento SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    id_pais         INT NOT NULL,
    CONSTRAINT fk_departamento_pais
        FOREIGN KEY (id_pais) REFERENCES pais(id_pais)
);

-- Tabla de ciudades (pertenece a un único departamento)
CREATE TABLE IF NOT EXISTS ciudad (
    id_ciudad       SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    id_departamento INT NOT NULL,
    CONSTRAINT fk_ciudad_departamento
        FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento)
);

-- Tabla de roles del sistema (Súper Administrador, Agente de Aerolínea, Cliente)
CREATE TABLE IF NOT EXISTS rol (
    id_rol     SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de usuarios del sistema (autenticación y control de acceso)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario      SERIAL PRIMARY KEY,
    nombre_usuario  VARCHAR(100) NOT NULL UNIQUE,
    contrasena      VARCHAR(255) NOT NULL,   -- Se almacena el hash (bcrypt)
    id_rol          INT NOT NULL,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

-- Índice para acelerar el login por nombre de usuario
CREATE INDEX IF NOT EXISTS idx_usuario_nombre ON usuario(nombre_usuario);


-- Tabla de clientes registrados en el sistema
-- Un cliente está ligado a un usuario del sistema (1 a 1)
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente              SERIAL PRIMARY KEY,
    numero_identificacion   VARCHAR(50)  NOT NULL UNIQUE,
    tipo_identificacion     VARCHAR(20)  NOT NULL CHECK (tipo_identificacion IN ('Cédula', 'Pasaporte')),
    nombres                 VARCHAR(100) NOT NULL,
    apellidos               VARCHAR(100) NOT NULL,
    correo                  VARCHAR(150) NOT NULL UNIQUE,
    direccion               TEXT,
    id_ciudad               INT,            -- Ciudad de residencia
    telefono_principal      VARCHAR(30)  NOT NULL,
    telefono_alterno        VARCHAR(30),
    id_usuario              INT          NOT NULL UNIQUE,  -- FK al usuario del sistema
    CONSTRAINT fk_cliente_ciudad
        FOREIGN KEY (id_ciudad) REFERENCES ciudad(id_ciudad),
    CONSTRAINT fk_cliente_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de vuelos disponibles
CREATE TABLE IF NOT EXISTS vuelo (
    id_vuelo            SERIAL PRIMARY KEY,
    cod_vuelo           VARCHAR(20)     NOT NULL UNIQUE,
    id_ciudad_origen    INT             NOT NULL,
    id_ciudad_destino   INT             NOT NULL,
    fecha_hora_salida   TIMESTAMP       NOT NULL,
    fecha_hora_llegada  TIMESTAMP       NOT NULL,
    capacidad_pasajeros INT             NOT NULL CHECK (capacidad_pasajeros > 0),
    precio_base         NUMERIC(12, 2)  NOT NULL CHECK (precio_base >= 0),
    estado_vuelo        VARCHAR(30)     NOT NULL DEFAULT 'Programado'
        CHECK (estado_vuelo IN ('Programado', 'Abordando', 'En vuelo', 'Finalizado', 'Cancelado')),
    CONSTRAINT fk_vuelo_ciudad_origen
        FOREIGN KEY (id_ciudad_origen)  REFERENCES ciudad(id_ciudad),
    CONSTRAINT fk_vuelo_ciudad_destino
        FOREIGN KEY (id_ciudad_destino) REFERENCES ciudad(id_ciudad)
);

-- Índice para consultas frecuentes por estado o ciudad destino
CREATE INDEX IF NOT EXISTS idx_vuelo_estado       ON vuelo(estado_vuelo);
CREATE INDEX IF NOT EXISTS idx_vuelo_ciudad_dest  ON vuelo(id_ciudad_destino);

-- Catálogo de estados posibles de una reserva
CREATE TABLE IF NOT EXISTS estado_reserva (
    id_estado    SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE
        CHECK (nombre_estado IN ('Reservada', 'Confirmada', 'Cancelada', 'Expirada'))
);

-- Tabla de reservas: un cliente, un vuelo, uno o varios tiquetes
CREATE TABLE IF NOT EXISTS reserva (
    id_reserva        SERIAL PRIMARY KEY,
    fecha_hora_reserva TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_total        NUMERIC(12, 2) NOT NULL CHECK (valor_total >= 0),
    id_estado          INT            NOT NULL,
    id_cliente         INT            NOT NULL,
    id_vuelo           INT            NOT NULL,
    CONSTRAINT fk_reserva_estado
        FOREIGN KEY (id_estado)  REFERENCES estado_reserva(id_estado),
    CONSTRAINT fk_reserva_cliente
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT fk_reserva_vuelo
        FOREIGN KEY (id_vuelo)   REFERENCES vuelo(id_vuelo)
);

-- Índice para historial por cliente
CREATE INDEX IF NOT EXISTS idx_reserva_cliente ON reserva(id_cliente);
CREATE INDEX IF NOT EXISTS idx_reserva_vuelo   ON reserva(id_vuelo);


-- Cada tiquete pertenece a una reserva y tiene asiento y clase
CREATE TABLE IF NOT EXISTS tiquete (
    id_tiquete    SERIAL PRIMARY KEY,
    num_asiento   VARCHAR(10)    NOT NULL,
    clase_tiquete VARCHAR(50)    NOT NULL
        CHECK (clase_tiquete IN ('Económica', 'Ejecutiva', 'Primera clase')),
    precio_final  NUMERIC(12, 2) NOT NULL CHECK (precio_final >= 0),
    id_reserva    INT            NOT NULL,
    CONSTRAINT fk_tiquete_reserva
        FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva)
);

-- Paquetes opcionales que se pueden adquirir durante la compra del tiquete
CREATE TABLE IF NOT EXISTS paquete_turistico (
    id_paquete      SERIAL PRIMARY KEY,
    nombre_paquete  VARCHAR(150)   NOT NULL,
    descripcion     TEXT,
    sector_destino  VARCHAR(150),   -- Ciudad / región donde aplica el paquete
    precio          NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    estado          VARCHAR(30)    NOT NULL DEFAULT 'Disponible'
        CHECK (estado IN ('Disponible', 'No disponible'))
);

-- Tabla intermedia: una reserva puede incluir cero, uno o varios paquetes
CREATE TABLE IF NOT EXISTS reserva_paquete (
    id_reserva INT NOT NULL,
    id_paquete INT NOT NULL,
    PRIMARY KEY (id_reserva, id_paquete),
    CONSTRAINT fk_rp_reserva
        FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva),
    CONSTRAINT fk_rp_paquete
        FOREIGN KEY (id_paquete) REFERENCES paquete_turistico(id_paquete)
);

-- Registra cada cambio de estado de una reserva con fecha y hora
CREATE TABLE IF NOT EXISTS historial_estado_reserva (
    id_historial      SERIAL PRIMARY KEY,
    id_reserva        INT       NOT NULL,
    id_estado         INT       NOT NULL,
    fecha_hora_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_reserva
        FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva),
    CONSTRAINT fk_historial_estado
        FOREIGN KEY (id_estado)  REFERENCES estado_reserva(id_estado)
);

-- Roles del sistema
INSERT INTO rol (nombre_rol) VALUES
    ('Super Administrador'),
    ('Agente de Aerolínea'),
    ('Cliente')
ON CONFLICT DO NOTHING;

-- Estados de reserva
INSERT INTO estado_reserva (nombre_estado) VALUES
    ('Reservada'),
    ('Confirmada'),
    ('Cancelada'),
    ('Expirada')
ON CONFLICT DO NOTHING;