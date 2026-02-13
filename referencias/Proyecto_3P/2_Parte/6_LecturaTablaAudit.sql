USE EcoWrappedDB;
GO

EXECUTE AS USER = 'app_reader';
GO
SELECT TOP 5 * FROM dbo.AuditOutbox ORDER BY EventId DESC; -- ¿debería fallar o funcionar?
REVERT;
GO
