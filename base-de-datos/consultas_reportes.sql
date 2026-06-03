-- Consultas de reporte usando solo las tablas existentes del esquema.
-- Estas consultas pueden ejecutarse directamente en la base de datos PostgreSQL.

-- 1) Ingresos mensuales por destino
SELECT
    cd.nombre_ciudad AS destino,
    TO_CHAR(r.fecha_hora_reserva, 'YYYY-MM') AS mes,
    SUM(r.valor_total)::NUMERIC(12,2) AS ingresos
FROM reserva r
JOIN vuelo v ON r.cod_vuelo = v.cod_vuelo
JOIN ciudad cd ON v.id_ciudad_destino = cd.id_ciudad
GROUP BY cd.nombre_ciudad, mes
ORDER BY mes DESC, ingresos DESC;

-- 2) Número de reservas por vuelo y por mes
SELECT
    v.cod_vuelo,
    TO_CHAR(r.fecha_hora_reserva, 'YYYY-MM') AS mes,
    COUNT(*)::INT AS total_reservas
FROM reserva r
JOIN vuelo v ON r.cod_vuelo = v.cod_vuelo
GROUP BY v.cod_vuelo, mes
ORDER BY mes DESC, total_reservas DESC;

-- 3) Clientes frecuentes (más reservas realizadas)
SELECT
    c.numero_identificacion,
    c.nombres || ' ' || c.apellidos AS cliente,
    COUNT(*)::INT AS total_reservas
FROM reserva r
JOIN cliente c ON c.numero_identificacion = r.numero_identificacion_cliente
GROUP BY c.numero_identificacion, cliente
ORDER BY total_reservas DESC;

-- 4) Listado de vuelos por país, departamento y ciudad
-- Interpretación: agrupar vuelos según origen/destino geográfico.
SELECT
    v.cod_vuelo,
    co.nombre_ciudad AS origen_ciudad,
    ifo.nombre_departamento AS origen_departamento,
    po.nombre_pais AS origen_pais,
    cd.nombre_ciudad AS destino_ciudad,
    ifd.nombre_departamento AS destino_departamento,
    pd.nombre_pais AS destino_pais,
    v.fecha_hora_salida,
    v.fecha_hora_llegada,
    v.estado_vuelo,
    v.precio_base
FROM vuelo v
JOIN ciudad co ON co.id_ciudad = v.id_ciudad_origen
JOIN departamento ifo ON ifo.id_departamento = co.id_departamento
JOIN pais po ON po.id_pais = ifo.id_pais
JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
JOIN departamento ifd ON ifd.id_departamento = cd.id_departamento
JOIN pais pd ON pd.id_pais = ifd.id_pais
ORDER BY po.nombre_pais, ifo.nombre_departamento, co.nombre_ciudad, pd.nombre_pais, ifd.nombre_departamento, cd.nombre_ciudad;

-- 5) Destinos más vendidos por sector geográfico
-- Usamos país y departamento como sector geográfico.
SELECT
    p.nombre_pais AS pais,
    d.nombre_departamento AS departamento,
    cd.nombre_ciudad AS destino,
    COUNT(r.id_reserva)::INT AS total_reservas,
    SUM(r.valor_total)::NUMERIC(12,2) AS ingresos
FROM reserva r
JOIN vuelo v ON r.cod_vuelo = v.cod_vuelo
JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
JOIN departamento d ON d.id_departamento = cd.id_departamento
JOIN pais p ON p.id_pais = d.id_pais
GROUP BY p.nombre_pais, d.nombre_departamento, cd.nombre_ciudad
ORDER BY p.nombre_pais, d.nombre_departamento, total_reservas DESC;

-- 6) Tiempo promedio entre reserva y confirmación
SELECT
    AVG(EXTRACT(EPOCH FROM (confirmada.fecha_hora_cambio - inicial.fecha_hora_cambio)) / 60)::NUMERIC(10,2) AS promedio_minutos
FROM historial_estado_reserva inicial
JOIN historial_estado_reserva confirmada
    ON inicial.id_reserva = confirmada.id_reserva
WHERE inicial.id_estado = 1
  AND confirmada.id_estado = 2
  AND confirmada.fecha_hora_cambio > inicial.fecha_hora_cambio;

-- 7) Historial de reservas por cliente
SELECT
    c.numero_identificacion,
    c.nombres || ' ' || c.apellidos AS cliente,
    r.id_reserva,
    er.nombre_estado AS estado_actual,
    her.id_estado AS estado_historial,
    he.nombre_estado AS nombre_estado_historial,
    her.fecha_hora_cambio,
    her.responsable,
    her.observacion
FROM cliente c
JOIN reserva r ON r.numero_identificacion_cliente = c.numero_identificacion
LEFT JOIN historial_estado_reserva her ON her.id_reserva = r.id_reserva
LEFT JOIN estado_reserva he ON he.id_estado = her.id_estado
JOIN estado_reserva er ON er.id_estado = r.id_estado
ORDER BY c.numero_identificacion, r.id_reserva, her.fecha_hora_cambio;

-- 8) Reservas canceladas y su causa
SELECT
    r.id_reserva,
    c.nombres || ' ' || c.apellidos AS cliente,
    v.cod_vuelo,
    cd.nombre_ciudad AS destino,
    her.fecha_hora_cambio AS fecha_cancelacion,
    her.observacion AS causa
FROM historial_estado_reserva her
JOIN reserva r ON r.id_reserva = her.id_reserva
JOIN cliente c ON c.numero_identificacion = r.numero_identificacion_cliente
JOIN vuelo v ON v.cod_vuelo = r.cod_vuelo
JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
JOIN estado_reserva er ON er.id_estado = her.id_estado
WHERE er.nombre_estado = 'Cancelada'
ORDER BY her.fecha_hora_cambio DESC;

