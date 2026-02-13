require('reflect-metadata');
require('dotenv').config();
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
const PORT = process.env.PORT || 3001;

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
    console.log('✅ Conectado a Azure SQL Database (h2o-db)');

    await connectMongo(); 

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log('📋 Endpoints principales disponibles:');
      console.log('   - /api/health');
      console.log('   - /api/auth/login');
      console.log('   - /api/registros');
    });

  } catch (error) {
    console.error('❌ Error crítico al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

start();