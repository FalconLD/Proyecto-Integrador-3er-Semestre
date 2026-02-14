require('reflect-metadata');
require('dotenv').config();

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('  ❌ [backend] JWT_SECRET es obligatorio en producción. Configure la variable de entorno.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const AppDataSource = require('./config/database');
const { connectMongo } = require('./db/mongodb');

const usuariosRoutes = require('./routes/usuariosRoutes');
const registrosRoutes = require('./routes/registrosRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rachasRoutes = require('./routes/rachasRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Si el puerto está ocupado, usar el siguiente disponible (evita EADDRINUSE al tener varios procesos)
function tryListen(port) {
  const numPort = Number(port) || PORT;
  if (numPort < 0 || numPort > 65535) {
    return Promise.reject(new Error(`Puerto inválido: ${port}`));
  }
  return new Promise((resolve, reject) => {
    const server = app.listen(numPort, () => {
      resolve(server);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && numPort < 65535) {
        tryListen(numPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Agregado para ver logs de peticiones en consola

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'API H2O Integrador - Azure SQL + MongoDB',
    servicios: {
      sql: AppDataSource.isInitialized ? 'Online' : 'Offline',
      mongo: 'Verificar en consola'
    },
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rachas', rachasRoutes);

const start = async () => {
  try {
    await AppDataSource.initialize();
    const numEntidades = AppDataSource.entityMetadatas?.length ?? 0;
    await connectMongo();

    const server = await tryListen(PORT);
    const actualPort = server.address().port;
    const portNote = actualPort !== PORT ? ` (puerto ${PORT} ocupado → ${actualPort})` : '';

    // Bloque de arranque con iconos
    console.log('');
    console.log('  ┌─────────────────────────────────────────');
    console.log('  │  🚀 Backend listo');
    console.log('  ├─────────────────────────────────────────');
    console.log(`  │  ✅ Azure SQL (h2o-db) · esquema listo (${numEntidades} entidades)`);
    console.log('  │  ✅ MongoDB conectado');
    console.log(`  │  🌐 http://localhost:${actualPort}${portNote}`);
    console.log('  └─────────────────────────────────────────');
    console.log('');
  } catch (error) {
    console.error('  ❌ [backend] Error:', error.message);
    process.exit(1);
  }
};

start();