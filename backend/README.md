# Backend H2O Integrador

API REST con Express + TypeORM conectada a **Azure SQL Database**.

## Requisitos

- Node.js 18+
- Cuenta Azure con base de datos `h2o-db` en `sql-h2o-integrador-lf`

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copia `.env.example` a `.env` (si no existe)
2. Verifica que `DB_PASSWORD` coincida con la contraseña del servidor Azure SQL

## Ejecución

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor se inicia en `http://localhost:3001`.

## Endpoints

- `GET /api/health` - Verificar conexión

## Credenciales (guardar de forma segura)

- **Servidor:** sql-h2o-integrador-lf.database.windows.net
- **Base de datos:** h2o-db
- **Usuario:** sqladmin
- **Contraseña:** (ver archivo .env - no subir a Git)
