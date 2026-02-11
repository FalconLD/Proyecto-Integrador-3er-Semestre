## Checklist Proyectos de Software – Proyecto Integrador H2O

Este documento sirve como guía para verificar que la **documentación externa** (Confluence, Jira, etc.) cumple al 100% con el criterio 3 de la rúbrica.

---

### 3.1 Casos de uso y mockups

**Requisitos de la rúbrica:**

- El software cuenta con **diagramas de casos de uso generales y extendidos**.
- Incluye **MockUps** que aporten a la comprensión del mismo.

**Checklist a verificar en Confluence (o herramienta equivalente):**

- [ ] Diagrama de casos de uso general del sistema H2O, con al menos estos actores:
  - Invitado (modo prueba sin contraseña).
  - Usuario registrado.
  - Administrador.
- [ ] Diagramas de casos de uso **extendidos** para:
  - Registro/Inicio de sesión y gestión de perfil.
  - Registro de consumo diario y visualización de métricas.
  - Panel Administrador (gestión de usuarios, roles, permisos y métricas globales).
- [ ] Mockups de las pantallas principales:
  - Welcome / Login / Registro.
  - Dashboard y formulario de análisis diario.
  - Ranking y página de progreso.
  - Panel Admin (resumen, listado de usuarios, edición de permisos).
  - Pantalla de configuración (`SettingsPanel`).  

---

### 3.2 Implementación de Scrum

**Requisitos de la rúbrica:**

- Implementa Scrum de manera completa, definiendo roles, eventos y artefactos.

**Checklist a verificar en la documentación del equipo:**

- **Roles definidos:**
  - [ ] Product Owner identificado.
  - [ ] Scrum Master identificado.
  - [ ] Development Team (todos los miembros).  
- **Eventos documentados (por sprint):**
  - [ ] Sprint Planning (objetivo de sprint, backlog seleccionado).
  - [ ] Daily Scrum (frecuencia, formato/resumen).
  - [ ] Sprint Review (qué se demostró en cada sprint).
  - [ ] Sprint Retrospective (qué mejorar, acuerdos).  
- **Artefactos:**
  - [ ] Product Backlog (lista priorizada de historias/épicas del proyecto H2O).
  - [ ] Sprint Backlogs por sprint (tareas concretas comprometidas).
  - [ ] Incrementos claros al final de cada sprint (qué quedó “Done”).  

---

### 3.3 Configuración y uso de Jira

**Requisitos de la rúbrica:**

- Configura y usa Jira para gestión de tareas, asignación, priorización, estimación y seguimiento.

**Checklist a verificar en Jira:**

- **Configuración general:**
  - [ ] Proyecto Jira creado para H2O (con clave tipo `H2O` o similar).
  - [ ] Workflow claro (por ejemplo: `Backlog → To Do → In Progress → In Review → Done`).  
- **Issues y tareas:**
  - [ ] Historias o tareas creadas para las funcionalidades principales (por ejemplo `H2O-1` roles y permisos, `H2O-2` ranking, etc.).
  - [ ] Cada issue con:
    - Asignado responsable.
    - Prioridad.
    - Estimación (story points o tiempo).
    - Estado actualizado (no todo en “To Do”).  
- **Tablero (board):**
  - [ ] Kanban o Scrum board activo mostrando claramente las columnas de flujo.
  - [ ] Evidencia de movimiento de tareas durante los sprints (no todo creado el último día).  

---

### Cómo usar este checklist

1. Revisa cada apartado con tu equipo frente a Confluence y Jira abiertos.
2. Marca lo que ya está completo y anota qué falta crear o mejorar.
3. Asegúrate de que, al finalizar, **cada ítem esté cubierto con evidencia clara**, de forma que durante la sustentación puedan navegar:
   - Desde la rúbrica → al documento correspondiente en Confluence/Jira.
   - Desde un issue (por ejemplo `H2O-1`) → al commit o funcionalidad implementada en el código.  

Con este checklist completado, el criterio 3 de Proyectos de Software quedará totalmente respaldado para la evaluación.

