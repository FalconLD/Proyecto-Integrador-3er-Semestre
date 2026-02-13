USE EcoWrappedDB;
GO

EXECUTE AS USER = 'app_reader';
GO

-- Deben funcionar
SELECT TOP 5 * FROM dbo.Usuario;
SELECT TOP 5 * FROM dbo.PuntoRecoleccion;
SELECT TOP 5 * FROM dbo.Reciclaje ORDER BY FechaRegistro DESC;

-- Debe FALLAR (es solo lectura)
UPDATE dbo.Usuario SET Activo = 0 WHERE UsuarioId = 1;

REVERT;
GO
