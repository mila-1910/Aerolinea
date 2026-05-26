const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixPackageStates() {
  try {
    console.log('Conectando a la base de datos...');
    const result = await pool.query(`UPDATE paquete_turistico SET estado = 'Activo' WHERE estado = 'Disponible'`);
    console.log(`✅ ${result.rowCount} paquetes actualizados a 'Activo'.`);
  } catch (error) {
    console.error('❌ Error ejecutando la actualización:', error);
  } finally {
    await pool.end();
  }
}

fixPackageStates();
