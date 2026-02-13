USE EcoWrappedDB;
GO
EXECUTE AS USER = 'app_reader';
GO

SELECT TOP 1 * FROM dbo.Usuario;
SELECT TOP 1 * FROM dbo.PuntoRecoleccion;
SELECT TOP 1 * FROM dbo.Reciclaje;

REVERT;
GO
