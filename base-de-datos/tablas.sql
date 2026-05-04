-- Tabla para almacenar los usuarios (clientes y administradores)
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    tipo_identificacion VARCHAR(10) NOT NULL,
    numero_identificacion VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- Aquí se debe guardar la contraseña encriptada (hash)
    rol VARCHAR(50) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear un índice para búsquedas más rápidas por correo (útil para el login)
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
