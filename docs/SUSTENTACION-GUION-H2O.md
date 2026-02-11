## Guion técnico de sustentación – Proyecto Integrador H2O

Este guion está pensado para una sustentación de **10–15 minutos**, enfocado en los criterios de la rúbrica (BD, Desarrollo Web y Proyectos de Software).

---

### 1. Introducción (1–2 min)

- Presentación rápida del equipo y del proyecto H2O.
- Problema que resuelve: concienciar sobre el consumo de agua de los estudiantes, dando métricas diarias/semanales y ranking anónimo.
- Tecnologías principales:
  - Frontend: **React + Vite**.
  - Backend: **Node.js + Express + TypeORM**.
  - Bases de datos: **Azure SQL (transaccional)** + **MongoDB (analítica ligera)**.

---

### 2. Arquitectura general (2–3 min)

1. Explicar el diagrama general (puedes apoyarte en el ER y en un diagrama de capas):
   - Cliente React (`src/`).
   - API REST en Express (`backend/src/express.js`, rutas en `backend/src/routes/*`). 
   - Azure SQL como fuente de verdad (`usuarios`, `registros_diarios`, `auditoria`, vistas y SPs).
   - MongoDB para ranking/rachas (si lo mencionan en la demo).
2. Resaltar:
   - Uso de **ORM TypeORM** para mapear entidades (`backend/src/models/*.js`).
   - Uso de **JWT** y middleware de permisos para el panel admin.

---

### 3. Flujo funcional (3–4 min)

Mostrar la aplicación en vivo mientras explicas los flujos principales.

1. **Modo invitado**:
   - `WelcomeScreen`: ingreso rápido con nombre, edad y correo sin contraseña.
   - Se crea o busca usuario en Azure SQL y se guarda en localStorage.
2. **Usuario registrado (login/registro)**:
   - Registro con correo + contraseña → se guarda `passwordHash` y rol `user` en tabla `usuarios`.
   - Login con JWT → el frontend recibe `token`, `role`, `permisos` vía `AuthContext`.
3. **Registro diario y métricas**:
   - `StepForm` crea registros diarios (`registros_diarios`) mediante la API.
   - `Dashboard`, `ProgressPage`, `RankingPage` muestran métricas personales y globales.
4. **Panel Administrador**:
   - Solo visible si el usuario tiene permiso (`ver_panel_admin`/`ver_estadisticas_avanzadas`). 
   - Muestra métricas globales y permite gestionar usuarios (rol y permisos) usando endpoints `/api/admin/*`.

---

### 4. Bases de Datos y seguridad (3–4 min)

1. **Modelo de datos (ER)**:
   - Explicar brevemente entidades clave: `usuarios`, `registros_diarios`, `registros_semanales`, `auditoria`.
   - Comentar claves primarias/foráneas y cómo garantizan integridad.
2. **Validaciones y reglas en BD**:
   - `CHECK` en `usuarios.edad` y `registros_diarios.total`.
   - SPs en `backend/sql/h2o_extras.sql` (`sp_ResumenUsuarioH2O`, `sp_TopUsuariosEficientesH2O`, `sp_InsertRegistroSeguroH2O`).
   - Mencionar el uso de **transacciones** en `sp_InsertRegistroSeguroH2O` (`BEGIN TRAN/COMMIT/ROLLBACK`). 
3. **Reportes (vistas)**:
   - `vw_ResumenUsuarioH2O` y `vw_TopUsuariosEficientesH2O` como vistas complejas para análisis global.
   - Cómo se relacionan con el panel admin y los indicadores globales.
4. **Seguridad**:
   - Conexión cifrada a Azure SQL, firewall, `.env` fuera del repo.
   - Hash de contraseñas (`passwordHash`), JWT en backend y chequeo de permisos en middleware.
   - Auditoría de operaciones sensibles en tabla `auditoria` + trigger de auditoría.

---

### 5. Desarrollo Web y buenas prácticas (2–3 min)

- **React y UX**:
  - Componentes reutilizables (`Dashboard`, `Achievements`, `Ranking`, `SettingsPanel`).
  - Formulario con validaciones (`WelcomeScreen`, `StepForm`) y manejo de estado con hooks.
- **Consumo de API REST**:
  - Mostrar `src/services/api.js` como capa única para `GET/POST/PUT/DELETE/PATCH`.
  - Manejo de errores y estados de carga con `toast` y estados de React.
- **Git y commits**:
  - Comentar uso de commits tipo `feat/fix/refactor/chore: [Leonardo][H2O-1] ...` acorde a la clase de mensajes de commit.

---

### 6. Cierre (1–2 min)

- Resumir los puntos fuertes:
  - Integración real entre BD, backend y frontend.
  - Seguridad y auditoría cuidada.
  - Alineación clara con las clases de Desarrollo Web y BD II.
- Mencionar posibles mejoras futuras (solo si hay tiempo): despliegue completo en Azure, más métricas, mejoras de UI, etc.

---

## Preguntas típicas y respuestas sugeridas

### P1. ¿Por qué eligieron Azure SQL y no otra base de datos?

- **Respuesta corta:**  
  Porque necesitamos un motor relacional con integridad fuerte, soporte a stored procedures, triggers y auditoría, administrado en la nube. Azure SQL cumple todo eso y se integra bien con el stack de clases (TypeORM + mssql).  
  Además, nos permite usar características avanzadas como vistas, SPs y transacciones ACID para cumplir exactamente lo que pide la rúbrica de Bases de Datos II.

### P2. ¿Cómo se asegura la integridad y validación de datos?

- Validamos en **tres niveles**:
  1. **Frontend**: validaciones de formularios (edad, correo, contraseñas) en React.
  2. **Backend**: controladores verifican parámetros requeridos y tipos antes de guardar.
  3. **Base de datos**: `CHECK`, `UNIQUE`, constraints y SP `sp_InsertRegistroSeguroH2O` que valida usuario y rangos, ahora con transacciones explícitas para evitar inconsistencias.

### P3. ¿Dónde se ve la auditoría de cambios?

- En la tabla `auditoria` de Azure SQL, donde se registran operaciones importantes (INSERT/DELETE de registros y otros cambios).  
- Además, tenemos un trigger `trg_registros_diarios_auditoria` que registra automáticamente las inserciones/eliminaciones sobre `registros_diarios`.  
- El backend también hace auditoría adicional en algunas operaciones críticas a través de `logAuditoria`.

### P4. ¿Qué reportes relevantes implementaron y cómo están hechos?

- Reportes principales:
  - **Resumen por usuario**: consumo promedio, mínimo y máximo (`sp_ResumenUsuarioH2O` y `vw_ResumenUsuarioH2O`).
  - **Top usuarios eficientes**: ranking de usuarios con menor consumo (`sp_TopUsuariosEficientesH2O` y `vw_TopUsuariosEficientesH2O`).  
- Estos se conectan conceptualmente con el **panel Admin**, donde se muestran métricas globales y ranking.

### P5. ¿Cómo se relaciona el proyecto con las clases de Desarrollo Web?

- React y hooks (`useState`, `useEffect`) → clases de React básico y useEffect.
- Express + TypeORM + Azure SQL → clase de Express con ORM y base de datos.
- Integración con MongoDB → clase de Express + MongoDB.
- Commits con formato estándar → clase de mensajes de commit.  
- Toda esta relación está detallada en `docs/DESARROLLO-WEB-RUBRICA.md`, que usamos como guía para la sustentación.

### P6. ¿Qué harían diferente si tuvieran más tiempo?

- Desplegar todo el sistema en Azure (App Service/Static Web Apps + CI/CD).
- Mejorar la UI con más visualizaciones (gráficas avanzadas) y accesibilidad.
- Añadir más reglas de negocio y alertas (por ejemplo, notificaciones cuando el consumo supere cierto umbral).

Con este guion y las respuestas preparadas, deberías poder cubrir de forma clara y técnica todos los criterios evaluados en la rúbrica durante la sustentación.

