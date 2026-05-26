-- Script de migración: crear tabla solicitud_cliente

CREATE TABLE solicitud_cliente (
    id_solicitud SERIAL PRIMARY KEY,
    numero_identificacion_cliente VARCHAR(20) NOT NULL,
    id_reserva INT,
    tipo_solicitud VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(30) NOT NULL DEFAULT 'Abierta',
    prioridad VARCHAR(20) NOT NULL DEFAULT 'Normal',
    respuesta_agente TEXT,
    id_agente INT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_respuesta TIMESTAMP,

    CONSTRAINT fk_solicitud_cliente FOREIGN KEY (numero_identificacion_cliente)
        REFERENCES cliente(numero_identificacion),
    CONSTRAINT fk_solicitud_reserva FOREIGN KEY (id_reserva)
        REFERENCES reserva(id_reserva),
    CONSTRAINT fk_solicitud_agente FOREIGN KEY (id_agente)
        REFERENCES usuario(id_usuario)
);

-- Índices sugeridos
CREATE INDEX idx_solicitud_estado ON solicitud_cliente(estado);
CREATE INDEX idx_solicitud_prioridad ON solicitud_cliente(prioridad);
CREATE INDEX idx_solicitud_tipo ON solicitud_cliente(tipo_solicitud);
