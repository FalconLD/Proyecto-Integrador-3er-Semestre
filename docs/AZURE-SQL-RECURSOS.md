# Recursos Azure SQL - Proyecto Integrador H2O

**Fecha de revisión:** Febrero 2026  
**Suscripción:** Azure for Students

---

## 0. Nuevo grupo de recursos H2O Integrador (2026-02-11)

| Recurso | Valor |
|---------|-------|
| **Grupo** | rg-h2o-integrador |
| **Región** | canadacentral |
| **Servidor SQL** | sql-h2o-integrador-lf |
| **Base de datos** | h2o-db (Basic) |
| **Usuario admin** | sqladmin |
| **FQDN** | sql-h2o-integrador-lf.database.windows.net |

**Backend:** `backend/` - Express + TypeORM + mssql (Azure SQL)

---

## 1. Resumen de recursos existentes (Puce-DB)

### Suscripción
| Campo | Valor |
|-------|-------|
| **Nombre** | Azure for Students |
| **ID** | 81197ad3-7966-494e-a2b3-c6a5457b3cc4 |
| **Crédito** | $100 USD por 12 meses |

### Grupos de recursos
- `rg-sentinel-recycle` (canadacentral)
- `Puce-DB` (canadacentral) ← **Contiene el servidor SQL**
- `Automation_Project` (canadacentral)

---

## 2. Servidor Azure SQL

| Campo | Valor |
|-------|-------|
| **Nombre** | puce-bdd-server-lf |
| **Grupo de recursos** | Puce-DB |
| **Región** | canadacentral |
| **FQDN** | puce-bdd-server-lf.database.windows.net |
| **Administrador** | FalconLD |
| **Estado** | Ready |

Este servidor fue creado durante las clases de Bases de Datos en la PUCE.

---

## 3. Bases de datos existentes

| Base de datos | SKU | Estado | Uso recomendado |
|---------------|-----|--------|-----------------|
| `master` | GP_SYSTEM | Online | Sistema (no usar) |
| `puce-bdd` | GP_S_Gen5_2 | **Pausada** | Clase anterior |
| `puce-bdd-prueba-lf` | GP_S_Gen5_2 | **Pausada** | Pruebas de clase |

### Sobre las bases pausadas
- **Cuando están pausadas:** solo consumen almacenamiento (coste mínimo).
- **Cuando se reanudan:** vuelven a consumir créditos por proceso.
- Por eso tus ejercicios de clase no generaron costos evidentes: las bases pasaron mucho tiempo pausadas.

---

## 4. Reglas de firewall

Tu IP actual (**45.162.74.4**) ya está permitida con la regla **"Home"**.

Otras reglas: PUCE, Colab, máquinas del taller, etc.

---

## 5. Opciones para el Proyecto Integrador H2O

### Opción A: Usar una base existente (recomendada)
1. Reanudar `puce-bdd-prueba-lf` o `puce-bdd` desde Azure Portal.
2. Crear en ella las tablas del proyecto H2O.
3. Al terminar, pausar de nuevo para reducir coste.

### Opción B: Crear una base nueva
1. Crear una base nueva `h2o-integrador` en el servidor `puce-bdd-server-lf`.
2. Usar tier **Basic** para menor coste (~$5/mes).

---

## 6. Cadena de conexión

Formato (reemplaza `[PASSWORD]` con tu contraseña real):

```
Server=tcp:puce-bdd-server-lf.database.windows.net,1433;Initial Catalog=puce-bdd-prueba-lf;Persist Security Info=False;User ID=FalconLD;Password=[PASSWORD];MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

Para Node.js / TypeORM (formato ADO.NET adaptado):
```
Server=puce-bdd-server-lf.database.windows.net;Database=puce-bdd-prueba-lf;User Id=FalconLD;Password=[PASSWORD];Encrypt=true;
```

---

## 7. Comandos útiles (Azure CLI)

### Reanudar una base pausada
```bash
az sql db resume --resource-group Puce-DB --server puce-bdd-server-lf --name puce-bdd-prueba-lf
```

### Pausar una base (para ahorrar créditos)
```bash
az sql db pause --resource-group Puce-DB --server puce-bdd-server-lf --name puce-bdd-prueba-lf
```

### Crear una base nueva (tier Basic)
```bash
az sql db create `
  --resource-group Puce-DB `
  --server puce-bdd-server-lf `
  --name h2o-integrador `
  --service-objective Basic
```

### Agregar regla de firewall (si cambias de red)
```bash
az sql server firewall-rule create `
  --resource-group Puce-DB `
  --server puce-bdd-server-lf `
  --name MiNuevaIP `
  --start-ip-address TU_IP `
  --end-ip-address TU_IP
```

---

## 8. Sobre los créditos (Azure for Students)

- **$100 USD** durante 12 meses.
- Todo lo que uses se descuenta de ese crédito.
- No hay servicio SQL “gratuito ilimitado”, pero:
  - Las bases **pausadas** gastan muy poco.
  - Puedes consultar el saldo en: [Azure Sponsorships portal](https://www.microsoftazuresponsorships.com/).

---

## 9. Próximos pasos sugeridos

1. Reanudar `puce-bdd-prueba-lf` (o elegir otra base).
2. Definir y crear el modelo de datos (tablas) del proyecto H2O.
3. Configurar el backend (Express + TypeORM) con la cadena de conexión.
4. Cuando no la uses, pausar la base para conservar créditos.

---

## 10. Plan de seguridad (resumen)

- **Principio de mínimo privilegio**:
  - Usar una cuenta de aplicación con permisos limitados (`db_datareader`, `db_datawriter`) y NO la cuenta de administrador para la API.
  - Mantener las credenciales en `.env` y **no** subirlas al repositorio.
- **Cifrado y red**:
  - Conexiones siempre con `Encrypt=True` y `TrustServerCertificate=False` (ya configurado en `database.js`).
  - Limitar IPs en el firewall del servidor SQL (solo tu IP + Azure Services si es necesario).
- **Integridad de datos**:
  - CHECKs en `usuarios.edad` y `registros_diarios.total` para evitar datos inválidos (ver `backend/sql/h2o_extras.sql`).
  - Triggers de auditoría para registrar inserciones/eliminaciones sensibles.
- **Auditoría**:
  - Tabla `auditoria` en Azure SQL para registrar operaciones importantes (INSERT/DELETE de registros, cambios de usuario).
  - Uso combinado de auditoría desde la API y desde triggers T‑SQL.
- **Operación diaria**:
  - Pausar bases que no se usen para evitar gasto innecesario.
  - Revisar periódicamente los logs de auditoría y el panel admin del proyecto H2O.
