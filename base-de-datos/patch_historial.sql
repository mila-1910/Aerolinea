-- Migración: añadir responsable y observación al historial de reservas

ALTER TABLE historial_estado_reserva
    ADD COLUMN responsable VARCHAR(100),
    ADD COLUMN observacion TEXT;

-- Nota: ejecutar manualmente si la DB no permite migraciones automáticas
