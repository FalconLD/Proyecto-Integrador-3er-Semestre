USE EcoWrappedDB;
GO

DECLARE @i INT = 1;

WHILE @i <= 50
BEGIN
    INSERT INTO dbo.Usuario (Nombre, Email)
    VALUES (
        CONCAT('Usuario_', @i),
        CONCAT('usuario', @i, '@eco.edu')
    );

    SET @i += 1;
END;
GO
