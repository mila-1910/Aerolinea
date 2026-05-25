const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Ruta de verificación rápida para comprobar que el servidor está arriba
app.get('/api/ping', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString(), pid: process.pid });
});

// Configuración de la conexión a la base de datos (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Escudo anti-caídas por inactividad de Neon
pool.on('error', (err) => {
    console.error('Neon cortó una conexión inactiva (es normal):', err.message);
});

pool.query('SELECT NOW()')
    .then(() => console.log('✅ Conexión inicial con Neon exitosa 🐘'))
    .catch(err => console.error('❌ Error al hablar con Neon:', err.message));

// Helpers para simular datos enriquecidos de vuelos
function getImagenUrl(destino) {
    if (!destino) return '../../imagenes/nueva-york-hero.jpg';
    const d = destino.toLowerCase();
    if (d.includes('buenos aires')) return '../../imagenes/buenos-aires.jpg';
    if (d.includes('cancun') || d.includes('cancún')) return '../../imagenes/cancun.jpg';
    if (d.includes('mexico') || d.includes('méxico')) return '../../imagenes/ciudad-mexico.jpg';
    if (d.includes('madrid')) return '../../imagenes/madrid.jpg';
    if (d.includes('york')) return '../../imagenes/nueva-york.jpg';
    if (d.includes('paris') || d.includes('parís')) return '../../imagenes/paris.jpg';
    return '../../imagenes/nueva-york-hero.jpg';
}

function getDescripcion(destino) {
    return `Disfruta de un increíble viaje a ${destino || 'tu destino preferido'}, un lugar lleno de experiencias inolvidables, cultura y hermosos paisajes.`;
}

function mapFlightRow(row) {
    const duracion_minutos = row.duracion_minutos ? Math.round(row.duracion_minutos) : 120;
    const horas = Math.floor(duracion_minutos / 60);
    const mins = duracion_minutos % 60;
    const duracion = mins === 0 ? `${horas}h` : `${horas}h ${mins}min`;

    return {
        id_vuelo: row.cod_vuelo,
        cod_vuelo: row.cod_vuelo,
        numero_vuelo: row.cod_vuelo,
        origen: row.ciudad_origen,
        destino: row.ciudad_destino,
        ciudad_destino: row.ciudad_destino,
        fecha_salida: row.fecha_hora_salida,
        fecha_llegada: row.fecha_hora_llegada,
        precio_base: row.precio_base,
        estado_vuelo: row.estado_vuelo,
        escala: 'Directo',
        duracion_minutos: duracion_minutos,
        duracion: duracion,
        clase: 'Económica',
        tipo_avion: 'Boeing 737',
        imagen_url: getImagenUrl(row.ciudad_destino),
        descripcion: getDescripcion(row.ciudad_destino)
    };
}

// ============================================================
// RUTAS DE UBICACIONES
// ============================================================

// Listar países
app.get('/api/paises', async (req, res) => {
    try {
        const result = await pool.query('SELECT nombre_pais AS nombre FROM pais ORDER BY nombre_pais ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener países:', error);
        res.status(500).json({ error: 'Error al obtener los países' });
    }
});

// Listar departamentos de un país
app.get('/api/departamentos/:nombre_pais', async (req, res) => {
    const { nombre_pais } = req.params;
    try {
        const result = await pool.query(
            'SELECT nombre_departamento AS nombre FROM departamento WHERE nombre_pais = $1 ORDER BY nombre_departamento ASC',
            [nombre_pais]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
});

// Listar ciudades de un departamento
app.get('/api/ciudades/:nombre_departamento', async (req, res) => {
    const { nombre_departamento } = req.params;
    try {
        const result = await pool.query(
            'SELECT nombre_ciudad AS nombre FROM ciudad WHERE nombre_departamento = $1 ORDER BY nombre_ciudad ASC',
            [nombre_departamento]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener ciudades:', error);
        res.status(500).json({ error: 'Error al obtener las ciudades' });
    }
});

// ============================================================
// RUTAS DE VUELOS
// ============================================================

// Listar vuelos disponibles (Programados)
app.get('/api/vuelos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                cod_vuelo,
                fecha_hora_salida,
                fecha_hora_llegada,
                capacidad_pasajeros,
                precio_base,
                estado_vuelo,
                ciudad_origen,
                ciudad_destino,
                EXTRACT(EPOCH FROM (fecha_hora_llegada - fecha_hora_salida))/60 AS duracion_minutos
            FROM vuelo
            WHERE estado_vuelo = 'Programado'
            ORDER BY fecha_hora_salida ASC
        `);
        res.json(result.rows.map(mapFlightRow));
    } catch (error) {
        console.error('Error al obtener vuelos:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos' });
    }
});

// Detalle de un vuelo por id
app.get('/api/vuelos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT
                cod_vuelo,
                fecha_hora_salida,
                fecha_hora_llegada,
                capacidad_pasajeros,
                precio_base,
                estado_vuelo,
                ciudad_origen,
                ciudad_destino,
                EXTRACT(EPOCH FROM (fecha_hora_llegada - fecha_hora_salida))/60 AS duracion_minutos
            FROM vuelo
            WHERE cod_vuelo = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vuelo no encontrado' });
        }
        res.json(mapFlightRow(result.rows[0]));
    } catch (error) {
        console.error('Error al obtener vuelo:', error);
        res.status(500).json({ error: 'Error al obtener el vuelo' });
    }
});

// ============================================================
// RUTAS DE RESERVAS
// ============================================================

// Crear una reserva (estado inicial: "Reservada" = id_estado 1)
app.post('/api/reservas', async (req, res) => {
    const { id_cliente, numero_identificacion_cliente, id_vuelo, cod_vuelo, valor_total, total, estado } = req.body;

    const clienteId = id_cliente || numero_identificacion_cliente;
    const vueloCod = id_vuelo || cod_vuelo;
    const valor = valor_total || total;

    if (!clienteId || !vueloCod || !valor) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: cliente, vuelo, valor' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Obtener id del estado (si se envió por el frontend)
        const estadoFrontend = (estado === 'Pendiente') ? 'Reservada' : (estado || 'Reservada');

        const estadoRes = await client.query(
            `SELECT id_estado FROM estado_reserva WHERE nombre_estado = $1 LIMIT 1`,
            [estadoFrontend]
        );
        if (estadoRes.rows.length === 0) {
            throw new Error(`Estado "${estadoFrontend}" no encontrado en la base de datos`);
        }
        const id_estado = estadoRes.rows[0].id_estado;

        // Insertar la reserva
        const result = await client.query(
            `INSERT INTO reserva (fecha_hora_reserva, valor_total, cod_vuelo, numero_identificacion_cliente, id_estado)
             VALUES (NOW(), $1, $2, $3, $4)
             RETURNING *`,
            [valor, vueloCod, clienteId, id_estado]
        );

        const nuevaReserva = result.rows[0];

        // Registrar en historial
        await client.query(
            `INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio)
             VALUES ($1, $2, NOW())`,
            [nuevaReserva.id_reserva, id_estado]
        );

        await client.query('COMMIT');

        res.status(201).json({
            mensaje: 'Reserva creada correctamente',
            reserva: nuevaReserva
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    } finally {
        client.release();
    }
});

// Listar reservas de un cliente
app.get('/api/reservas/cliente/:id_cliente', async (req, res) => {
    const { id_cliente } = req.params;
    try {
        const result = await pool.query(`
            SELECT
                r.id_reserva,
                r.fecha_hora_reserva,
                r.valor_total,
                er.nombre_estado          AS estado,
                v.cod_vuelo,
                v.ciudad_origen,
                v.ciudad_destino,
                v.fecha_hora_salida,
                v.fecha_hora_llegada,
                v.precio_base,
                EXTRACT(EPOCH FROM (v.fecha_hora_llegada - v.fecha_hora_salida))/60 AS duracion_minutos
            FROM reserva r
            JOIN estado_reserva er ON er.id_estado = r.id_estado
            JOIN vuelo v           ON v.cod_vuelo   = r.cod_vuelo
            WHERE r.numero_identificacion_cliente = $1
            ORDER BY r.fecha_hora_reserva DESC
        `, [id_cliente]);

        const mappedReservas = result.rows.map(row => {
            const flightMapped = mapFlightRow({
                cod_vuelo: row.cod_vuelo,
                ciudad_origen: row.ciudad_origen,
                ciudad_destino: row.ciudad_destino,
                fecha_hora_salida: row.fecha_hora_salida,
                fecha_hora_llegada: row.fecha_hora_llegada,
                precio_base: row.precio_base,
                duracion_minutos: row.duracion_minutos
            });
            return {
                id_reserva: row.id_reserva,
                fecha_hora_reserva: row.fecha_hora_reserva,
                valor_total: row.valor_total,
                estado: row.estado,
                id_vuelo: flightMapped.id_vuelo,
                cod_vuelo: flightMapped.cod_vuelo,
                ciudad_origen: flightMapped.origen,
                ciudad_destino: flightMapped.destino,
                fecha_hora_salida: flightMapped.fecha_salida,
                fecha_hora_llegada: flightMapped.fecha_llegada,
                precio_base: flightMapped.precio_base
            };
        });

        res.json(mappedReservas);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
});

// Cambiar estado de una reserva (genérico)
app.put('/api/reservas/:id_reserva/estado', async (req, res) => {
    const { id_reserva } = req.params;
    const { nombre_estado } = req.body;

    if (!nombre_estado) {
        return res.status(400).json({ error: 'Se requiere nombre_estado' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const estadoRes = await client.query(
            `SELECT id_estado FROM estado_reserva WHERE nombre_estado = $1 LIMIT 1`,
            [nombre_estado]
        );
        if (estadoRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: `Estado "${nombre_estado}" no válido` });
        }
        const id_estado = estadoRes.rows[0].id_estado;

        const result = await client.query(
            `UPDATE reserva SET id_estado = $1 WHERE id_reserva = $2 RETURNING *`,
            [id_estado, id_reserva]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        // Registrar cambio en historial
        await client.query(
            `INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio)
             VALUES ($1, $2, NOW())`,
            [id_reserva, id_estado]
        );

        await client.query('COMMIT');

        res.json({
            mensaje: `Reserva actualizada a "${nombre_estado}"`,
            reserva: result.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al cambiar estado de reserva:', error);
        res.status(500).json({ error: 'Error al actualizar la reserva' });
    } finally {
        client.release();
    }
});

// Cancelar reserva (acceso directo)
app.put('/api/reservas/:id_reserva/cancelar', async (req, res) => {
    req.body = { nombre_estado: 'Cancelada' };
    // Reutilizar la ruta genérica internamente
    const { id_reserva } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const estadoRes = await client.query(
            `SELECT id_estado FROM estado_reserva WHERE nombre_estado = 'Cancelada' LIMIT 1`
        );
        const id_estado = estadoRes.rows[0].id_estado;

        const result = await client.query(
            `UPDATE reserva SET id_estado = $1 WHERE id_reserva = $2 RETURNING *`,
            [id_estado, id_reserva]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        await client.query(
            `INSERT INTO historial_estado_reserva (id_reserva, id_estado, fecha_hora_cambio)
             VALUES ($1, $2, NOW())`,
            [id_reserva, id_estado]
        );

        // Liberar asiento asociado si existía un tiquete para esta reserva
        await client.query(
            `UPDATE tiquete 
             SET numero_asiento = 'Sin asignar', clase_tiquete = 'Sin asignar'
             WHERE id_reserva = $1`,
            [id_reserva]
        );

        await client.query('COMMIT');
        res.json({ mensaje: 'Reserva cancelada correctamente', reserva: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ error: 'Error al cancelar la reserva' });
    } finally {
        client.release();
    }
});

// ============================================================
// AUTENTICACIÓN
// ============================================================

// Registro: crea usuario + cliente en una transacción
app.post('/api/register', async (req, res) => {
    const {
        tipo_identificacion, numero_identificacion,
        nombres, apellidos,
        email, telefono_principal, telefono_alterno,
        direccion, nombre_ciudad,
        nombre_usuario, password, confirmar
    } = req.body;

    // Validaciones básicas
    if (!tipo_identificacion || !numero_identificacion || !nombres || !apellidos ||
        !email || !telefono_principal || !nombre_usuario || !password || !confirmar) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse' });
    }

    if (password !== confirmar) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Verificar duplicados
        const existeUsuario = await client.query(
            `SELECT id_usuario FROM usuario WHERE nombre_usuario = $1`, [nombre_usuario]
        );
        if (existeUsuario.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        const existeCliente = await client.query(
            `SELECT numero_identificacion FROM cliente WHERE correo = $1 OR numero_identificacion = $2`,
            [email, numero_identificacion]
        );
        if (existeCliente.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'El correo o la identificación ya están registrados' });
        }

        // Insertar cliente primero (ya que usuario.numero_identificacion_cliente tiene una FK hacia cliente)
        const clienteRes = await client.query(
            `INSERT INTO cliente
                (numero_identificacion, tipo_identificacion, nombres, apellidos,
                 correo, direccion, tel_principal, tel_alterno, nombre_ciudad)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING numero_identificacion, nombres, apellidos, correo`,
            [
                numero_identificacion, tipo_identificacion,
                nombres, apellidos,
                email, direccion || null,
                telefono_principal, telefono_alterno || null,
                nombre_ciudad || 'Bogota'
            ]
        );
        const nuevoCliente = clienteRes.rows[0];

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar usuario referenciando al cliente creado
        const usuarioRes = await client.query(
            `INSERT INTO usuario (nombre_usuario, contrasena, nombre_rol, numero_identificacion_cliente)
             VALUES ($1, $2, $3, $4)
             RETURNING id_usuario, nombre_usuario, nombre_rol`,
            [nombre_usuario, passwordHash, 'Cliente', nuevoCliente.numero_identificacion]
        );
        const nuevoUsuario = usuarioRes.rows[0];

        await client.query('COMMIT');

        res.status(201).json({
            mensaje: 'Cuenta creada exitosamente',
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                nombre_usuario: nuevoUsuario.nombre_usuario,
                id_cliente: nuevoCliente.numero_identificacion,
                nombre_completo: `${nuevoCliente.nombres} ${nuevoCliente.apellidos}`,
                correo: nuevoCliente.correo,
                rol: nuevoUsuario.nombre_rol
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error del servidor al registrar el usuario' });
    } finally {
        client.release();
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { nombre_usuario, password } = req.body;

    if (!nombre_usuario || !password) {
        return res.status(400).json({ error: 'Ingresa usuario y contraseña' });
    }

    try {
        // Buscar usuario con su rol y número de identificación de cliente
        const result = await pool.query(`
            SELECT
                u.id_usuario,
                u.nombre_usuario,
                u.contrasena,
                u.nombre_rol AS rol,
                u.numero_identificacion_cliente
            FROM usuario u
            LEFT JOIN cliente c ON u.numero_identificacion_cliente = c.numero_identificacion
            WHERE u.nombre_usuario = $1 OR c.correo = $1
        `, [nombre_usuario]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const usuario = result.rows[0];

        // Autenticación dual (bcrypt con fallback a texto plano para usuarios semilla)
        const validPassword = await (async () => {
            try {
                if (await bcrypt.compare(password, usuario.contrasena)) {
                    return true;
                }
            } catch (e) {
                // Si ocurre un error (ej: contrasena no es un hash bcrypt válido) ignoramos y hacemos fallback
            }
            return password === usuario.contrasena;
        })();

        if (!validPassword) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Obtener datos del cliente si el rol es Cliente
        let clienteData = null;
        if (usuario.rol === 'Cliente' && usuario.numero_identificacion_cliente) {
            const clienteRes = await pool.query(
                `SELECT numero_identificacion, nombres, apellidos, correo
                 FROM cliente WHERE numero_identificacion = $1`,
                [usuario.numero_identificacion_cliente]
            );
            if (clienteRes.rows.length > 0) {
                clienteData = clienteRes.rows[0];
            }
        }

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre_usuario: usuario.nombre_usuario,
                nombre_completo: clienteData
                    ? `${clienteData.nombres} ${clienteData.apellidos}`
                    : usuario.nombre_usuario,
                correo: clienteData ? clienteData.correo : null,
                id_cliente: clienteData ? clienteData.numero_identificacion : null,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor al iniciar sesión' });
    }
});

// ============================================================
// DASHBOARD ADMIN
// ============================================================

app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const vuelos = await pool.query(`SELECT COUNT(*) AS total FROM vuelo`);

        const reservas = await pool.query(`SELECT COUNT(*) AS total FROM reserva`);

        const destinos = await pool.query(
            `SELECT COUNT(DISTINCT ciudad_destino) AS total FROM vuelo`
        );

        const ultimas = await pool.query(`
            SELECT
                r.id_reserva,
                c.nombres || ' ' || c.apellidos AS nombre_completo,
                er.nombre_estado               AS estado
            FROM reserva r
            JOIN cliente       c  ON c.numero_identificacion = r.numero_identificacion_cliente
            JOIN estado_reserva er ON er.id_estado = r.id_estado
            ORDER BY r.fecha_hora_reserva DESC
            LIMIT 5
        `);

        res.json({
            totalVuelos: vuelos.rows[0].total,
            totalReservas: reservas.rows[0].total,
            totalDestinos: destinos.rows[0].total,
            ultimasReservas: ultimas.rows
        });
    } catch (error) {
        console.error('Error dashboard admin:', error);
        res.status(500).json({ error: 'Error dashboard admin' });
    }
});

// ============================================================
// DASHBOARD Y VISTAS DE AGENTE
// ============================================================

app.get('/api/agente/dashboard', async (req, res) => {
    try {
        const totalReservas = await pool.query(`SELECT COUNT(*) AS total FROM reserva`);
        const pendientes = await pool.query(`
            SELECT COUNT(*) AS total FROM reserva r 
            JOIN estado_reserva er ON r.id_estado = er.id_estado 
            WHERE er.nombre_estado IN ('Reservada', 'Pendiente')
        `);
        const confirmadas = await pool.query(`
            SELECT COUNT(*) AS total FROM reserva r 
            JOIN estado_reserva er ON r.id_estado = er.id_estado 
            WHERE er.nombre_estado = 'Confirmada'
        `);
        const canceladas = await pool.query(`
            SELECT COUNT(*) AS total FROM reserva r 
            JOIN estado_reserva er ON r.id_estado = er.id_estado 
            WHERE er.nombre_estado = 'Cancelada'
        `);
        const recientes = await pool.query(`
            SELECT 
                r.id_reserva,
                c.nombres || ' ' || c.apellidos AS nombre_completo,
                c.numero_identificacion,
                v.cod_vuelo,
                co.nombre_ciudad AS origen,
                cd.nombre_ciudad AS destino,
                v.fecha_hora_salida,
                er.nombre_estado AS estado,
                r.valor_total
            FROM reserva r
            JOIN cliente c ON c.numero_identificacion = r.numero_identificacion_cliente
            JOIN vuelo v ON v.cod_vuelo = r.cod_vuelo
            JOIN ciudad co ON co.id_ciudad = v.id_ciudad_origen
            JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
            JOIN estado_reserva er ON er.id_estado = r.id_estado
            ORDER BY r.fecha_hora_reserva DESC
            LIMIT 5
        `);

        res.json({
            total: totalReservas.rows[0].total,
            pendientes: pendientes.rows[0].total,
            confirmadas: confirmadas.rows[0].total,
            canceladas: canceladas.rows[0].total,
            recientes: recientes.rows
        });
    } catch (error) {
        console.error('Error dashboard agente:', error);
        res.status(500).json({ error: 'Error dashboard agente' });
    }
});

app.get('/api/agente/reservas', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                r.id_reserva,
                r.fecha_hora_reserva,
                r.valor_total,
                c.nombres || ' ' || c.apellidos AS nombre_completo,
                c.numero_identificacion,
                v.cod_vuelo,
                co.nombre_ciudad AS origen,
                cd.nombre_ciudad AS destino,
                v.fecha_hora_salida,
                er.nombre_estado AS estado,
                t.numero_asiento,
                t.clase_tiquete
            FROM reserva r
            JOIN cliente c ON c.numero_identificacion = r.numero_identificacion_cliente
            JOIN vuelo v ON v.cod_vuelo = r.cod_vuelo
            JOIN ciudad co ON co.id_ciudad = v.id_ciudad_origen
            JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
            JOIN estado_reserva er ON er.id_estado = r.id_estado
            LEFT JOIN tiquete t ON t.id_reserva = r.id_reserva
            ORDER BY r.fecha_hora_reserva DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener todas las reservas (agente):', error);
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
});

app.get('/api/agente/reservas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Datos principales de la reserva
        const reservaRes = await pool.query(`
            SELECT 
                r.id_reserva,
                r.fecha_hora_reserva,
                r.valor_total,
                c.nombres,
                c.apellidos,
                c.numero_identificacion,
                c.tipo_identificacion,
                c.correo,
                c.tel_principal,
                c.direccion,
                v.cod_vuelo,
                co.nombre_ciudad AS origen,
                cd.nombre_ciudad AS destino,
                v.fecha_hora_salida,
                v.fecha_hora_llegada,
                v.precio_base,
                er.nombre_estado AS estado
            FROM reserva r
            JOIN cliente c ON c.numero_identificacion = r.numero_identificacion_cliente
            JOIN vuelo v ON v.cod_vuelo = r.cod_vuelo
            JOIN ciudad co ON co.id_ciudad = v.id_ciudad_origen
            JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
            JOIN estado_reserva er ON er.id_estado = r.id_estado
            WHERE r.id_reserva = $1
        `, [id]);

        if (reservaRes.rows.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        const reserva = reservaRes.rows[0];

        // Tiquete asociado
        const tiqueteRes = await pool.query(
            `SELECT numero_asiento, clase_tiquete, precio_final FROM tiquete WHERE id_reserva = $1`,
            [id]
        );
        const tiquete = tiqueteRes.rows.length > 0 ? tiqueteRes.rows[0] : null;

        // Paquetes turísticos asociados
        const paquetesRes = await pool.query(`
            SELECT pt.nombre_paquete, pt.descripcion, pt.precio
            FROM reserva_paquete rp
            JOIN paquete_turistico pt ON pt.id_paquete = rp.id_paquete
            WHERE rp.id_reserva = $1
        `, [id]);

        // Historial de estados
        const historialRes = await pool.query(`
            SELECT 
                her.fecha_hora_cambio,
                er.nombre_estado
            FROM historial_estado_reserva her
            JOIN estado_reserva er ON er.id_estado = her.id_estado
            WHERE her.id_reserva = $1
            ORDER BY her.fecha_hora_cambio ASC
        `, [id]);

        res.json({
            id_reserva: reserva.id_reserva,
            fecha_hora_reserva: reserva.fecha_hora_reserva,
            valor_total: reserva.valor_total,
            estado: reserva.estado,
            pasajero: {
                nombre: `${reserva.nombres} ${reserva.apellidos}`,
                documento: reserva.numero_identificacion,
                tipo_identificacion: reserva.tipo_identificacion,
                email: reserva.correo,
                telefono: reserva.tel_principal,
                direccion: reserva.direccion
            },
            vuelo: {
                codigo: reserva.cod_vuelo,
                origen: reserva.origen,
                destino: reserva.destino,
                fecha_salida: reserva.fecha_hora_salida,
                fecha_llegada: reserva.fecha_hora_llegada,
                precio_base: reserva.precio_base
            },
            tiquete: tiquete,
            paquetes: paquetesRes.rows,
            historial: historialRes.rows
        });
    } catch (error) {
        console.error('Error al obtener detalle de reserva:', error);
        res.status(500).json({ error: 'Error al obtener detalle de reserva' });
    }
});

app.put('/api/agente/reservas/:id/asiento', async (req, res) => {
    const { id } = req.params;
    const { numero_asiento, clase_tiquete } = req.body;

    if (!numero_asiento || !clase_tiquete) {
        return res.status(400).json({ error: 'Se requiere numero_asiento y clase_tiquete' });
    }

    try {
        // 1. Verificamos si existe la reserva
        const reservaRes = await pool.query('SELECT cod_vuelo, valor_total FROM reserva WHERE id_reserva = $1', [id]);
        if (reservaRes.rows.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        const { cod_vuelo, valor_total } = reservaRes.rows[0];

        // 2. Verificamos si el asiento ya está ocupado en el mismo vuelo
        const asientoOcupadoRes = await pool.query(
            `SELECT t.id_tiquete
             FROM tiquete t
             JOIN reserva r ON r.id_reserva = t.id_reserva
             WHERE r.cod_vuelo = $1
               AND t.numero_asiento = $2
               AND t.id_reserva != $3`,
            [cod_vuelo, numero_asiento, id]
        );
        if (asientoOcupadoRes.rows.length > 0) {
            return res.status(409).json({ error: 'El asiento ya está ocupado en este vuelo. Elija otro asiento.' });
        }

        // 3. Verificamos si ya existe un tiquete para esta reserva
        const tiqueteRes = await pool.query('SELECT id_tiquete FROM tiquete WHERE id_reserva = $1', [id]);
        
        let result;
        if (tiqueteRes.rows.length > 0) {
            // Actualizar tiquete existente
            result = await pool.query(
                `UPDATE tiquete 
                 SET numero_asiento = $1, clase_tiquete = $2 
                 WHERE id_reserva = $3 
                 RETURNING *`,
                [numero_asiento, clase_tiquete, id]
            );
        } else {
            // Insertar tiquete nuevo
            result = await pool.query(
                `INSERT INTO tiquete (numero_asiento, clase_tiquete, precio_final, id_reserva)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [numero_asiento, clase_tiquete, valor_total, id]
            );
        }

        res.json({
            mensaje: 'Asiento asignado correctamente',
            tiquete: result.rows[0]
        });
    } catch (error) {
        console.error('Error al asignar asiento:', error);
        res.status(500).json({ error: 'Error del servidor al asignar asiento' });
    }
});

// ============================================================
// SERVIDOR
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
