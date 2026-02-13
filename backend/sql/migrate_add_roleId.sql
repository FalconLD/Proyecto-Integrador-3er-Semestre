-- Migración: añadir columna roleId a usuarios (para roles y permisos)
-- Ejecutar si el login falla con "Invalid column name 'roleId'"
-- En Azure SQL / SSMS: ejecutar contra tu base de datos (ej. h2o-db)

-- 1. Añadir columna roleId a usuarios si no existe
IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('dbo.usuarios') AND name = 'roleId'
)
BEGIN
  ALTER TABLE dbo.usuarios
  ADD roleId INT NULL;
  PRINT 'Columna roleId añadida a usuarios.';
END
ELSE
  PRINT 'Columna roleId ya existe en usuarios.';
GO

-- 2. (Opcional) Si la tabla roles existe, crear FK. Si usas TypeORM synchronize, las tablas roles/permisos_catalogo/role_permisos se crean solas al arrancar el backend.
-- Si prefieres no tocar FKs, TypeORM puede crear la relación al tener la columna roleId.
-- Descomenta solo si la tabla roles ya existe y quieres la FK a nivel BD:
/*
IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_usuarios_roles'
  )
  BEGIN
    ALTER TABLE dbo.usuarios
    ADD CONSTRAINT FK_usuarios_roles
    FOREIGN KEY (roleId) REFERENCES dbo.roles(id);
    PRINT 'FK usuarios.roleId -> roles.id creada.';
  END
END
GO
*/
