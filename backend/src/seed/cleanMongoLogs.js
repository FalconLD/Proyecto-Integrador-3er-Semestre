/**
 * Limpieza de colecciones en MongoDB (logs de sesión, ranking, rachas).
 * Útil para dejar datos auxiliares en cero antes de pruebas o replicación.
 * No elimina la base ni las colecciones; solo borra documentos.
 *
 * Uso: node src/seed/cleanMongoLogs.js
 * Requiere: MONGODB_URI en .env (o mongodb://localhost:27017/h2o-db)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const SessionLog = require('../models/SessionLog');
const RankingEntry = require('../models/RankingEntry');
const Racha = require('../models/Racha');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/h2o-db';
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB para limpieza');

    const r1 = await SessionLog.deleteMany({});
    console.log('  ✓ sessionlogs:', r1.deletedCount, 'documentos eliminados');

    const r2 = await RankingEntry.deleteMany({});
    console.log('  ✓ rankingentries:', r2.deletedCount, 'documentos eliminados');

    const r3 = await Racha.deleteMany({});
    console.log('  ✓ rachas:', r3.deletedCount, 'documentos eliminados');

    console.log('\nLimpieza de MongoDB completada.');
  } catch (err) {
    console.error('Error en limpieza MongoDB:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
