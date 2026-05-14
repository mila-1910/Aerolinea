const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(express.static(path.join(__dirname, '..')));

// Configuración de la conexión a la base de datos (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Obligatorio para Neon
    }
});

// 🛡️ EL ESCUDO ANTI-CAÍDAS: 
// Esto evita que el servidor se apague si Neon corta la conexión por inactividad
pool.on('error', (err, client) => {
    console.error('Neon cortó una conexión inactiva (es normal):', err.message);
});

// 3. PRUEBA DE CONEXIÓN LIGERA
// Esto solo pregunta la hora una vez y "cuelga" el teléfono de inmediato.
pool.query('SELECT NOW()')
    .then(() => console.log('✅ Conexión inicial con Neon exitosa 🐘'))
    .catch(err => console.error('❌ Error al hablar con Neon:', err.message));

// --- RUTAS ---

// Ruta para listar vuelos disponibles
app.get('/api/vuelos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id_vuelo,
                numero_vuelo,
                origen,
                destino,
                ciudad_destino,
                fecha_salida,
                hora_salida,
                hora_llegada,
                duracion_minutos,
                escala,
                clase,
                tipo_avion,
                precio_base,
                imagen_url,
                descripcion
            FROM vuelos
            WHERE activo = true
            ORDER BY fecha_salida ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener vuelos:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos' });
    }
});


// Ruta para crear una reserva
app.post('/api/reservas', async (req, res) => {
    const {
        numero_reserva,
        id_usuario,
        id_vuelo,
        estado,
        clase,
        pasajeros,
        tarifa_extra,
        descuento,
        total
    } = req.body;

    if (!numero_reserva || !id_usuario || !id_vuelo || !clase || !total) {
        return res.status(400).json({ error: 'Faltan datos para crear la reserva' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reservas (
                numero_reserva,
                id_usuario,
                id_vuelo,
                estado,
                clase,
                pasajeros,
                tarifa_extra,
                descuento,
                total
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                numero_reserva,
                id_usuario,
                id_vuelo,
                estado || 'Pendiente',
                clase,
                pasajeros || 1,
                tarifa_extra || 0,
                descuento || 0,
                total
            ]
        );

        res.status(201).json({
            mensaje: 'Reserva creada correctamente',
            reserva: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});

// Ruta para listar reservas de un usuario
app.get('/api/reservas/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                r.id_reserva,
                r.numero_reserva,
                r.estado,
                r.clase,
                r.pasajeros,
                r.tarifa_extra,
                r.descuento,
                r.total,
                r.fecha_reserva,
                v.id_vuelo,
                v.numero_vuelo,
                v.origen,
                v.destino,
                v.ciudad_destino,
                v.fecha_salida,
                v.hora_salida,
                v.hora_llegada,
                v.duracion_minutos,
                v.escala,
                v.tipo_avion,
                v.precio_base,
                v.imagen_url
            FROM reservas r
            INNER JOIN vuelos v ON r.id_vuelo = v.id_vuelo
            WHERE r.id_usuario = $1
            ORDER BY r.fecha_reserva DESC
        `, [id_usuario]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
});

// Ruta para cancelar una reserva
app.put('/api/reservas/:id_reserva/cancelar', async (req, res) => {
    const { id_reserva } = req.params;

    try {
        const result = await pool.query(
            `UPDATE reservas
             SET estado = 'Cancelada'
             WHERE id_reserva = $1
             RETURNING *`,
            [id_reserva]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        res.json({
            mensaje: 'Reserva cancelada correctamente',
            reserva: result.rows[0]
        });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
});


// Ruta para Registrarse (Crear cuenta)
app.post('/api/register', async (req, res) => {
    const { tipo_identificacion, numero_identificacion, nombre, email, telefono, password, confirmar } = req.body;

    // Validaciones básicas
    if (!tipo_identificacion || !numero_identificacion || !nombre || !email || !telefono || !password || !confirmar) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (password !== confirmar) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    try {
        // Verificar si el usuario o el correo ya existen
        const userExist = await pool.query('SELECT * FROM usuarios WHERE correo = $1 OR numero_identificacion = $2', [email, numero_identificacion]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: 'El correo o el número de identificación ya están registrados' });
        }

        // Encriptar la contraseña (hash)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar en la base de datos
        const newUser = await pool.query(
            `INSERT INTO usuarios (tipo_identificacion, numero_identificacion, nombre_completo, correo, telefono, contrasena) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario, nombre_completo, correo`,
            [tipo_identificacion, numero_identificacion, nombre, email, telefono, passwordHash]
        );

        res.status(201).json({
            mensaje: 'Cuenta creada exitosamente',
            usuario: newUser.rows[0]
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error del servidor al registrar el usuario' });
    }
});

// Ruta para Iniciar Sesión (Login)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, ingresa correo y contraseña' });
    }

    try {
        // Buscar al usuario por su correo
        const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const usuario = result.rows[0];

        // Comparar la contraseña ingresada con el hash en la base de datos
        const validPassword = await bcrypt.compare(password, usuario.contrasena);

        if (!validPassword) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // ¡Login exitoso! (Aquí después se podría implementar JWT para seguridad)
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre_completo: usuario.nombre_completo,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

   } catch (error) {
    console.error('Error al crear reserva:', error);

    if (error.code === '23505') {
        return res.status(409).json({
            error: 'Ya tienes una reserva activa para este vuelo'
        });
    }

    res.status(500).json({ error: 'Error al crear la reserva' });
}

});
// Dashboard Admin
app.get('/api/admin/dashboard', async (req, res) => {
    try {

        const vuelos = await pool.query(`
            SELECT COUNT(*) AS total FROM vuelos
        `);

        const reservas = await pool.query(`
            SELECT COUNT(*) AS total FROM reservas
        `);

        const destinos = await pool.query(`
            SELECT COUNT(DISTINCT destino) AS total FROM vuelos
        `);

        const ultimas = await pool.query(`
            SELECT 
                r.numero_reserva,
                u.nombre_completo,
                r.estado
            FROM reservas r
            JOIN usuarios u ON u.id_usuario = r.id_usuario
            ORDER BY r.fecha_reserva DESC
            LIMIT 5
        `);

        res.json({
            totalVuelos: vuelos.rows[0].total,
            totalReservas: reservas.rows[0].total,
            totalDestinos: destinos.rows[0].total,
            ultimasReservas: ultimas.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error dashboard admin' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
