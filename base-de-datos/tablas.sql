-- =========================================
-- MODELO SQL FINAL
-- PK NATURALES + PK SERIAL
-- =========================================


-- =========================================
-- PAIS
-- =========================================

CREATE TABLE pais (

    nombre_pais VARCHAR(100) PRIMARY KEY
);



-- =========================================
-- DEPARTAMENTO
-- =========================================

CREATE TABLE departamento (

    nombre_departamento VARCHAR(100) PRIMARY KEY,

    nombre_pais VARCHAR(100) NOT NULL,

    CONSTRAINT fk_departamento_pais
    FOREIGN KEY (nombre_pais)
    REFERENCES pais(nombre_pais)
);



-- =========================================
-- CIUDAD
-- =========================================

CREATE TABLE ciudad (

    nombre_ciudad VARCHAR(100) PRIMARY KEY,

    nombre_departamento VARCHAR(100) NOT NULL,

    CONSTRAINT fk_ciudad_departamento
    FOREIGN KEY (nombre_departamento)
    REFERENCES departamento(nombre_departamento)
);



-- =========================================
-- CLIENTE
-- =========================================

CREATE TABLE cliente (

    numero_identificacion VARCHAR(20) PRIMARY KEY,

    tipo_identificacion VARCHAR(20) NOT NULL,

    nombres VARCHAR(100) NOT NULL,

    apellidos VARCHAR(100) NOT NULL,

    direccion VARCHAR(150),

    correo VARCHAR(120) UNIQUE NOT NULL,

    tel_principal VARCHAR(20),

    tel_alterno VARCHAR(20),

    nombre_ciudad VARCHAR(100) NOT NULL,

    CONSTRAINT fk_cliente_ciudad
    FOREIGN KEY (nombre_ciudad)
    REFERENCES ciudad(nombre_ciudad)
);



-- =========================================
-- VUELO
-- =========================================

CREATE TABLE vuelo (

    cod_vuelo VARCHAR(20) PRIMARY KEY,

    fecha_hora_salida TIMESTAMP NOT NULL,

    fecha_hora_llegada TIMESTAMP NOT NULL,

    capacidad_pasajeros INT NOT NULL,

    precio_base NUMERIC(10,2) NOT NULL,

    estado_vuelo VARCHAR(30) NOT NULL,

    ciudad_origen VARCHAR(100) NOT NULL,

    ciudad_destino VARCHAR(100) NOT NULL,

    CONSTRAINT fk_vuelo_origen
    FOREIGN KEY (ciudad_origen)
    REFERENCES ciudad(nombre_ciudad),

    CONSTRAINT fk_vuelo_destino
    FOREIGN KEY (ciudad_destino)
    REFERENCES ciudad(nombre_ciudad)
);



-- =========================================
-- ESTADO_RESERVA
-- =========================================

CREATE TABLE estado_reserva (

    id_estado SERIAL PRIMARY KEY,

    nombre_estado VARCHAR(50) UNIQUE NOT NULL
);



-- =========================================
-- RESERVA
-- =========================================

CREATE TABLE reserva (

    id_reserva SERIAL PRIMARY KEY,

    fecha_hora_reserva TIMESTAMP NOT NULL,

    valor_total NUMERIC(10,2) NOT NULL,

    cod_vuelo VARCHAR(20) NOT NULL,

    numero_identificacion_cliente VARCHAR(20) NOT NULL,

    id_estado INT NOT NULL,

    CONSTRAINT fk_reserva_vuelo
    FOREIGN KEY (cod_vuelo)
    REFERENCES vuelo(cod_vuelo),

    CONSTRAINT fk_reserva_cliente
    FOREIGN KEY (numero_identificacion_cliente)
    REFERENCES cliente(numero_identificacion),

    CONSTRAINT fk_reserva_estado
    FOREIGN KEY (id_estado)
    REFERENCES estado_reserva(id_estado)
);



-- =========================================
-- HISTORIAL_ESTADO_RESERVA
-- =========================================

CREATE TABLE historial_estado_reserva (

    id_historial SERIAL PRIMARY KEY,

    id_reserva INT NOT NULL,

    id_estado INT NOT NULL,

    fecha_hora_cambio TIMESTAMP NOT NULL,

    CONSTRAINT fk_historial_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva),

    CONSTRAINT fk_historial_estado
    FOREIGN KEY (id_estado)
    REFERENCES estado_reserva(id_estado)
);



-- =========================================
-- TIQUETE
-- =========================================

CREATE TABLE tiquete (

    id_tiquete SERIAL PRIMARY KEY,

    numero_asiento VARCHAR(10) NOT NULL,

    clase_tiquete VARCHAR(30) NOT NULL,

    precio_final NUMERIC(10,2) NOT NULL,

    id_reserva INT NOT NULL,

    CONSTRAINT fk_tiquete_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva)
);



-- =========================================
-- PAQUETE_TURISTICO
-- =========================================

CREATE TABLE paquete_turistico (

    id_paquete SERIAL PRIMARY KEY,

    nombre_paquete VARCHAR(100) UNIQUE NOT NULL,

    descripcion TEXT,

    sector_destino VARCHAR(100),

    precio NUMERIC(10,2) NOT NULL,

    estado VARCHAR(30) NOT NULL
);



-- =========================================
-- RESERVA_PAQUETE
-- =========================================

CREATE TABLE reserva_paquete (

    id_reserva INT NOT NULL,

    id_paquete INT NOT NULL,

    PRIMARY KEY (id_reserva, id_paquete),

    CONSTRAINT fk_rp_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva),

    CONSTRAINT fk_rp_paquete
    FOREIGN KEY (id_paquete)
    REFERENCES paquete_turistico(id_paquete)
);



-- =========================================
-- ROL
-- =========================================

CREATE TABLE rol (

    nombre_rol VARCHAR(50) PRIMARY KEY
);



-- =========================================
-- USUARIO
-- =========================================

CREATE TABLE usuario (

    id_usuario SERIAL PRIMARY KEY,

    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,

    contrasena VARCHAR(255) NOT NULL,

    nombre_rol VARCHAR(50) NOT NULL,

    numero_identificacion_cliente VARCHAR(20),

    CONSTRAINT fk_usuario_rol
    FOREIGN KEY (nombre_rol)
    REFERENCES rol(nombre_rol),

    CONSTRAINT fk_usuario_cliente
    FOREIGN KEY (numero_identificacion_cliente)
    REFERENCES cliente(numero_identificacion)
);