require('reflect-metadata');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'API H2O Integrador - Azure SQL + MongoDB',
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
    console.log('Conectado a Azure SQL Database (h2o-db)');

    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
      console.log('Endpoints: /api/health, /api/usuarios, /api/registros, /api/ranking, /api/admin/summary, /api/rachas/usuario/:id');
    });
  } catch (error) {
    console.error('Error al iniciar:', error.message);
    process.exit(1);
  }
};

start();
