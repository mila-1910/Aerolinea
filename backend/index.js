const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON

// Configuración de la conexión a la base de datos (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('Conectado exitosamente a la base de datos Neon 🐘'))
    .catch(err => console.error('Error conectando a la base de datos', err));

// --- RUTAS ---

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
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error del servidor al iniciar sesión' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
