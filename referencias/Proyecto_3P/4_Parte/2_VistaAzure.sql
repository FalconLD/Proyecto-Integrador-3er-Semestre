CREATE OR ALTER VIEW dbo.vw_resumen_reciclaje_diario
AS
SELECT
    CAST(r.FechaRegistro AS date) AS Fecha,
    p.PuntoId,
    p.NombrePunto,
    p.Campus,
    COUNT_BIG(*) AS TotalRegistros,
    SUM(COALESCE(r.CantidadBotellas, 0)) AS TotalBotellas,
    SUM(COALESCE(r.PesoKg, 0.0)) AS TotalKg
FROM dbo.reciclaje_cloud AS r
INNER JOIN dbo.puntos_cloud AS p
    ON p.PuntoId = r.PuntoId
GROUP BY
    CAST(r.FechaRegistro AS date),
    p.PuntoId,
    p.NombrePunto,
    p.Campus;
GO
