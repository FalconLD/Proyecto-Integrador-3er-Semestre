// Configuración TypeORM para Azure SQL Database
require('dotenv').config();
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT) || 1433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
  synchronize: true, // En desarrollo: crea/actualiza tablas automáticamente
  logging: false, // Sin volcar cada query; el arranque muestra un resumen en server.js
  entities: [
    __dirname + '/../models/Usuario.js',
    __dirname + '/../models/Role.js',
    __dirname + '/../models/PermisoCatalogo.js',
    __dirname + '/../models/RegistroDiario.js',
    __dirname + '/../models/RegistroSemanal.js',
    __dirname + '/../models/Auditoria.js',
  ],
});

module.exports = AppDataSource;
