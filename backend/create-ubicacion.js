const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('Conectando a la base de datos...');

    // Crear la tabla ubicacion
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ubicacion (
        id_ubicacion SERIAL PRIMARY KEY,
        ciudad VARCHAR(100) NOT NULL,
        pais VARCHAR(100) NOT NULL,
        nombre_aeropuerto VARCHAR(150),
        codigo_aeropuerto VARCHAR(10)
      );
    `;
    await pool.query(createTableQuery);
    console.log('✅ Tabla ubicacion creada (o ya existía).');

    // Comprobar si ya hay datos
    const checkData = await pool.query('SELECT COUNT(*) as count FROM ubicacion');
    if (parseInt(checkData.rows[0].count) === 0) {
      console.log('Insertando datos iniciales de ubicaciones...');
      const insertQuery = `
        INSERT INTO ubicacion (ciudad, pais, nombre_aeropuerto, codigo_aeropuerto) VALUES
        ('Cali', 'Colombia', 'Aeropuerto Internacional Alfonso Bonilla Aragón', 'CLO'),
        ('Bogota', 'Colombia', 'Aeropuerto Internacional El Dorado', 'BOG'),
        ('Medellin', 'Colombia', 'Aeropuerto Internacional José María Córdova', 'MDE'),
        ('Barranquilla', 'Colombia', 'Aeropuerto Internacional Ernesto Cortissoz', 'BAQ'),
        ('Cartagena', 'Colombia', 'Aeropuerto Internacional Rafael Núñez', 'CTG'),
        ('Madrid', 'España', 'Aeropuerto Adolfo Suárez Madrid-Barajas', 'MAD'),
        ('Paris', 'Francia', 'Aeropuerto de París-Charles de Gaulle', 'CDG');
      `;
      await pool.query(insertQuery);
      console.log('✅ Datos insertados correctamente.');
    } else {
      console.log('⚠️ La tabla ubicacion ya contiene datos.');
    }

  } catch (error) {
    console.error('❌ Error ejecutando la migración:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
