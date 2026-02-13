USE EcoWrappedDB;
GO

------------------------------------------------------------
-- 1) Deshabilitar trigger para no generar outbox en limpieza
------------------------------------------------------------
DISABLE TRIGGER dbo.trg_Reciclaje_AuditOutbox ON dbo.Reciclaje;
GO

------------------------------------------------------------
-- 2) Limpiar tablas dependientes (se puede TRUNCATE)
------------------------------------------------------------
TRUNCATE TABLE dbo.AuditOutbox;
GO

TRUNCATE TABLE dbo.Reciclaje;
GO

------------------------------------------------------------
-- 3) Limpiar catálogos referenciados por FK (NO se puede TRUNCATE)
--    Se usa DELETE + reseed del IDENTITY
------------------------------------------------------------
DELETE FROM dbo.Usuario;
GO
DBCC CHECKIDENT ('dbo.Usuario', RESEED, 0);
GO

DELETE FROM dbo.PuntoRecoleccion;
GO
DBCC CHECKIDENT ('dbo.PuntoRecoleccion', RESEED, 0);
GO

------------------------------------------------------------
-- 4) Verificación
------------------------------------------------------------
SELECT COUNT(*) AS Usuarios     FROM dbo.Usuario;
SELECT COUNT(*) AS Puntos       FROM dbo.PuntoRecoleccion;
SELECT COUNT(*) AS Reciclajes   FROM dbo.Reciclaje;
SELECT COUNT(*) AS AuditEventos FROM dbo.AuditOutbox;
GO
