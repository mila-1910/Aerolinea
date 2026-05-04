const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runInitDb() {
  try {
    const sqlPath = path.join(__dirname, '../base-de-datos/tablas.sql');
    const sqlCode = fs.readFileSync(sqlPath, 'utf-8');
    console.log('Ejecutando script de base de datos en Neon...');
    await pool.query(sqlCode);
    console.log('¡Tabla de usuarios creada correctamente en Neon!');
  } catch (err) {
    console.error('Hubo un error al crear las tablas:', err);
  } finally {
    await pool.end();
  }
}

runInitDb();
