-- =========================================
-- INSERTS TABLA PAIS.
-- =========================================

INSERT INTO pais (nombre_pais) VALUES ('Colombia');
INSERT INTO pais (nombre_pais) VALUES ('Mexico');
INSERT INTO pais (nombre_pais) VALUES ('Argentina');
INSERT INTO pais (nombre_pais) VALUES ('EspaÃ±a');
INSERT INTO pais (nombre_pais) VALUES ('Francia');
INSERT INTO pais (nombre_pais) VALUES ('Italia');
INSERT INTO pais (nombre_pais) VALUES ('Alemania');
INSERT INTO pais (nombre_pais) VALUES ('Portugal');
INSERT INTO pais (nombre_pais) VALUES ('Estados Unidos');
INSERT INTO pais (nombre_pais) VALUES ('Peru');



-- =========================================
-- INSERTS TABLA DEPARTAMENTO
-- =========================================

INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Valle del Cauca',1);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Cundinamarca',1);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Antioquia',1);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Atlantico',1);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Bolivar',1);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Ciudad de Mexico',2);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Buenos Aires',3);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Madrid',4);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Paris',5);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Lima',10);



-- =========================================
-- INSERTS TABLA CIUDAD
-- =========================================

INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Cali',1);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Bogota',2);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Medellin',3);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Barranquilla',4);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Cartagena',5);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Ciudad de Mexico',6);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Buenos Aires',7);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Madrid',8);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Paris',9);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Lima',10);



-- =========================================
-- INSERTS TABLA CLIENTE
-- =========================================

INSERT INTO cliente VALUES
('1001','CC','Juan','Perez','Calle 1','juan@gmail.com','3001111111','3111111111',1);

INSERT INTO cliente VALUES
('1002','CC','Maria','Lopez','Calle 2','maria@gmail.com','3002222222','3112222222',2);

INSERT INTO cliente VALUES
('1003','CC','Carlos','Diaz','Calle 3','carlos@gmail.com','3003333333','3113333333',3);

INSERT INTO cliente VALUES
('1004','CC','Ana','Garcia','Calle 4','ana@gmail.com','3004444444','3114444444',4);

INSERT INTO cliente VALUES
('1005','CC','Luis','Torres','Calle 5','luis@gmail.com','3005555555','3115555555',5);

INSERT INTO cliente VALUES
('1006','Pasaporte','Laura','Ramirez','Calle 6','laura@gmail.com','3006666666','3116666666',6);

INSERT INTO cliente VALUES
('1007','Pasaporte','Andres','Rojas','Calle 7','andres@gmail.com','3007777777','3117777777',7);

INSERT INTO cliente VALUES
('1008','Pasaporte','Sofia','Martinez','Calle 8','sofia@gmail.com','3008888888','3118888888',8);

INSERT INTO cliente VALUES
('1009','Pasaporte','Mateo','Castro','Calle 9','mateo@gmail.com','3009999999','3119999999',9);

INSERT INTO cliente VALUES
('1010','Pasaporte','Valentina','Gomez','Calle 10','valentina@gmail.com','3001010101','3111010101',10);



-- =========================================
-- INSERTS TABLA ROL
-- =========================================

INSERT INTO rol VALUES ('Administrador');
INSERT INTO rol VALUES ('Agente');
INSERT INTO rol VALUES ('Cliente');



-- =========================================
-- INSERTS TABLA ESTADO_RESERVA
-- =========================================

INSERT INTO estado_reserva (nombre_estado) VALUES ('Reservada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Confirmada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Cancelada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Expirada');

-- =========================================
-- INSERTS TABLA VUELO
-- =========================================

INSERT INTO vuelo 
(fecha_hora_salida,fecha_hora_llegada,capacidad_pasajeros,precio_base,estado_vuelo,id_ciudad_origen,id_ciudad_destino,cod_vuelo)
VALUES
('2026-06-01 08:00','2026-06-01 09:00',180,350000,'Programado',1,2,'AV001');

INSERT INTO vuelo VALUES
('AV002','2026-06-02 09:00','2026-06-02 10:30',200,420000,'Programado',2,3);

INSERT INTO vuelo VALUES
('AV003','2026-06-03 10:00','2026-06-03 11:20',150,380000,'Abordando',3,4);

INSERT INTO vuelo VALUES
('AV004','2026-06-04 11:00','2026-06-04 12:10',170,410000,'En vuelo',4,5);

INSERT INTO vuelo VALUES
('AV005','2026-06-05 12:00','2026-06-05 13:00',160,450000,'Programado',5,1);

INSERT INTO vuelo VALUES
('AV006','2026-06-06 13:00','2026-06-06 17:00',220,1200000,'Programado',1,6);

INSERT INTO vuelo VALUES
('AV007','2026-06-07 14:00','2026-06-07 20:00',210,1500000,'Programado',2,7);

INSERT INTO vuelo VALUES
('AV008','2026-06-08 15:00','2026-06-08 23:00',250,2500000,'Programado',3,8);

INSERT INTO vuelo VALUES
('AV009','2026-06-09 16:00','2026-06-10 01:00',260,2800000,'Programado',4,9);

INSERT INTO vuelo VALUES
('AV010','2026-06-10 17:00','2026-06-11 03:00',230,1800000,'Programado',5,10);



-- =========================================
-- INSERTS TABLA RESERVA
-- =========================================

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-01 10:00',700000,'AV001','1001',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-02 11:00',840000,'AV002','1002',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-03 12:00',760000,'AV003','1003',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-04 13:00',820000,'AV004','1004',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-05 14:00',900000,'AV005','1005',3);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-06 15:00',2400000,'AV006','1006',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-07 16:00',3000000,'AV007','1007',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-08 17:00',5000000,'AV008','1008',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-09 18:00',5600000,'AV009','1009',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-10 19:00',3600000,'AV010','1010',1);



-- =========================================
-- INSERTS TABLA HISTORIAL_ESTADO_RESERVA
-- =========================================

INSERT INTO historial_estado_reserva VALUES (1,1,'2026-05-01 10:05');

INSERT INTO historial_estado_reserva VALUES (2,2,'2026-05-02 11:05');

INSERT INTO historial_estado_reserva VALUES (3,1,'2026-05-03 12:05');

INSERT INTO historial_estado_reserva VALUES (4,2,'2026-05-04 13:05');

INSERT INTO historial_estado_reserva VALUES (5,3,'2026-05-05 14:05');

INSERT INTO historial_estado_reserva VALUES (6,1,'2026-05-06 15:05');

INSERT INTO historial_estado_reserva VALUES (7,2,'2026-05-07 16:05');

INSERT INTO historial_estado_reserva VALUES (8,1,'2026-05-08 17:05');

INSERT INTO historial_estado_reserva VALUES (9,2,'2026-05-09 18:05');

INSERT INTO historial_estado_reserva VALUES (10,1,'2026-05-10 19:05');

-- =========================================
-- INSERTS TABLA TIQUETE
-- =========================================

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('1A','Economica',350000,1);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('2B','Ejecutiva',420000,2);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('3C','Economica',380000,3);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('4D','Ejecutiva',410000,4);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('5E','Primera Clase',450000,5);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('6F','Economica',1200000,6);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('7A','Ejecutiva',1500000,7);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('8B','Primera Clase',2500000,8);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('9C','Primera Clase',2800000,9);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('10D','Ejecutiva',1800000,10);



-- =========================================
-- INSERTS TABLA PAQUETE_TURISTICO
-- =========================================

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Tour Cartagena','Tour por playas','Cartagena',500000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Hotel Cali','Hospedaje 3 noches','Cali',350000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Tour Bogota','Recorrido turistico','Bogota',300000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Paquete Medellin','Hotel y transporte','Medellin',600000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Tour Barranquilla','Carnaval y playas','Barranquilla',450000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Mexico VIP','Hotel y city tour','Ciudad de Mexico',1200000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Buenos Aires Full','Hotel + guia','Buenos Aires',1400000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Madrid Europa','Tour completo','Madrid',1800000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Paris Dreams','Paquete romantico','Paris',2200000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Lima Gastronomica','Tour comida peruana','Lima',900000,'Disponible');



-- =========================================
-- INSERTS TABLA RESERVA_PAQUETE
-- =========================================

INSERT INTO reserva_paquete VALUES (1,1);

INSERT INTO reserva_paquete VALUES (2,2);

INSERT INTO reserva_paquete VALUES (3,3);

INSERT INTO reserva_paquete VALUES (4,4);

INSERT INTO reserva_paquete VALUES (5,5);

INSERT INTO reserva_paquete VALUES (6,6);

INSERT INTO reserva_paquete VALUES (7,7);

INSERT INTO reserva_paquete VALUES (8,8);

INSERT INTO reserva_paquete VALUES (9,9);

INSERT INTO reserva_paquete VALUES (10,10);



-- =========================================
-- INSERTS TABLA USUARIO
-- =========================================

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('admin1','admin123','Administrador',NULL);

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('agente1','agente123','Agente',NULL);

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('juanp','123','Cliente','1001');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('marial','123','Cliente','1002');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('carlosd','123','Cliente','1003');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('anag','123','Cliente','1004');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('luist','123','Cliente','1005');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('laurar','123','Cliente','1006');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('andresr','123','Cliente','1007');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('sofiam','123','Cliente','1008');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('mateoc','123','Cliente','1009');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('valentinag','123','Cliente','1010');