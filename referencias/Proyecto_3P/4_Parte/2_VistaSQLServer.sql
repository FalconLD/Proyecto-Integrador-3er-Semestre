CREATE OR ALTER VIEW dbo.vw_ResumenReciclajeDiario
AS
SELECT
    CAST(r.FechaRegistro AS date) AS Fecha,
    p.PuntoId,
    p.NombrePunto,
    p.Campus,
    COUNT_BIG(*) AS TotalRegistros,
    SUM(COALESCE(r.CantidadBotellas, 0)) AS TotalBotellas,
    SUM(COALESCE(r.PesoKg, 0.0)) AS TotalKg
FROM dbo.Reciclaje AS r
INNER JOIN dbo.PuntoRecoleccion AS p
    ON p.PuntoId = r.PuntoId
GROUP BY
    CAST(r.FechaRegistro AS date),
    p.PuntoId,
    p.NombrePunto,
    p.Campus;
GO
