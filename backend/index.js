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

// ============================================================
// RUTAS DE VUELOS
// ============================================================

// Listar vuelos disponibles (Programados)
app.get('/api/vuelos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                v.id_vuelo,
                v.cod_vuelo,
                co.nombre        AS ciudad_origen,
                cd.nombre        AS ciudad_destino,
                v.fecha_hora_salida,
                v.fecha_hora_llegada,
                v.capacidad_pasajeros,
                v.precio_base,
                v.estado_vuelo
            FROM vuelo v
            JOIN ciudad co ON co.id_ciudad = v.id_ciudad_origen
            JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
            WHERE v.estado_vuelo = 'Programado'
            ORDER BY v.fecha_hora_salida ASC
        `);
        res.json(result.rows);
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
                v.id_vuelo,
                v.cod_vuelo,
                co.nombre        AS ciudad_origen,
                cd.nombre        AS ciudad_destino,
                v.fecha_hora_salida,
                v.fecha_hora_llegada,
                v.capacidad_pasajeros,
                v.precio_base,
                v.estado_vuelo
            FROM vuelo v
            JOIN ciudad co ON co.id_ciudad = v.id_ciudad_origen
            JOIN ciudad cd ON cd.id_ciudad = v.id_ciudad_destino
            WHERE v.id_vuelo = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vuelo no encontrado' });
        }
        res.json(result.rows[0]);
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
    const { id_cliente, id_vuelo, valor_total } = req.body;

    if (!id_cliente || !id_vuelo || !valor_total) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: id_cliente, id_vuelo, valor_total' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Obtener id del estado "Reservada"
        const estadoRes = await client.query(
            `SELECT id_estado FROM estado_reserva WHERE nombre_estado = 'Reservada' LIMIT 1`
        );
        if (estadoRes.rows.length === 0) {
            throw new Error('Estado "Reservada" no encontrado en la base de datos');
        }
        const id_estado = estadoRes.rows[0].id_estado;

        // Insertar la reserva
        const result = await client.query(
            `INSERT INTO reserva (id_cliente, id_vuelo, id_estado, valor_total)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id_cliente, id_vuelo, id_estado, valor_total]
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
                v.id_vuelo,
                v.cod_vuelo,
                co.nombre                 AS ciudad_origen,
                cd.nombre                 AS ciudad_destino,
                v.fecha_hora_salida,
                v.fecha_hora_llegada,
                v.precio_base
            FROM reserva r
            JOIN estado_reserva er ON er.id_estado = r.id_estado
            JOIN vuelo v           ON v.id_vuelo   = r.id_vuelo
            JOIN ciudad co         ON co.id_ciudad = v.id_ciudad_origen
            JOIN ciudad cd         ON cd.id_ciudad = v.id_ciudad_destino
            WHERE r.id_cliente = $1
            ORDER BY r.fecha_hora_reserva DESC
        `, [id_cliente]);

        res.json(result.rows);
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
        direccion, id_ciudad,
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
            `SELECT id_cliente FROM cliente WHERE correo = $1 OR numero_identificacion = $2`,
            [email, numero_identificacion]
        );
        if (existeCliente.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'El correo o la identificación ya están registrados' });
        }

        // Obtener id del rol "Cliente"
        const rolRes = await client.query(
            `SELECT id_rol FROM rol WHERE nombre_rol = 'Cliente' LIMIT 1`
        );
        if (rolRes.rows.length === 0) {
            throw new Error('Rol "Cliente" no encontrado en la base de datos');
        }
        const id_rol = rolRes.rows[0].id_rol;

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar usuario
        const usuarioRes = await client.query(
            `INSERT INTO usuario (nombre_usuario, contrasena, id_rol)
             VALUES ($1, $2, $3)
             RETURNING id_usuario, nombre_usuario`,
            [nombre_usuario, passwordHash, id_rol]
        );
        const nuevoUsuario = usuarioRes.rows[0];

        // Insertar cliente
        const clienteRes = await client.query(
            `INSERT INTO cliente
                (numero_identificacion, tipo_identificacion, nombres, apellidos,
                 correo, direccion, id_ciudad, telefono_principal, telefono_alterno, id_usuario)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING id_cliente, nombres, apellidos, correo`,
            [
                numero_identificacion, tipo_identificacion,
                nombres, apellidos,
                email, direccion || null, id_ciudad || null,
                telefono_principal, telefono_alterno || null,
                nuevoUsuario.id_usuario
            ]
        );
        const nuevoCliente = clienteRes.rows[0];

        await client.query('COMMIT');

        res.status(201).json({
            mensaje: 'Cuenta creada exitosamente',
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                nombre_usuario: nuevoUsuario.nombre_usuario,
                id_cliente: nuevoCliente.id_cliente,
                nombre_completo: `${nuevoCliente.nombres} ${nuevoCliente.apellidos}`,
                correo: nuevoCliente.correo,
                rol: 'Cliente'
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
        // Buscar usuario con join al rol
        const result = await pool.query(`
            SELECT
                u.id_usuario,
                u.nombre_usuario,
                u.contrasena,
                r.nombre_rol AS rol
            FROM usuario u
            JOIN rol r ON r.id_rol = u.id_rol
            WHERE u.nombre_usuario = $1
        `, [nombre_usuario]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const usuario = result.rows[0];
        const validPassword = await bcrypt.compare(password, usuario.contrasena);

        if (!validPassword) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Obtener datos del cliente si el rol es Cliente
        let clienteData = null;
        if (usuario.rol === 'Cliente') {
            const clienteRes = await pool.query(
                `SELECT id_cliente, nombres, apellidos, correo
                 FROM cliente WHERE id_usuario = $1`,
                [usuario.id_usuario]
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
                id_cliente: clienteData ? clienteData.id_cliente : null,
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
            `SELECT COUNT(DISTINCT id_ciudad_destino) AS total FROM vuelo`
        );

        const ultimas = await pool.query(`
            SELECT
                r.id_reserva,
                c.nombres || ' ' || c.apellidos AS nombre_completo,
                er.nombre_estado               AS estado
            FROM reserva r
            JOIN cliente       c  ON c.id_cliente  = r.id_cliente
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
// UBICACIONES (países, departamentos, ciudades)
// ============================================================

app.get('/api/paises', async (req, res) => {
    try {
        const result = await pool.query(`SELECT id_pais, nombre FROM pais ORDER BY nombre`);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener países' });
    }
});

app.get('/api/departamentos/:id_pais', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id_departamento, nombre FROM departamento WHERE id_pais = $1 ORDER BY nombre`,
            [req.params.id_pais]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener departamentos' });
    }
});

app.get('/api/ciudades/:id_departamento', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id_ciudad, nombre FROM ciudad WHERE id_departamento = $1 ORDER BY nombre`,
            [req.params.id_departamento]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ciudades' });
    }
});

// ============================================================
// SERVIDOR
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
