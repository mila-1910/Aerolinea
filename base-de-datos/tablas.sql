-- =========================================
-- MODELO SQL FINAL CORREGIDO
-- =========================================


-- =========================================
-- TABLA PAIS
-- =========================================

CREATE TABLE pais (

    id_pais SERIAL PRIMARY KEY,

    nombre_pais VARCHAR(100) UNIQUE NOT NULL
);



-- =========================================
-- TABLA DEPARTAMENTO
-- =========================================

CREATE TABLE departamento (

    id_departamento SERIAL PRIMARY KEY,

    nombre_departamento VARCHAR(100) UNIQUE NOT NULL,

    id_pais INT NOT NULL,

    CONSTRAINT fk_departamento_pais
    FOREIGN KEY (id_pais)
    REFERENCES pais(id_pais)
);



-- =========================================
-- TABLA CIUDAD
-- =========================================

CREATE TABLE ciudad (

    id_ciudad SERIAL PRIMARY KEY,

    nombre_ciudad VARCHAR(100) UNIQUE NOT NULL,

    id_departamento INT NOT NULL,

    CONSTRAINT fk_ciudad_departamento
    FOREIGN KEY (id_departamento)
    REFERENCES departamento(id_departamento)
);



-- =========================================
-- TABLA CLIENTE
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

    id_ciudad INT NOT NULL,

    CONSTRAINT fk_cliente_ciudad
    FOREIGN KEY (id_ciudad)
    REFERENCES ciudad(id_ciudad)
);



-- =========================================
-- TABLA VUELO
-- =========================================

CREATE TABLE vuelo (

    cod_vuelo VARCHAR(20) PRIMARY KEY,

    fecha_hora_salida TIMESTAMP NOT NULL,

    fecha_hora_llegada TIMESTAMP NOT NULL,

    capacidad_pasajeros INT NOT NULL,

    precio_base NUMERIC(10,2) NOT NULL,

    estado_vuelo VARCHAR(30) NOT NULL,

    id_ciudad_origen INT NOT NULL,

    id_ciudad_destino INT NOT NULL,

    CONSTRAINT fk_vuelo_origen
    FOREIGN KEY (id_ciudad_origen)
    REFERENCES ciudad(id_ciudad),

    CONSTRAINT fk_vuelo_destino
    FOREIGN KEY (id_ciudad_destino)
    REFERENCES ciudad(id_ciudad)
);



-- =========================================
-- TABLA ESTADO_RESERVA
-- =========================================

CREATE TABLE estado_reserva (

    id_estado SERIAL PRIMARY KEY,

    nombre_estado VARCHAR(50) UNIQUE NOT NULL
);



-- =========================================
-- TABLA RESERVA
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
-- TABLA HISTORIAL_ESTADO_RESERVA
-- =========================================

CREATE TABLE historial_estado_reserva (

    id_reserva INT NOT NULL,

    id_estado INT NOT NULL,

    fecha_hora_cambio TIMESTAMP NOT NULL,

    PRIMARY KEY (id_reserva, id_estado),

    CONSTRAINT fk_historial_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva),

    CONSTRAINT fk_historial_estado
    FOREIGN KEY (id_estado)
    REFERENCES estado_reserva(id_estado)
);



-- =========================================
-- TABLA TIQUETE
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
-- TABLA PAQUETE_TURISTICO
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
-- TABLA RESERVA_PAQUETE
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
-- TABLA ROL
-- =========================================

CREATE TABLE rol (

    nombre_rol VARCHAR(50) PRIMARY KEY
);



-- =========================================
-- TABLA USUARIO
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