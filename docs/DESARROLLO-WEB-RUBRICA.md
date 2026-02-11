## Mapeo Proyecto H2O ↔ Clases de Desarrollo Web

### 1. Relación entre clases y funcionalidades

| Clase Desarrollo Web | Contenido principal | Dónde se refleja en el proyecto H2O |
|----------------------|---------------------|--------------------------------------|
| `1.Clase_fundamentos_javascript.html` | Variables, funciones, estructuras básicas | Lógica de cálculo en componentes como `StepForm` y utilidades en `src/utils/*.js` (por ejemplo `analytics.js`, `ranking.js`). |
| `2.Clase_control_flujo_funciones_dom.html` | Control de flujo y manejo de eventos | Manejo de eventos en formularios React (`WelcomeScreen`, `StepForm`, `SettingsPanel`), validaciones condicionales y flujos según estado del usuario. |
| `3.Clase_arrays_objetos_json.html` | Arreglos, objetos y JSON | Transformaciones de arreglos de registros en `Dashboard`, `ProgressPage`, `RankingPage`, y serialización de `details` en `registros_diarios`. |
| `4.Clase_instalacion_nvm_node.html` | Entorno Node.js | Backend en `backend/` (Node + Express), scripts `npm start`/`npm run dev`. |
| `5.Clase_modulos_nodejs.html` | Módulos CommonJS/ESM | Organización del backend en módulos (`controllers`, `routes`, `models`, `middleware`) y del frontend en componentes React. |
| `6.Clase_express_basico.html` | Rutas y controladores en Express | Rutas REST en `backend/src/routes/*.js` y controladores en `backend/src/controllers/*.js` (`usuarios`, `registros`, `ranking`, `admin`, `auth`). |
| `7.Clase_reactjs_basico.html` | Componentes y estado en React | Componentes `App`, `Dashboard`, `Achievements`, `WelcomeScreen`, `RankingPage`, `ProgressPage`, manejo de `useState`/`useEffect`. |
| `8.Clase_mensajes_commit.html` | Mensajes de commit profesionales | Historial Git con commits del tipo `feat/fix/refactor/chore: [Leonardo][H2O-1] ...` siguiendo el formato enseñado. |
| `9.Clase_diseno_atomico_react.html` | Componentes reutilizables y diseño atómico | Componentes pequeños y reutilizables en `src/components/` (`AdviceCard`, `DiagnosisCard`, `SettingsPanel`, etc.). |
| `10.Clase_express_typeorm_postgres.html` | API REST con Express + ORM | Backend con **Express + TypeORM + mssql** (`backend/src/config/database.js`, entidades en `backend/src/models/*`, rutas en `backend/src/routes/*`). |
| `11.Clase_promesas_async_await.html` | Promesas, `async/await` | Consumo de la API en `src/services/api.js` usando `async/await` y manejo de errores con `try/catch`. |
| `12.Clase_react_useEffect.html` | `useEffect` y efectos secundarios | Carga de datos y sincronización en `App.jsx`, `RankingPage.jsx`, `ProgressPage.jsx`, `AdminPage.jsx` usando `useEffect`. |
| `13.Clase_express_mongodb.html` | Express + MongoDB | Integración con MongoDB en `backend/src/db/mongodb.js` y modelos asociados (`RankingEntry`, `Racha`) para ranking/rachas. |

Este cuadro sirve como guía rápida en la sustentación para mostrar cómo cada parte del proyecto se apoya en lo visto en clase.

---

### 2. Checklist rúbrica Desarrollo Web (2.1 – 2.4)

#### 2.1 Interfaz ReactJS con CRUD

- **Usuarios** (crear, leer, actualizar, eliminar):
  - Crear / registrar:
    - Invitado/registro: `src/components/WelcomeScreen.jsx` + `api.usuarios.create`.
  - Leer:
    - Perfil en `src/App.jsx` (navbar y paneles), `src/components/SettingsPanel.jsx`.
  - Actualizar:
    - `SettingsPanel` → `api.usuarios.update`.
  - Eliminar:
    - Opción “eliminar cuenta” en `SettingsPanel` → `api.usuarios.delete`.
- **Registros diarios** (crear, leer, eliminar):
  - Crear: `src/components/StepForm.jsx` → `api.registros.create`.
  - Leer: `Dashboard`, `ProgressPage` → `api.registros.getByUsuario` y `getSemanales`.
  - Eliminar: acciones de borrado de registros → `api.registros.delete`.

#### 2.2 Formularios, listados, validaciones y consumo de API

- **Formularios**:
  - `WelcomeScreen` (invitado/login/registro) con validación personalizada (`useFormValidation.js`).
  - `StepForm` para el análisis diario.
  - Formularios de configuración en `SettingsPanel`.
- **Listados**:
  - Historial de registros (Dashboard, ProgressPage).
  - Ranking global (RankingPage).
  - Listado de usuarios y permisos (AdminPage).
- **Validaciones**:
  - Frontend: validaciones de nombre, edad, correo y contraseñas (`WelcomeScreen`).
  - Backend/BD: `CHECK` y SP en `backend/sql/h2o_extras.sql` y constraints en `backend/src/models/*.js`.
- **Consumo de API**:
  - Centralizado en `src/services/api.js` usando `fetch` y `async/await`.

#### 2.3 Uso de Git (commits, ramas, PRs)

- **Commits claros**:
  - Mensajes siguiendo el patrón `tipo: [Leonardo][H2O-1] mensaje descriptivo` (ver `git log`).
- **Trabajo colaborativo / ramas**:
  - Historial incluye commits previos de `Jordan` y un `Merge pull request` existente, demostrando uso de ramas/PRs.
- **Buenas prácticas**:
  - Archivo `.gitignore` correctamente configurado (no se suben `.env` ni `backend/.env`).  

#### 2.4 Consumo de servicios REST desde el frontend

- **Métodos utilizados** (en `src/services/api.js`):
  - `GET`: `/api/health`, `/api/usuarios`, `/api/usuarios/:id`, `/api/registros/usuario/:id`, `/api/ranking`, `/api/admin/summary`, `/api/admin/usuarios`, `/api/rachas/usuario/:id`, etc.
  - `POST`: `/api/usuarios`, `/api/registros`, `/api/ranking`, `/api/auth/login`, `/api/auth/register`.
  - `PUT`: `/api/usuarios/:id` (actualización de perfil).
  - `DELETE`: `/api/usuarios/:id`, `/api/registros/:id`.
  - `PATCH`: `/api/admin/usuarios/:id/role`, `/api/admin/usuarios/:id/permisos` (gestión de roles y permisos).
- **Manejo de respuestas y errores**:
  - Función `request` lanza `Error` con mensaje de la API o código HTTP (líneas 11–19 de `api.js`).
  - El frontend muestra errores y estados usando `sonner` (`toast.error`, `toast.success`) en componentes como `App.jsx`, `WelcomeScreen.jsx`, `AdminPage.jsx`.

Este documento se puede usar como “chuleta” en la defensa para demostrar, criterio por criterio, que el proyecto cumple al 100% con la rúbrica de Desarrollo Web.

