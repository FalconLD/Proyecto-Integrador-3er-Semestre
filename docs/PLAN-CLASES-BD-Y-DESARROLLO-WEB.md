# Plan ampliado: clases (BD + Desarrollo Web) y rúbrica

Este documento integra **todas las características** que aparecen en las clases del semestre (Base de Datos en `referencias/Proyecto_3P/` y Desarrollo Web en `referencias/Desarrollo web/`) con lo que el proyecto H2O debe aplicar, **incluyendo** lo que va más allá de la rúbrica de evaluación pero forma parte de la implementación vista en clase.

---

## 1. Base de datos (Proyecto_3P)

### 1.1 Inventario de características por partes

| Parte | Archivos / tema | Característica | En H2O |
|-------|-----------------|----------------|--------|
| **1_Parte** | `1_CrearBDD.sql`, `2_CrearTablas.sql` | BD + tablas con PK, FK, CHECK, UNIQUE, DEFAULT | ✅ Esquema con usuarios, registros_diarios, auditoria, roles, etc. |
| **1_Parte** | `3_CrearIndices.sql` | Índices en columnas de búsqueda/filtro (fecha, usuarioId, etc.) | ⚠️ Revisar: índices en `registros_diarios(fecha, usuarioId)` y tablas relacionadas |
| **1_Parte** | `5_SP.sql` | SP con validaciones de negocio + BEGIN TRAN / COMMIT / ROLLBACK | ✅ `sp_InsertRegistroSeguroH2O` existe; ⚠️ **usar desde la API** en lugar de INSERT directo |
| **1_Parte** | `7_CrearTablaAudit.sql` | Tabla de auditoría (EventId, EntityName, Operation, PayloadJson, etc.) | ✅ Tabla `auditoria`; Proyecto_3P usa estilo “outbox” (PayloadJson, SentToMongo). Opcional: alinear formato si se quiere ETL |
| **1_Parte** | `8_Trigger.sql` | Trigger AFTER **INSERT, UPDATE, DELETE** con detección de operación y payload JSON | ⚠️ Trigger actual solo INSERT/DELETE; **añadir UPDATE** |
| **1_Parte** | `102–105` | Roles en BD: role_app_writer, role_app_reader, role_etl_reader | ❌ No implementado (H2O usa un solo usuario de app; opcional para el curso) |
| **1_Parte** | `104_ConcederPermisosRoles.sql` | Writer: solo EXECUTE en SP; DENY INSERT/UPDATE/DELETE directo. Reader: solo SELECT | ❌ Depende de roles en BD |
| **2_Parte** | `5_1_app_writer.sql`, `5_2_app_reader.sql` | Probar con EXECUTE AS USER (writer ejecuta SP; reader solo SELECT) | ❌ Si no hay roles en BD, no aplica |
| **3_Parte** | `1_3_Enmascaramiento.sql` | MASKED WITH (ej. email) para columnas sensibles | ❌ No aplicado; opcional en `usuarios.email` si se usa Azure SQL con usuarios diferenciados |
| **4_Parte** | `2_VistaAzure.sql` | Vistas para reportes (resumen por fecha/punto) | ✅ `vw_ResumenUsuarioH2O`, `vw_TopUsuariosEficientesH2O` |
| **4_Parte** | `1_VerificarPermisosRead.sql`, `4_1` | Permisos de lectura y usuario ETL (UNMASK revocado para ETL) | ❌ Opcional; ligado a roles y enmascaramiento |

### 1.2 Resumen BD: qué aplicar sí o sí vs opcional

- **Sí o sí (alineado con rúbrica y clases):**
  1. **Usar `sp_InsertRegistroSeguroH2O`** desde el controller de registros (no `repository.save()` directo).
  2. **Trigger de auditoría:** incluir **UPDATE** además de INSERT y DELETE (mismo estilo que Proyecto_3P).
  3. **Resumen admin:** apoyarse en vistas/SP (ej. `vw_TopUsuariosEficientesH2O` o `sp_TopUsuariosEficientesH2O`) donde aplique.
  4. **Índices:** tener al menos índices sobre `registros_diarios(usuarioId, fecha)` (y similares si hay más consultas frecuentes).

- **Opcional (clases avanzadas / tiempo disponible):**
  - Roles en BD (app_writer / app_reader / etl_reader) y conexión con usuarios SQL.
  - Enmascaramiento en columnas sensibles (ej. email).
  - Tabla de auditoría tipo “outbox” con PayloadJson y bandera SentToMongo para ETL.

---

## 2. Desarrollo Web (clases en `referencias/Desarrollo web/`)

### 2.1 Inventario por clase

| Clase | Tema | Característica | En H2O |
|-------|------|----------------|--------|
| 1 | Fundamentos JS | Variables, tipos, funciones, DOM | ✅ Lógica en frontend y backend en JS |
| 2 | Control de flujo, funciones, DOM | Condicionales, bucles, manipulación DOM | ✅ React reemplaza DOM directo; lógica en componentes |
| 3 | Arrays, objetos, JSON | Estructuras de datos, JSON.parse/stringify | ✅ APIs devuelven JSON; uso de objetos/arrays en estado |
| 4 | NVM, Node | Entorno Node, módulos | ✅ Backend Node, package.json |
| 5 | Módulos Node | require/module.exports, organización | ✅ Backend con estructura de carpetas y módulos |
| 6 | Express básico | Rutas, middleware, API REST, JSON | ✅ Express, rutas en `/api/*`, middleware (auth, permisos) |
| 7 | React básico | Componentes, estado, props | ✅ Frontend React (frontend/) |
| 8 | Mensajes commit | Buenas prácticas de commits | ✅ Repo git; aplicar en commits de este plan |
| 9 | Diseño atómico React | Componentes reutilizables, composición | ⚠️ Revisar estructura de componentes (atómicos vs páginas) |
| 10 | Express + TypeORM + Postgres | Arquitectura limpia: config, models, controllers, routes, middleware | ✅ Backend con config, models, controllers, routes, middleware; TypeORM con Azure SQL |
| 11 | Promesas, async/await | Llamadas asíncronas, manejo de errores | ✅ Uso de async/await en controllers y servicios |
| 12 | React useEffect | Efectos, llamadas API, dependencias | ✅ Uso de useEffect donde corresponde en frontend |
| 13 | Express + MongoDB | Mongoose, esquemas, colecciones, rutas CRUD | ✅ MongoDB para ranking/rachas; modelos y rutas propias |

### 2.2 Resumen Desarrollo Web: qué reforzar

- **Ya aplicado:** Express, TypeORM (Azure SQL), MongoDB (ranking), React, async/await, useEffect, estructura backend (config, models, controllers, routes, middleware), auth y permisos por rol en la API.
- **Reforzar / revisar:**
  - **Diseño atómico (clase 9):** que los componentes del frontend sigan una jerarquía clara (átomos → moléculas → organismos/páginas) donde tenga sentido.
  - **Mensajes de commit (clase 8):** usar mensajes descriptivos en los commits de este plan (ej. “feat(api): usar SP para crear registro diario”).

---

## 3. Plan de implementación unificado

Orden sugerido para implementar **sin** incluir documentación extra (según tu petición).

### Fase 1 – Base de datos (rúbrica + clases)

1. **Registros diarios vía SP**  
   - En `registrosController.crear`, dejar de usar `repository.save()` y llamar a `sp_InsertRegistroSeguroH2O` (parámetros: usuarioId, fecha, total, virtualTotal, details).  
   - Opcional: después de ejecutar el SP, leer el registro recién insertado (por usuarioId + fecha) para devolverlo en la respuesta.

2. **Trigger de auditoría con UPDATE**  
   - En `backend/sql/h2o_extras.sql`, ampliar `trg_registros_diarios_auditoria` para que en **AFTER INSERT, UPDATE, DELETE** detecte la operación (inserted/deleted) y escriba en `auditoria` con operación 'UPDATE' cuando corresponda.

3. **Resumen del panel admin con vistas/SP**  
   - En `adminController.resumen`, usar la vista `vw_TopUsuariosEficientesH2O` o el SP `sp_TopUsuariosEficientesH2O` para el “top eficientes” en lugar de (o además de) cálculos solo en código.  
   - Si se añade un SP de resumen global (ej. total usuarios, total registros, promedios), usarlo para las métricas globales.

4. **Índices**  
   - Añadir en `h2o_extras.sql` (o script de migración) índices recomendados, por ejemplo:
     - `registros_diarios (usuarioId, fecha)`
     - `auditoria (usuarioId, fecha)` si se consulta por usuario y tiempo.

### Fase 2 – Opcional (más clases BD)

5. **Roles en BD y permisos**  
   - Crear roles tipo `role_app_writer` / `role_app_reader` y usuario(s) SQL; conceder EXECUTE solo al SP de inserción al writer y DENY INSERT/UPDATE/DELETE directo; GRANT SELECT a readers.  
   - Requiere que la app se conecte con un usuario “writer” para escritura y, si hay ETL, un usuario “reader” con solo SELECT.

6. **Enmascaramiento**  
   - Si se usan usuarios con distintos permisos en Azure SQL, aplicar MASKED WITH en columnas sensibles (ej. `usuarios.email`) y revocar UNMASK para el rol que no debe ver datos crudos.

### Fase 3 – Desarrollo Web (revisión)

7. **Diseño atómico**  
   - Revisar `frontend/src`: identificar componentes que puedan extraerse como átomos reutilizables (botones, inputs, tarjetas) y asegurar que las páginas estén compuestas por moléculas/organismos que usen esos átomos.

8. **Commits**  
   - Aplicar mensajes claros (feat, fix, refactor) en los cambios de este plan.

---

## 4. Dónde está cada cosa en el repo

- **Referencias BD:** `referencias/Proyecto_3P/` (1_Parte a 4_Parte).  
- **Referencias Desarrollo Web:** `referencias/Desarrollo web/` (1–13 clases HTML).  
- **SQL H2O (extras):** `backend/sql/h2o_extras.sql` (CHECK, trigger, SP, vistas).  
- **Controllers:** `backend/src/controllers/registrosController.js`, `adminController.js`.  
- **Frontend:** `frontend/src/` (componentes y páginas).

Con este plan se cubren tanto los requisitos de la rúbrica como las características vistas en las clases de Base de Datos y Desarrollo Web que deben reflejarse como datos o partes de la implementación del proyecto H2O.

Si añades más carpetas de clases de base de datos (u otros materiales) en `referencias/`, se puede ampliar este documento con la misma lógica: inventario de características por archivo/clase y columna "En H2O" (aplicado / pendiente / opcional).

---

## 5. Estado de implementación (aplicado en código)

- **Registros diarios vía SP:** `registrosController.crear` llama a `sp_InsertRegistroSeguroH2O`; si el SP no existe, hace fallback a `repository.save()`.
- **Trigger de auditoría:** `h2o_extras.sql` incluye `trg_registros_diarios_auditoria` para AFTER INSERT, UPDATE, DELETE.
- **Resumen admin:** `adminController.resumen` usa `sp_TopUsuariosEficientesH2O` para `topUsuarios`; si falla, usa cálculo en código.
- **Índices:** en `h2o_extras.sql`: `IX_registros_diarios_usuarioId_fecha`, `IX_registros_diarios_fecha`, `IX_auditoria_usuarioId_fecha`.
- **Aplicar SQL en BD:** ejecutar `npm run run-extras` en `backend/` o el script `backend/sql/h2o_extras.sql` en Azure SQL (por lotes separados por GO).
