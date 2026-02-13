/**
 * Ejecuta backend/sql/h2o_extras.sql en la BD (restricciones, trigger, SP, vistas, índices).
 * Uso: node src/seed/runH2oExtras.js
 * Requiere .env con DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME.
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const AppDataSource = require('../config/database');

async function run() {
  const sqlPath = path.join(__dirname, '../../sql/h2o_extras.sql');
  let sql = fs.readFileSync(sqlPath, 'utf8');
  // Quitar USE [h2o-db]; y GO al inicio; dividir por GO (batch separator)
  sql = sql.replace(/^\s*USE\s+\[h2o-db\];\s*GO\s*/i, '');
  // GO solo como línea completa (evitar partir "rango", "trigonometry", etc.)
  const batches = sql
    .split(/(?:\r?\n|\r)\s*GO\s*(?:\r?\n|\r|$)/im)
    .map((b) => b.trim())
    .filter((b) => b.length > 0 && !b.match(/^--/));

  await AppDataSource.initialize();
  console.log('Conectado a', process.env.DB_NAME || 'h2o-db');
  let ok = 0;
  let err = 0;
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    if (!batch) continue;
    try {
      await AppDataSource.query(batch);
      ok++;
      console.log('  Batch', i + 1, 'OK');
    } catch (e) {
      err++;
      console.error('  Batch', i + 1, 'Error:', e.message);
    }
  }
  await AppDataSource.destroy();
  console.log('Resultado:', ok, 'OK,', err, 'errores');
  process.exit(err > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
