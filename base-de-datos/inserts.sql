-- =========================================
-- INSERTS TABLA PAIS.
-- =========================================

INSERT INTO pais (nombre_pais) VALUES ('Colombia');
INSERT INTO pais (nombre_pais) VALUES ('Mexico');
INSERT INTO pais (nombre_pais) VALUES ('Argentina');
INSERT INTO pais (nombre_pais) VALUES ('España');
INSERT INTO pais (nombre_pais) VALUES ('Francia');
INSERT INTO pais (nombre_pais) VALUES ('Italia');
INSERT INTO pais (nombre_pais) VALUES ('Alemania');
INSERT INTO pais (nombre_pais) VALUES ('Portugal');
INSERT INTO pais (nombre_pais) VALUES ('Estados Unidos');
INSERT INTO pais (nombre_pais) VALUES ('Peru');
INSERT INTO pais (nombre_pais) VALUES ('Brasil');
INSERT INTO pais (nombre_pais) VALUES ('Chile');
INSERT INTO pais (nombre_pais) VALUES ('Venezuela');
INSERT INTO pais (nombre_pais) VALUES ('Ecuador');
INSERT INTO pais (nombre_pais) VALUES ('Panamá');
INSERT INTO pais (nombre_pais) VALUES ('Costa Rica');
INSERT INTO pais (nombre_pais) VALUES ('Guatemala');
INSERT INTO pais (nombre_pais) VALUES ('Honduras');
INSERT INTO pais (nombre_pais) VALUES ('Nicaragua');
INSERT INTO pais (nombre_pais) VALUES ('El Salvador');
INSERT INTO pais (nombre_pais) VALUES ('República Dominicana');
INSERT INTO pais (nombre_pais) VALUES ('Cuba');
INSERT INTO pais (nombre_pais) VALUES ('Jamaica');
INSERT INTO pais (nombre_pais) VALUES ('Trinidad y Tobago');
INSERT INTO pais (nombre_pais) VALUES ('Surinám');
INSERT INTO pais (nombre_pais) VALUES ('Guyana');



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
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Rio de Janeiro',11);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Sao Paulo',11);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Santiago',12);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Valparaiso',12);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Caracas',13);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Quito',14);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Guayaquil',14);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Panama',15);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('San Jose',16);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Guatemala City',17);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Tegucigalpa',18);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Managua',19);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('San Salvador',20);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('Santo Domingo',21);
INSERT INTO departamento (nombre_departamento,id_pais) VALUES ('La Habana',22);



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
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Rio de Janeiro',11);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Sao Paulo',12);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Santiago',13);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Valparaiso',14);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Caracas',15);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Quito',16);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Guayaquil',17);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Panama',18);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('San Jose',19);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Guatemala City',20);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Tegucigalpa',21);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Managua',22);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('San Salvador',23);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('Santo Domingo',24);
INSERT INTO ciudad (nombre_ciudad,id_departamento) VALUES ('La Habana',25);



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

INSERT INTO cliente VALUES
('1011','CC','Roberto','Sanchez','Calle 11','roberto@gmail.com','3001111122','3111111122',11);

INSERT INTO cliente VALUES
('1012','CC','Isabella','Flores','Calle 12','isabella@gmail.com','3001111133','3111111133',12);

INSERT INTO cliente VALUES
('1013','CC','Fernando','Ruiz','Calle 13','fernando@gmail.com','3001111144','3111111144',13);

INSERT INTO cliente VALUES
('1014','Pasaporte','Gabriela','Ortiz','Calle 14','gabriela@gmail.com','3001111155','3111111155',14);

INSERT INTO cliente VALUES
('1015','Pasaporte','Diego','Vargas','Calle 15','diego@gmail.com','3001111166','3111111166',15);

INSERT INTO cliente VALUES
('1016','CC','Marcela','Herrera','Calle 16','marcela@gmail.com','3001111177','3111111177',16);

INSERT INTO cliente VALUES
('1017','CC','Antonio','Morales','Calle 17','antonio@gmail.com','3001111188','3111111188',17);

INSERT INTO cliente VALUES
('1018','Pasaporte','Daniela','Rivas','Calle 18','daniela@gmail.com','3001111199','3111111199',18);

INSERT INTO cliente VALUES
('1019','CC','Oscar','Silva','Calle 19','oscar@gmail.com','3001111200','3111111200',19);

INSERT INTO cliente VALUES
('1020','CC','Patricia','Medina','Calle 20','patricia@gmail.com','3001111211','3111111211',20);

INSERT INTO cliente VALUES
('1021','Pasaporte','Ricardo','Gutierrez','Calle 21','ricardo@gmail.com','3001111222','3111111222',21);

INSERT INTO cliente VALUES
('1022','CC','Catalina','Navarro','Calle 22','catalina@gmail.com','3001111233','3111111233',22);

INSERT INTO cliente VALUES
('1023','CC','Sergio','Salazar','Calle 23','sergio@gmail.com','3001111244','3111111244',23);

INSERT INTO cliente VALUES
('1024','Pasaporte','Veronica','Campos','Calle 24','veronica@gmail.com','3001111255','3111111255',24);

INSERT INTO cliente VALUES
('1025','CC','Miguel','Reyes','Calle 25','miguel@gmail.com','3001111266','3111111266',25);



-- =========================================
-- INSERTS TABLA ROL
-- =========================================

INSERT INTO rol VALUES ('Administrador');
INSERT INTO rol VALUES ('Agente');
INSERT INTO rol VALUES ('Cliente');
INSERT INTO rol VALUES ('Supervisor');
INSERT INTO rol VALUES ('Gerente');
INSERT INTO rol VALUES ('Especialista');
INSERT INTO rol VALUES ('Asistente');
INSERT INTO rol VALUES ('Coordinador');
INSERT INTO rol VALUES ('Analista');
INSERT INTO rol VALUES ('Operario');
INSERT INTO rol VALUES ('Auxiliar');
INSERT INTO rol VALUES ('Tecnico');
INSERT INTO rol VALUES ('Inspector');
INSERT INTO rol VALUES ('Auditor');
INSERT INTO rol VALUES ('Encargado');
INSERT INTO rol VALUES ('Director');
INSERT INTO rol VALUES ('Jefe');
INSERT INTO rol VALUES ('Representante');
INSERT INTO rol VALUES ('Consultor');
INSERT INTO rol VALUES ('Asesor');
INSERT INTO rol VALUES ('Ejecutivo');
INSERT INTO rol VALUES ('Oficial');
INSERT INTO rol VALUES ('Promotor');
INSERT INTO rol VALUES ('Facilitador');
INSERT INTO rol VALUES ('Gestor');
INSERT INTO rol VALUES ('Productor');



-- =========================================
-- INSERTS TABLA ESTADO_RESERVA
-- =========================================

INSERT INTO estado_reserva (nombre_estado) VALUES ('Reservada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Confirmada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Cancelada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Expirada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('En proceso');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Completada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('En espera');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Pagada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('No pagada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Pendiente');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Reembolsada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Modificada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Rechazada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Suspendida');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Activa');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Inactiva');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Anulada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Vencida');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Cancelada por cliente');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Cancelada por sistema');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Retenida');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Congelada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Reabierta');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Pre-reservada');
INSERT INTO estado_reserva (nombre_estado) VALUES ('Pendiente de confirmar');

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

INSERT INTO vuelo VALUES
('AV011','2026-06-11 08:00','2026-06-11 09:30',180,360000,'Programado',1,3);

INSERT INTO vuelo VALUES
('AV012','2026-06-12 09:00','2026-06-12 10:45',200,400000,'Programado',2,4);

INSERT INTO vuelo VALUES
('AV013','2026-06-13 10:00','2026-06-13 11:30',160,380000,'Programado',3,5);

INSERT INTO vuelo VALUES
('AV014','2026-06-14 11:00','2026-06-14 12:20',190,420000,'Programado',4,1);

INSERT INTO vuelo VALUES
('AV015','2026-06-15 12:00','2026-06-15 14:00',220,1100000,'Programado',1,6);

INSERT INTO vuelo VALUES
('AV016','2026-06-16 13:00','2026-06-16 19:00',210,1400000,'Programado',2,7);

INSERT INTO vuelo VALUES
('AV017','2026-06-17 14:00','2026-06-17 22:00',250,2600000,'Programado',3,8);

INSERT INTO vuelo VALUES
('AV018','2026-06-18 15:00','2026-06-19 00:30',260,2900000,'Programado',4,9);

INSERT INTO vuelo VALUES
('AV019','2026-06-19 16:00','2026-06-20 02:00',230,1700000,'Programado',5,10);

INSERT INTO vuelo VALUES
('AV020','2026-06-20 08:15','2026-06-20 10:00',175,350000,'Programado',1,2);

INSERT INTO vuelo VALUES
('AV021','2026-06-21 09:30','2026-06-21 11:15',185,390000,'Programado',2,3);

INSERT INTO vuelo VALUES
('AV022','2026-06-22 10:45','2026-06-22 12:30',195,410000,'Programado',3,4);

INSERT INTO vuelo VALUES
('AV023','2026-06-23 11:30','2026-06-23 13:00',170,370000,'Programado',4,5);

INSERT INTO vuelo VALUES
('AV024','2026-06-24 12:30','2026-06-24 14:15',205,430000,'Programado',5,1);

INSERT INTO vuelo VALUES
('AV025','2026-06-25 13:45','2026-06-25 18:00',240,1250000,'Programado',1,7);



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

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-11 09:30',700000,'AV001','1001',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-12 10:45',820000,'AV002','1001',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-12 14:00',420000,'AV002','1002',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-13 08:30',350000,'AV011','1003',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-14 09:00',800000,'AV012','1004',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-15 10:15',760000,'AV013','1005',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-16 11:30',840000,'AV014','1006',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-17 12:45',2200000,'AV015','1007',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-18 13:20',2800000,'AV016','1008',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-19 14:00',5200000,'AV017','1009',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-20 15:15',5800000,'AV018','1010',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-21 16:30',3400000,'AV019','1011',1);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-22 08:00',700000,'AV020','1012',2);

INSERT INTO reserva
(fecha_hora_reserva,valor_total,cod_vuelo,numero_identificacion_cliente,id_estado)
VALUES
('2026-05-23 09:30',780000,'AV021','1013',1);

-- =========================================
-- INSERTS TABLA HISTORIAL_ESTADO_RESERVA
-- =========================================

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (1,1,'2026-05-01 10:05','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (2,2,'2026-05-02 11:05','Agente1','Pago confirmado');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (3,1,'2026-05-03 12:05','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (4,2,'2026-05-04 13:05','Agente1','Cambio de asiento aprobado');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (6,1,'2026-05-06 15:05','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (7,2,'2026-05-07 16:05','Agente1','Reserva confirmada');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (8,1,'2026-05-08 17:05','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (9,2,'2026-05-09 18:05','Agente1','Confirmación de vuelo');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (10,1,'2026-05-10 19:05','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (11,1,'2026-05-11 09:30','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (11,2,'2026-05-11 11:00','Agente1','Pago recibido y reserva confirmada');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (12,1,'2026-05-12 10:45','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (13,1,'2026-05-12 14:00','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (13,2,'2026-05-12 15:20','Agente1','Reserva confirmada con asiento disponible');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (5,1,'2026-05-05 13:30','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (5,3,'2026-05-05 14:05','Agente1','Cliente canceló por emergencia familiar');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (14,1,'2026-05-13 08:35','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (15,1,'2026-05-14 09:05','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (15,2,'2026-05-14 10:30','Agente1','Pago confirmado');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (16,1,'2026-05-15 10:20','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (17,1,'2026-05-16 11:35','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (17,2,'2026-05-16 13:00','Agente1','Reserva confirmada');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (18,1,'2026-05-17 12:50','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (19,1,'2026-05-18 13:25','Sistema','Reserva inicial');

INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio, responsable, observacion)
VALUES (19,2,'2026-05-18 14:45','Agente1','Pago confirmado');

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

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('11A','Economica',700000,11);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('12B','Ejecutiva',820000,12);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('13C','Ejecutiva',420000,13);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('14A','Economica',350000,14);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('15B','Ejecutiva',800000,15);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('16C','Economica',760000,16);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('17D','Ejecutiva',840000,17);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('18E','Primera Clase',2200000,18);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('19F','Primera Clase',2800000,19);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('20A','Primera Clase',5200000,20);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('21B','Primera Clase',5800000,21);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('22C','Ejecutiva',3400000,22);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('23D','Economica',700000,23);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('24E','Ejecutiva',780000,24);

INSERT INTO tiquete
(numero_asiento,clase_tiquete,precio_final,id_reserva)
VALUES
('25F','Economica',820000,25);

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

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Tour lago calima','paseo por centro recreativo Comfandi','Lago calima',100000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Playa Blanca','Resort todo incluido','Playa Blanca',750000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Excursión a Santa Marta','Tour a la ciudad perdida','Santa Marta',550000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Tayrona National Park','Caminata y playas','Tayrona',650000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Coffee Tour Armenia','Visita a cafétales','Armenia',400000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Cancun Beach','Playas de Quintana Roo','Cancún',950000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Riviera Maya Luxury','Resort de lujo','Riviera Maya',2000000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Machu Picchu Tour','Tour a la maravilla del mundo','Cusco',1600000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Iguazu Falls Adventure','Cataratas del Iguazú','Misiones',1200000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Barcelona City Tour','Arquitectura y cultura','Barcelona',1300000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Louvre Museum Paris','Arte y cultura','París',1100000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Vegas Experience','Entretenimiento y casinos','Las Vegas',1500000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('New York City Break','Ciudad de rascacielos','Nueva York',1700000,'Disponible');

INSERT INTO paquete_turistico
(nombre_paquete,descripcion,sector_destino,precio,estado)
VALUES
('Tokyo Adventure','Modernidad y tradición','Tokio',2500000,'No Disponible');

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

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('robertos','123','Cliente','1011');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('isabellaf','123','Cliente','1012');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('fernandor','123','Cliente','1013');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('gabrielao','123','Cliente','1014');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('diegov','123','Cliente','1015');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('marcelah','123','Cliente','1016');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('antoniom','123','Cliente','1017');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('danielar','123','Cliente','1018');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('oscars','123','Cliente','1019');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('patriciap','123','Cliente','1020');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('ricardог','123','Cliente','1021');

INSERT INTO usuario
(nombre_usuario,contrasena,nombre_rol,numero_identificacion_cliente)
VALUES
('catalinан','123','Cliente','1022');


-- =========================================
-- INSERTS TABLA SOLICITUD_CLIENTE
-- =========================================

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1001', 1, 'Cambio de fecha', 'Solicita cambiar la fecha del vuelo al 2 de junio', 'Abierta', 'Alta', NULL, NULL, '2026-05-01 10:10', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1002', 2, 'Cancelación', 'Solicita cancelar la reserva por imprevisto', 'Resuelta', 'Alta', 'Cancelación aprobada por agente', 2, '2026-05-02 11:20', '2026-05-02 11:45');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1003', 3, 'Cambio de asiento', 'Solicita asiento con más espacio para las piernas', 'Abierta', 'Normal', NULL, NULL, '2026-05-03 12:10', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1004', 4, 'Cambio de fecha', 'Solicita cambiar para otro día', 'Resuelta', 'Normal', 'Cambio aprobado', 2, '2026-05-04 13:30', '2026-05-04 14:15');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1005', 5, 'Reembolso', 'Solicita reembolso de la reserva', 'Resuelta', 'Alta', 'Reembolso procesado', 2, '2026-05-05 14:45', '2026-05-05 15:30');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1006', 6, 'Información adicional', 'Solicita detalles del servicio', 'Abierta', 'Baja', NULL, NULL, '2026-05-06 15:20', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1007', 7, 'Modificación de datos', 'Cambiar datos personales en la reserva', 'Resuelta', 'Normal', 'Datos actualizados', 2, '2026-05-07 16:10', '2026-05-07 16:45');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1008', 8, 'Cancelación', 'Cancela la reserva', 'Resuelta', 'Alta', 'Cancelada con reembolso', 2, '2026-05-08 17:00', '2026-05-08 17:30');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1009', 9, 'Cambio de asiento', 'Solicita cambio a primera clase', 'Abierta', 'Alta', NULL, NULL, '2026-05-09 18:15', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1010', 10, 'Información de equipaje', 'Pregunta sobre límite de equipaje', 'Resuelta', 'Baja', 'Se envió información', 2, '2026-05-10 19:20', '2026-05-10 19:45');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1011', 11, 'Confirmación de vuelo', 'Confirma asistencia al vuelo', 'Resuelta', 'Normal', 'Confirmado', 2, '2026-05-11 10:00', '2026-05-11 10:15');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1012', 12, 'Cambio de hotel', 'Cambiar hotel en el paquete', 'Abierta', 'Normal', NULL, NULL, '2026-05-12 11:00', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1013', 13, 'Cancelación', 'Solicita cancelar por razones personales', 'Resuelta', 'Normal', 'Cancelada sin penalidad', 2, '2026-05-13 12:30', '2026-05-13 13:00');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1001', 14, 'Información de recogida', 'Pregunta sobre recogida en aeropuerto', 'Abierta', 'Normal', NULL, NULL, '2026-05-14 08:45', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1002', 15, 'Cambio de fecha', 'Cambiar fecha del vuelo', 'Resuelta', 'Alta', 'Cambio realizado', 2, '2026-05-15 09:30', '2026-05-15 10:00');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1003', 16, 'Asistencia especial', 'Solicita asistencia para pasajero con movilidad reducida', 'Resuelta', 'Alta', 'Aprobada', 2, '2026-05-16 10:20', '2026-05-16 11:00');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1004', 17, 'Cambio de asiento', 'Cambiar asiento a ventanilla', 'Abierta', 'Baja', NULL, NULL, '2026-05-17 11:15', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1005', 18, 'Cancelación', 'Cancelar reserva', 'Resuelta', 'Alta', 'Cancelada con reembolso completo', 2, '2026-05-18 12:00', '2026-05-18 12:45');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1006', 19, 'Información de visado', 'Información para requisitos de visado', 'Resuelta', 'Normal', 'Se envió guía de visado', 2, '2026-05-19 13:30', '2026-05-19 14:00');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1007', 20, 'Cambio de clase', 'Cambiar a clase ejecutiva', 'Abierta', 'Alta', NULL, NULL, '2026-05-20 14:15', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1008', 21, 'Reembolso de tarifa', 'Solicita reembolso de diferencia tarifaria', 'Resuelta', 'Normal', 'Reembolso procesado', 2, '2026-05-21 15:00', '2026-05-21 15:45');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1009', 22, 'Cancelación de paquete', 'Cancelar paquete turístico', 'Resuelta', 'Normal', 'Cancelado', 2, '2026-05-22 08:30', '2026-05-22 09:15');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1010', 23, 'Información de transporte', 'Consulta sobre transporte terrestre', 'Abierta', 'Baja', NULL, NULL, '2026-05-23 09:45', NULL);

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1011', 24, 'Cambio de acompañante', 'Cambiar pasajero acompañante', 'Resuelta', 'Normal', 'Cambio realizado', 2, '2026-05-24 10:30', '2026-05-24 11:00');

INSERT INTO solicitud_cliente (numero_identificacion_cliente, id_reserva, tipo_solicitud, descripcion, estado, prioridad, respuesta_agente, id_agente, fecha_creacion, fecha_respuesta)
VALUES
('1012', 25, 'Cancelación total', 'Cancelar toda la reserva y paquete', 'Abierta', 'Alta', NULL, NULL, '2026-05-25 11:20', NULL);
