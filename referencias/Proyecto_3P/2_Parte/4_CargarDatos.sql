USE EcoWrappedDB;
GO

EXECUTE AS USER = 'etl_writer';
GO

DECLARE @N INT = 5000;

;WITH Numeros AS (
    SELECT TOP (@N) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.all_objects a
    CROSS JOIN sys.all_objects b
)
INSERT INTO dbo.Reciclaje
(
    UsuarioId,
    PuntoId,
    FechaRegistro,
    CantidadBotellas,
    PesoKg,
    TipoMaterial,
    EsValido
)
SELECT
    (SELECT TOP 1 UsuarioId FROM dbo.Usuario WHERE Activo = 1 ORDER BY NEWID()),
    (SELECT TOP 1 PuntoId FROM dbo.PuntoRecoleccion WHERE Activo = 1 ORDER BY NEWID()),
    DATEADD(
        MINUTE,
        ABS(CHECKSUM(NEWID())) % (90 * 24 * 60),
        DATEADD(DAY, -90, SYSDATETIME())
    ),
    (ABS(CHECKSUM(NEWID())) % 15) + 1,
    CAST(((ABS(CHECKSUM(NEWID())) % 591) + 10) / 100.0 AS DECIMAL(6,2)),
    CASE (ABS(CHECKSUM(NEWID())) % 3)
        WHEN 0 THEN 'PET'
        WHEN 1 THEN 'Vidrio'
        ELSE 'Aluminio'
    END,
    CASE WHEN (ABS(CHECKSUM(NEWID())) % 100) < 98 THEN 1 ELSE 0 END
FROM Numeros;
GO

REVERT;
GO
