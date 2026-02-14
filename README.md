<p align="center">
  <img src="https://img.shields.io/badge/WaterMark-Proyecto_Integrador-2563eb?style=for-the-badge&labelColor=1e40af" alt="WaterMark" />
</p>

<h1 align="center">💧 WaterMark — Proyecto Integrador H2O</h1>
<p align="center">
  <strong>Aplicación web para seguimiento de consumo de agua</strong> con panel de administración, roles, permisos y ranking anónimo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Azure_SQL-Database-0078d4?style=flat-square&logo=microsoft-azure" alt="Azure SQL" />
  <img src="https://img.shields.io/badge/MongoDB-NoSQL-47a248?style=flat-square&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38b2ac?style=flat-square&logo=tailwind-css" alt="Tailwind" />
</p>

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y uso](#-instalación-y-uso)
- [Scripts disponibles](#-scripts-disponibles)
- [Base de datos](#-base-de-datos)
- [Licencia y créditos](#-licencia-y-créditos)

---

## 📖 Descripción

**WaterMark** es el Proyecto Integrador del 3.er semestre (PUCE) para la materia de Desarrollo Web y Bases de Datos. Permite a los usuarios registrar su consumo diario de agua según parámetros PUCE, visualizar tendencias, participar en un ranking anónimo y desbloquear logros. Incluye un panel de administración con gestión de usuarios, roles, permisos y auditoría.

| Área            | Stack principal                                      |
|-----------------|------------------------------------------------------|
| **Frontend**    | React 19, Vite 7, Tailwind CSS, React Router, Framer Motion |
| **Backend**     | Node.js, Express, TypeORM (Azure SQL), Mongoose (MongoDB), JWT |
| **Bases de datos** | Azure SQL Database (transaccional), MongoDB (logs, ranking) |

---

## ✨ Características

| Funcionalidad | Descripción |
|---------------|-------------|
| 🔐 **Autenticación** | Registro, login y sesión con JWT; contraseñas con bcrypt. |
| 📊 **Análisis diario** | Formulario por pasos (hogar, higiene, inodoro, alimentación, bebidas) con cálculo de litros directos y huella virtual. |
| 📈 **Progreso** | Gráficas de tendencia, métricas (promedio, mejor día, rachas) y recomendaciones. |
| 🏆 **Ranking** | Ranking anónimo por consumo eficiente y logros desbloqueables. |
| 👤 **Perfil** | Nombre, tema claro/oscuro y opciones de cuenta. |
| 🛡️ **Panel admin** | Resumen, usuarios, roles, permisos, catálogo de permisos y logs de sesión (según permisos). |
| 🗑️ **CRUD registros** | Crear, ver, actualizar y eliminar registros diarios desde la interfaz. |

---

## 🛠 Tecnologías

| Capa | Tecnología |
|------|------------|
| **UI** | React 19, Vite 7, Tailwind CSS 4, Framer Motion, Chart.js, Lucide React, Sonner |
| **API** | Express, CORS, Morgan |
| **ORM / BD** | TypeORM (Azure SQL), Mongoose (MongoDB) |
| **Auth** | JWT, bcryptjs |
| **Herramientas** | ESLint, Nodemon, Concurrently |

---

## 📁 Estructura del proyecto

```
proyecto-integrador-h2o/
├── frontend/                 # App React (Vite) — interfaz de usuario
│   ├── src/
│   │   ├── components/       # Dashboard, StepForm, SettingsPanel, etc.
│   │   ├── pages/            # ProgressPage, RankingPage, AdminPage
│   │   ├── context/          # AuthContext
│   │   ├── services/         # api.js
│   │   └── ...
│   └── package.json
├── backend/                  # API Node/Express
│   ├── src/
│   │   ├── config/           # database.js, permisos
│   │   ├── controllers/      # auth, usuarios, registros, admin
│   │   ├── middleware/       # auth, permisos
│   │   ├── models/           # TypeORM entities
│   │   ├── routes/           # Rutas API
│   │   ├── db/               # mongodb.js
│   │   └── sql/              # h2o_extras.sql
│   └── package.json
├── package.json              # Scripts de conveniencia desde la raíz
└── README.md
```

---

## 📌 Requisitos previos

- **Node.js** (v18 o superior recomendado)
- **npm** o yarn
- **Cuenta Azure** con Azure SQL Database (o SQL Server local para desarrollo)
- **MongoDB** (Atlas o instancia local) para logs y ranking

---

## 🚀 Instalación y uso

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd Proyecto-Integrador-3er-Semestre
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Configurar variables de entorno

| Archivo | Variables principales |
|---------|------------------------|
| **backend/.env** | `DB_SERVER`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, cadena de conexión MongoDB |
| **frontend/.env** | `VITE_API_URL` (opcional; por defecto `http://localhost:3001`) |

Usa `backend/.env.example` y `frontend/.env.example` como plantilla (si existen).

### 3. Aplicar script de base de datos (Azure SQL)

Para restricciones, triggers, SP y vistas:

```bash
cd backend && npm run run-extras
```

O ejecutar manualmente `backend/sql/h2o_extras.sql` en Azure Data Studio / SSMS (por lotes con `GO`).

### 4. Arrancar la aplicación

**Opción A — Dos terminales**

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

**Opción B — Una sola terminal (desde la raíz)**

```bash
npm run dev
```

Abre el frontend en la URL que indique Vite (p. ej. `http://localhost:5173`) y el backend en `http://localhost:3001`.

---

## 📜 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia frontend y backend en modo desarrollo (concurrently) |
| `npm run dev:frontend` | Solo frontend (Vite) |
| `npm run dev:backend` | Solo backend (Nodemon) |
| `npm run build:frontend` | Build de producción en `frontend/dist` |
| `npm run start:backend` | Backend en modo producción |
| `npm run run-extras` *(en backend)* | Ejecuta `h2o_extras.sql` en Azure SQL |
| `npm run seed` *(en backend)* | Carga datos de demostración |

---

## 🗄 Base de datos

| Motor | Uso |
|-------|-----|
| **Azure SQL Database** | Usuarios, roles, permisos, registros diarios/semanales, auditoría. TypeORM + script `h2o_extras.sql` (CHECK, triggers, SP, vistas). |
| **MongoDB** | `sessionlogs` (auditoría de acceso), `rankingentries` (ranking anónimo). |

Para que la inserción use el procedimiento almacenado con validaciones y transacciones, el script **h2o_extras** debe estar aplicado en la base (ver [Instalación y uso](#-instalación-y-uso)).

---

## 📄 Licencia y créditos

**WaterMarker • Proyecto Integrador PUCE 2026**

Proyecto académico — 3.er semestre. Desarrollo Web, Bases de Datos y Proyectos de Software.
