/**
 * Limpieza de datos en la base de datos (Azure SQL).
 * Elimina todos los registros en orden seguro (respeta FKs).
 * Ejecutar ANTES del seed cuando se quiera partir de cero.
 *
 * Uso: node src/seed/cleanDatabase.js
 */
require('dotenv').config();
const AppDataSource = require('../config/database');

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a la base de datos para limpieza');

    // Anular FK usuarios → roles (omitir si la columna no existe aún)
    try {
      await AppDataSource.query('UPDATE usuarios SET roleId = NULL');
      console.log('  ✓ roleId en usuarios anulado');
    } catch (e) {
      if (e.message && e.message.includes('roleId')) {
        console.log('  ⚠ roleId no existe en usuarios (ejecuta antes: node src/seed/syncSchema.js)');
      } else throw e;
    }

    // Orden: tablas hijas primero (respeta FKs)
    const tables = [
      ['registros_diarios', 'registros_diarios'],
      ['registros_semanales', 'registros_semanales'],
      ['auditoria', 'auditoria'],
      ['usuarios', 'usuarios'],
      ['role_permisos', 'role_permisos'],
      ['roles', 'roles'],
      ['permisos_catalogo', 'permisos_catalogo'],
    ];
    for (const [table, label] of tables) {
      try {
        await AppDataSource.query(`DELETE FROM ${table}`);
        console.log(`  ✓ ${label} vaciado`);
      } catch (e) {
        if (e.message && (e.message.includes('Invalid object name') || e.message.includes('does not exist'))) {
          console.log(`  ⚠ ${label} no existe, omitido`);
        } else throw e;
      }
    }

    console.log('\nLimpieza completada. Ejecuta el seed: node src/seed/seedDemoData.js');
  } catch (err) {
    console.error('Error en limpieza:', err.message);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

run();
