USE EcoWrappedDB;
GO

EXECUTE AS USER = 'etl_reader';
GO

-- Lectura para extracción
SELECT COUNT(*) AS TotalReciclajes FROM dbo.Reciclaje;
SELECT TOP 5 * FROM dbo.AuditOutbox ORDER BY EventId DESC;

-- Debe FALLAR (no escribe OLTP)
DELETE FROM dbo.Reciclaje WHERE ReciclajeId = 1;

REVERT;
GO
