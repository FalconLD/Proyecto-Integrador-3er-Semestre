# Proyecto Integrador H2O

Aplicación web para seguimiento de consumo de agua (H2O), con panel de administración, roles y permisos. Frontend en React + Vite; backend en Node.js + Express + TypeORM (Azure SQL).

## Estructura del proyecto

```
├── frontend/          # App React (Vite) – interfaz de usuario
├── backend/           # API Node/Express – TypeORM, Azure SQL, MongoDB (ranking/rachas)
├── docs/              # Documentación del proyecto (se generará al finalizar)
├── referencias/       # Material de referencia (clases Desarrollo Web, etc.)
├── package.json       # Scripts de conveniencia desde la raíz
└── README.md
```

- **frontend:** `cd frontend && npm run dev` — desarrollo; `npm run build` — build de producción. Opcional: copiar `frontend/.env.example` a `frontend/.env` y definir `VITE_API_URL` si la API no está en `http://localhost:3001`.
- **backend:** `cd backend && npm run dev` — desarrollo; `npm start` — producción. Requiere `.env` con variables de BD (ver `backend/.env.example` si existe).
- **referencias:** Material de apoyo (p. ej. [referencias/Desarrollo web/](referencias/) con clases HTML); no forma parte del build ni del runtime.

## Comandos desde la raíz

- `npm run dev:frontend` — inicia el frontend en modo desarrollo.
- `npm run dev:backend` — inicia el backend en modo desarrollo.
- `npm run build:frontend` — genera el build del frontend en `frontend/dist`.
- `npm run start:backend` — inicia el backend en modo producción.

Para trabajar con la app, abre dos terminales: una para `npm run dev:backend` y otra para `npm run dev:frontend`.

## Documentación

La carpeta `docs/` está reservada para la documentación del proyecto (arquitectura, rúbrica, guiones de sustentación, etc.), que se generará cuando se finalicen las configuraciones y modificaciones.

## Tecnologías

- **Frontend:** React 19, Vite 7, Tailwind CSS, React Router, Framer Motion.
- **Backend:** Node.js, Express, TypeORM (Azure SQL), MongoDB (ranking/rachas), JWT.
