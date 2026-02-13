/**
 * Sincroniza el esquema de la BD con las entidades TypeORM.
 * Añade columnas/tablas faltantes (ej. roleId en usuarios, tablas roles/permisos).
 * Ejecutar antes de clean + seed si la BD fue creada antes de tener roles.
 *
 * Uso: node src/seed/syncSchema.js
 */
require('dotenv').config();
const AppDataSource = require('../config/database');

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Esquema sincronizado con la base de datos (tablas/columnas actualizadas).');
  } catch (err) {
    console.error('Error al sincronizar:', err.message);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

run();
