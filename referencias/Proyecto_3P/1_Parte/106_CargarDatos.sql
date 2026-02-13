EXECUTE AS USER = 'etl_writer';
GO

USE EcoWrappedDB;
GO

DECLARE @N INT = 5000;   -- Cambia a 10000, 20000, etc.
DECLARE @i INT = 0;

;WITH Numeros AS (
    SELECT TOP (@N) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.all_objects a
    CROSS JOIN sys.all_objects b
)
INSERT INTO dbo.Reciclaje (UsuarioId, PuntoId, FechaRegistro, CantidadBotellas, PesoKg, TipoMaterial, EsValido)
SELECT
    -- Usuario aleatorio entre los activos
    (SELECT TOP 1 UsuarioId FROM dbo.Usuario WHERE Activo = 1 ORDER BY NEWID()) AS UsuarioId,

    -- Punto aleatorio entre los activos
    (SELECT TOP 1 PuntoId FROM dbo.PuntoRecoleccion WHERE Activo = 1 ORDER BY NEWID()) AS PuntoId,

    -- Fecha aleatoria en los últimos 90 días
    DATEADD(MINUTE, ABS(CHECKSUM(NEWID())) % (90 * 24 * 60), DATEADD(DAY, -90, SYSDATETIME())) AS FechaRegistro,

    -- Cantidad de botellas 1..15
    (ABS(CHECKSUM(NEWID())) % 15) + 1 AS CantidadBotellas,

    -- Peso 0.10..6.00 (aprox), con dos decimales
    CAST(((ABS(CHECKSUM(NEWID())) % 591) + 10) / 100.0 AS DECIMAL(6,2)) AS PesoKg,

    -- Tipo de material con distribución simple
    CASE (ABS(CHECKSUM(NEWID())) % 3)
        WHEN 0 THEN 'PET'
        WHEN 1 THEN 'Vidrio'
        ELSE 'Aluminio'
    END AS TipoMaterial,

    -- Validez (98% válido, 2% inválido)
    CASE WHEN (ABS(CHECKSUM(NEWID())) % 100) < 98 THEN 1 ELSE 0 END AS EsValido
FROM Numeros;
GO

REVERT;
GO