-- Lectura con dbo

USE EcoWrappedDB;
GO

SELECT TOP 5 UsuarioId, Nombre, Email
FROM dbo.Usuario
ORDER BY UsuarioId;

-- Lectura con app_reader

USE EcoWrappedDB;
GO

EXECUTE AS USER = 'app_reader';
GO

SELECT TOP 5 UsuarioId, Nombre, Email
FROM dbo.Usuario
ORDER BY UsuarioId;

REVERT;
GO

-- Lectura con etl_reader

EXECUTE AS USER = 'etl_reader';
GO

SELECT TOP 5 UsuarioId, Email
FROM dbo.Usuario;

REVERT;
GO

-- Conceder desenmascaramiento

GRANT UNMASK TO etl_reader;

USE EcoWrappedDB;
GO

-- Denegar desenmascaramiento

REVOKE UNMASK FROM etl_reader;
GO