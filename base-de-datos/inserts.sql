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
-- INSERTS TABLA PAIS
-- =========================================

INSERT INTO pais VALUES ('Colombia');
INSERT INTO pais VALUES ('Mexico');
INSERT INTO pais VALUES ('Argentina');
INSERT INTO pais VALUES ('Peru');
INSERT INTO pais VALUES ('Chile');
INSERT INTO pais VALUES ('Ecuador');
INSERT INTO pais VALUES ('Brasil');
INSERT INTO pais VALUES ('Panama');
INSERT INTO pais VALUES ('Costa Rica');
INSERT INTO pais VALUES ('Venezuela');
INSERT INTO pais VALUES ('Uruguay');
INSERT INTO pais VALUES ('Paraguay');
INSERT INTO pais VALUES ('Bolivia');
INSERT INTO pais VALUES ('España');
INSERT INTO pais VALUES ('Francia');
INSERT INTO pais VALUES ('Italia');
INSERT INTO pais VALUES ('Alemania');
INSERT INTO pais VALUES ('Portugal');
INSERT INTO pais VALUES ('Canada');
INSERT INTO pais VALUES ('Estados Unidos');
INSERT INTO pais VALUES ('Japon');
INSERT INTO pais VALUES ('China');
INSERT INTO pais VALUES ('Corea del Sur');
INSERT INTO pais VALUES ('Australia');
INSERT INTO pais VALUES ('India');


-- =========================================
-- INSERTS TABLA DEPARTAMENTO
-- =========================================

INSERT INTO departamento VALUES ('Valle del Cauca','Colombia');
INSERT INTO departamento VALUES ('Cundinamarca','Colombia');
INSERT INTO departamento VALUES ('Antioquia','Colombia');
INSERT INTO departamento VALUES ('Atlantico','Colombia');
INSERT INTO departamento VALUES ('Santander','Colombia');
INSERT INTO departamento VALUES ('Jalisco','Mexico');
INSERT INTO departamento VALUES ('CDMX','Mexico');
INSERT INTO departamento VALUES ('Buenos Aires','Argentina');
INSERT INTO departamento VALUES ('Lima','Peru');
INSERT INTO departamento VALUES ('Santiago','Chile');
INSERT INTO departamento VALUES ('Quito','Ecuador');
INSERT INTO departamento VALUES ('Sao Paulo','Brasil');
INSERT INTO departamento VALUES ('Panama Centro','Panama');
INSERT INTO departamento VALUES ('San Jose','Costa Rica');
INSERT INTO departamento VALUES ('Caracas','Venezuela');
INSERT INTO departamento VALUES ('Montevideo','Uruguay');
INSERT INTO departamento VALUES ('Asuncion','Paraguay');
INSERT INTO departamento VALUES ('La Paz','Bolivia');
INSERT INTO departamento VALUES ('Madrid','España');
INSERT INTO departamento VALUES ('Paris','Francia');
INSERT INTO departamento VALUES ('Roma','Italia');
INSERT INTO departamento VALUES ('Berlin','Alemania');
INSERT INTO departamento VALUES ('Lisboa','Portugal');
INSERT INTO departamento VALUES ('Ontario','Canada');
INSERT INTO departamento VALUES ('California','Estados Unidos');


-- =========================================
-- INSERTS TABLA CIUDAD
-- =========================================

INSERT INTO ciudad VALUES ('Tulua','Valle del Cauca');
INSERT INTO ciudad VALUES ('Cali','Valle del Cauca');
INSERT INTO ciudad VALUES ('Bogota','Cundinamarca');
INSERT INTO ciudad VALUES ('Medellin','Antioquia');
INSERT INTO ciudad VALUES ('Barranquilla','Atlantico');
INSERT INTO ciudad VALUES ('Bucaramanga','Santander');
INSERT INTO ciudad VALUES ('Guadalajara','Jalisco');
INSERT INTO ciudad VALUES ('Ciudad de Mexico','CDMX');
INSERT INTO ciudad VALUES ('Buenos Aires','Buenos Aires');
INSERT INTO ciudad VALUES ('Lima','Lima');
INSERT INTO ciudad VALUES ('Santiago de Chile','Santiago');
INSERT INTO ciudad VALUES ('Quito','Quito');
INSERT INTO ciudad VALUES ('Sao Paulo','Sao Paulo');
INSERT INTO ciudad VALUES ('Ciudad de Panama','Panama Centro');
INSERT INTO ciudad VALUES ('San Jose','San Jose');
INSERT INTO ciudad VALUES ('Caracas','Caracas');
INSERT INTO ciudad VALUES ('Montevideo','Montevideo');
INSERT INTO ciudad VALUES ('Asuncion','Asuncion');
INSERT INTO ciudad VALUES ('La Paz','La Paz');
INSERT INTO ciudad VALUES ('Madrid','Madrid');
INSERT INTO ciudad VALUES ('Paris','Paris');
INSERT INTO ciudad VALUES ('Roma','Roma');
INSERT INTO ciudad VALUES ('Berlin','Berlin');
INSERT INTO ciudad VALUES ('Lisboa','Lisboa');
INSERT INTO ciudad VALUES ('Los Angeles','California');


-- =========================================
-- INSERTS TABLA CLIENTE
-- =========================================

INSERT INTO cliente VALUES ('1001','CC','Juan','Perez','Cra 1','juan@gmail.com','3001','3101','Tulua');
INSERT INTO cliente VALUES ('1002','CC','Maria','Lopez','Cra 2','maria@gmail.com','3002','3102','Cali');
INSERT INTO cliente VALUES ('1003','CC','Carlos','Diaz','Cra 3','carlos@gmail.com','3003','3103','Bogota');
INSERT INTO cliente VALUES ('1004','CC','Ana','Gomez','Cra 4','ana@gmail.com','3004','3104','Medellin');
INSERT INTO cliente VALUES ('1005','CC','Luis','Torres','Cra 5','luis@gmail.com','3005','3105','Barranquilla');
INSERT INTO cliente VALUES ('1006','CC','Laura','Rios','Cra 6','laura@gmail.com','3006','3106','Bucaramanga');
INSERT INTO cliente VALUES ('1007','CC','Andres','Ruiz','Cra 7','andres@gmail.com','3007','3107','Guadalajara');
INSERT INTO cliente VALUES ('1008','CC','Sofia','Mora','Cra 8','sofia@gmail.com','3008','3108','Ciudad de Mexico');
INSERT INTO cliente VALUES ('1009','CC','Mateo','Castro','Cra 9','mateo@gmail.com','3009','3109','Buenos Aires');
INSERT INTO cliente VALUES ('1010','CC','Valentina','Garcia','Cra 10','valen@gmail.com','3010','3110','Lima');
INSERT INTO cliente VALUES ('1011','CC','Daniel','Martinez','Cra 11','daniel@gmail.com','3011','3111','Santiago de Chile');
INSERT INTO cliente VALUES ('1012','CC','Camila','Fernandez','Cra 12','camila@gmail.com','3012','3112','Quito');
INSERT INTO cliente VALUES ('1013','CC','Sebastian','Ortiz','Cra 13','sebas@gmail.com','3013','3113','Sao Paulo');
INSERT INTO cliente VALUES ('1014','CC','Juliana','Silva','Cra 14','juli@gmail.com','3014','3114','Ciudad de Panama');
INSERT INTO cliente VALUES ('1015','CC','David','Hernandez','Cra 15','david@gmail.com','3015','3115','San Jose');
INSERT INTO cliente VALUES ('1016','CC','Paula','Jimenez','Cra 16','paula@gmail.com','3016','3116','Caracas');
INSERT INTO cliente VALUES ('1017','CC','Felipe','Ramirez','Cra 17','felipe@gmail.com','3017','3117','Montevideo');
INSERT INTO cliente VALUES ('1018','CC','Natalia','Suarez','Cra 18','nata@gmail.com','3018','3118','Asuncion');
INSERT INTO cliente VALUES ('1019','CC','Cristian','Vargas','Cra 19','cris@gmail.com','3019','3119','La Paz');
INSERT INTO cliente VALUES ('1020','CC','Sara','Morales','Cra 20','sara@gmail.com','3020','3120','Madrid');
INSERT INTO cliente VALUES ('1021','CC','Kevin','Navarro','Cra 21','kevin@gmail.com','3021','3121','Paris');
INSERT INTO cliente VALUES ('1022','CC','Alejandra','Acosta','Cra 22','aleja@gmail.com','3022','3122','Roma');
INSERT INTO cliente VALUES ('1023','CC','Miguel','Pineda','Cra 23','miguel@gmail.com','3023','3123','Berlin');
INSERT INTO cliente VALUES ('1024','CC','Isabella','Reyes','Cra 24','isa@gmail.com','3024','3124','Lisboa');
INSERT INTO cliente VALUES ('1025','CC','Tomas','Quintero','Cra 25','tomas@gmail.com','3025','3125','Los Angeles');

-- =========================================
-- INSERTS TABLA VUELO
-- =========================================

INSERT INTO vuelo VALUES ('AV001','2026-06-01 08:00','2026-06-01 10:00',180,350000,'Programado','Bogota','Cali');
INSERT INTO vuelo VALUES ('AV002','2026-06-02 09:00','2026-06-02 11:00',150,400000,'Programado','Cali','Medellin');
INSERT INTO vuelo VALUES ('AV003','2026-06-03 06:00','2026-06-03 08:30',200,500000,'Programado','Bogota','Barranquilla');
INSERT INTO vuelo VALUES ('AV004','2026-06-04 07:00','2026-06-04 09:00',170,320000,'Programado','Tulua','Bogota');
INSERT INTO vuelo VALUES ('AV005','2026-06-05 12:00','2026-06-05 14:00',190,600000,'Programado','Medellin','Barranquilla');
INSERT INTO vuelo VALUES ('AV006','2026-06-06 13:00','2026-06-06 15:00',180,450000,'Programado','Cali','Bucaramanga');
INSERT INTO vuelo VALUES ('AV007','2026-06-07 15:00','2026-06-07 18:00',160,700000,'Programado','Bogota','Ciudad de Mexico');
INSERT INTO vuelo VALUES ('AV008','2026-06-08 16:00','2026-06-08 20:00',210,950000,'Programado','Bogota','Buenos Aires');
INSERT INTO vuelo VALUES ('AV009','2026-06-09 18:00','2026-06-09 22:00',220,1200000,'Programado','Bogota','Madrid');
INSERT INTO vuelo VALUES ('AV010','2026-06-10 05:00','2026-06-10 09:00',140,1100000,'Programado','Bogota','Paris');
INSERT INTO vuelo VALUES ('AV011','2026-06-11 06:00','2026-06-11 12:00',180,1500000,'Programado','Bogota','Roma');
INSERT INTO vuelo VALUES ('AV012','2026-06-12 07:00','2026-06-12 13:00',180,1700000,'Programado','Bogota','Berlin');
INSERT INTO vuelo VALUES ('AV013','2026-06-13 08:00','2026-06-13 14:00',180,1650000,'Programado','Bogota','Lisboa');
INSERT INTO vuelo VALUES ('AV014','2026-06-14 09:00','2026-06-14 15:00',180,1800000,'Programado','Bogota','Los Angeles');
INSERT INTO vuelo VALUES ('AV015','2026-06-15 10:00','2026-06-15 16:00',180,1750000,'Programado','Bogota','Lima');
INSERT INTO vuelo VALUES ('AV016','2026-06-16 11:00','2026-06-16 17:00',180,980000,'Programado','Bogota','Quito');
INSERT INTO vuelo VALUES ('AV017','2026-06-17 12:00','2026-06-17 18:00',180,850000,'Programado','Bogota','Santiago de Chile');
INSERT INTO vuelo VALUES ('AV018','2026-06-18 13:00','2026-06-18 19:00',180,890000,'Programado','Bogota','Caracas');
INSERT INTO vuelo VALUES ('AV019','2026-06-19 14:00','2026-06-19 20:00',180,910000,'Programado','Bogota','Montevideo');
INSERT INTO vuelo VALUES ('AV020','2026-06-20 15:00','2026-06-20 21:00',180,920000,'Programado','Bogota','Asuncion');
INSERT INTO vuelo VALUES ('AV021','2026-06-21 16:00','2026-06-21 22:00',180,940000,'Programado','Bogota','La Paz');
INSERT INTO vuelo VALUES ('AV022','2026-06-22 17:00','2026-06-22 23:00',180,870000,'Programado','Bogota','Ciudad de Panama');
INSERT INTO vuelo VALUES ('AV023','2026-06-23 18:00','2026-06-24 00:00',180,760000,'Programado','Bogota','San Jose');
INSERT INTO vuelo VALUES ('AV024','2026-06-24 19:00','2026-06-25 01:00',180,990000,'Programado','Bogota','Sao Paulo');
INSERT INTO vuelo VALUES ('AV025','2026-06-25 20:00','2026-06-26 02:00',180,1350000,'Programado','Bogota','Guadalajara');


-- =========================================
-- INSERTS TABLA RESERVA
-- =========================================

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-01 10:00',350000,'AV001','1001',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-02 11:00',400000,'AV002','1002',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-03 12:00',500000,'AV003','1003',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-04 13:00',320000,'AV004','1004',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-05 14:00',600000,'AV005','1005',3);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-06 15:00',450000,'AV006','1006',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-07 16:00',700000,'AV007','1007',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-08 17:00',950000,'AV008','1008',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-09 18:00',1200000,'AV009','1009',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-10 19:00',1100000,'AV010','1010',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-11 20:00',1500000,'AV011','1011',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-12 21:00',1700000,'AV012','1012',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-13 22:00',1650000,'AV013','1013',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-14 23:00',1800000,'AV014','1014',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-15 09:00',1750000,'AV015','1015',3);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-16 10:00',980000,'AV016','1016',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-17 11:00',850000,'AV017','1017',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-18 12:00',890000,'AV018','1018',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-19 13:00',910000,'AV019','1019',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-20 14:00',920000,'AV020','1020',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-21 15:00',940000,'AV021','1021',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-22 16:00',870000,'AV022','1022',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-23 17:00',760000,'AV023','1023',2);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-24 18:00',990000,'AV024','1024',1);

INSERT INTO reserva (fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES ('2026-05-25 19:00',1350000,'AV025','1025',2);



-- =========================================
-- INSERTS TABLA HISTORIAL_ESTADO_RESERVA
-- =========================================

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (1,1,'2026-05-01 10:05');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (2,2,'2026-05-02 11:10');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (3,1,'2026-05-03 12:15');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (4,2,'2026-05-04 13:20');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (5,3,'2026-05-05 14:25');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (6,1,'2026-05-06 15:30');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (7,2,'2026-05-07 16:35');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (8,1,'2026-05-08 17:40');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (9,2,'2026-05-09 18:45');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (10,1,'2026-05-10 19:50');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (11,2,'2026-05-11 20:55');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (12,1,'2026-05-12 21:00');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (13,2,'2026-05-13 22:05');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (14,1,'2026-05-14 23:10');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (15,3,'2026-05-15 09:15');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (16,1,'2026-05-16 10:20');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (17,2,'2026-05-17 11:25');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (18,1,'2026-05-18 12:30');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (19,2,'2026-05-19 13:35');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (20,1,'2026-05-20 14:40');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (21,2,'2026-05-21 15:45');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (22,1,'2026-05-22 16:50');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (23,2,'2026-05-23 17:55');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (24,1,'2026-05-24 18:00');

INSERT INTO historial_estado_reserva (id_reserva,id_estado,fecha_hora_cambio)
VALUES (25,2,'2026-05-25 19:05');

-- =========================================
-- INSERTS TABLA TIQUETE
-- =========================================

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('1A','Ejecutiva',450000,1);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('2B','Economica',400000,2);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('3C','Primera Clase',650000,3);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('4D','Economica',320000,4);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('5E','Ejecutiva',700000,5);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('6F','Economica',450000,6);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('7A','Ejecutiva',850000,7);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('8B','Primera Clase',1200000,8);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('9C','Primera Clase',1400000,9);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('10D','Ejecutiva',1250000,10);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('11E','Primera Clase',1700000,11);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('12F','Primera Clase',1800000,12);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('13A','Ejecutiva',1650000,13);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('14B','Primera Clase',2000000,14);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('15C','Ejecutiva',1850000,15);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('16D','Economica',980000,16);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('17E','Economica',850000,17);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('18F','Ejecutiva',990000,18);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('19A','Ejecutiva',1010000,19);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('20B','Economica',920000,20);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('21C','Economica',940000,21);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('22D','Ejecutiva',980000,22);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('23E','Economica',760000,23);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('24F','Ejecutiva',1100000,24);

INSERT INTO tiquete (numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES ('25A','Primera Clase',1500000,25);



-- =========================================
-- INSERTS TABLA PAQUETE_TURISTICO
-- =========================================

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Tour Cartagena','Tour por playas y centro historico','Cartagena',500000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Hotel Cali','Hospedaje 3 noches','Cali',350000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Tour Bogota','Recorrido turistico','Bogota',300000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Paquete Medellin','Hotel y transporte','Medellin',600000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Tour Barranquilla','Carnaval y playas','Barranquilla',450000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Hotel Bucaramanga','Hospedaje premium','Bucaramanga',400000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Mexico VIP','Hotel y city tour','Ciudad de Mexico',1200000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Buenos Aires Full','Hotel + guia','Buenos Aires',1400000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Madrid Europa','Tour completo','Madrid',1800000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Paris Dreams','Paquete romantico','Paris',2200000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Roma Clasica','Tour historico','Roma',2100000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Berlin Experience','Hotel + transporte','Berlin',2000000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Lisboa Travel','Tour urbano','Lisboa',1700000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('LA Premium','Hollywood y playas','Los Angeles',2500000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Lima Gastronomica','Tour comida peruana','Lima',900000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Quito Andino','Tour cultural','Quito',850000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Chile Nieve','Tour montaña','Santiago de Chile',1300000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Caracas City','Recorrido urbano','Caracas',950000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Montevideo Relax','Hotel y playa','Montevideo',1100000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Asuncion Plus','Paquete turistico','Asuncion',1000000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('La Paz Adventure','Tour extremo','La Paz',1250000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Panama Canal','Tour canal','Ciudad de Panama',1350000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Costa Rica Nature','Tour naturaleza','San Jose',1450000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Brasil Carnaval','Experiencia carnaval','Sao Paulo',1900000,'Disponible');

INSERT INTO paquete_turistico (nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES ('Guadalajara Cultura','Tour cultural','Guadalajara',1600000,'Disponible');

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
INSERT INTO reserva_paquete VALUES (11,11);
INSERT INTO reserva_paquete VALUES (12,12);
INSERT INTO reserva_paquete VALUES (13,13);
INSERT INTO reserva_paquete VALUES (14,14);
INSERT INTO reserva_paquete VALUES (15,15);
INSERT INTO reserva_paquete VALUES (16,16);
INSERT INTO reserva_paquete VALUES (17,17);
INSERT INTO reserva_paquete VALUES (18,18);
INSERT INTO reserva_paquete VALUES (19,19);
INSERT INTO reserva_paquete VALUES (20,20);
INSERT INTO reserva_paquete VALUES (21,21);
INSERT INTO reserva_paquete VALUES (22,22);
INSERT INTO reserva_paquete VALUES (23,23);
INSERT INTO reserva_paquete VALUES (24,24);
INSERT INTO reserva_paquete VALUES (25,25);



-- =========================================
-- INSERTS TABLA USUARIO
-- =========================================

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('admin1','admin123','Administrador',NULL);

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('agente1','agente123','Agente',NULL);

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('juanp','123','Cliente','1001');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('marial','123','Cliente','1002');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('carlosd','123','Cliente','1003');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('anag','123','Cliente','1004');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('luist','123','Cliente','1005');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('laurar','123','Cliente','1006');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('andresr','123','Cliente','1007');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('sofiam','123','Cliente','1008');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('mateoc','123','Cliente','1009');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('valentinag','123','Cliente','1010');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('danielm','123','Cliente','1011');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('camilaf','123','Cliente','1012');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('sebastiano','123','Cliente','1013');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('julianas','123','Cliente','1014');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('davidh','123','Cliente','1015');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('paulaj','123','Cliente','1016');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('feliper','123','Cliente','1017');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('natalias','123','Cliente','1018');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('cristianv','123','Cliente','1019');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('saram','123','Cliente','1020');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('kevinn','123','Cliente','1021');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('alejandraa','123','Cliente','1022');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('miguelp','123','Cliente','1023');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('isabellar','123','Cliente','1024');

INSERT INTO usuario (nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES ('tomasq','123','Cliente','1025');