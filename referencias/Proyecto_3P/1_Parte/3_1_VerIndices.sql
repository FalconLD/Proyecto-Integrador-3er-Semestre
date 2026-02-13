USE EcoWrappedDB;
GO

SELECT
    t.name AS Tabla,
    i.name AS Indice,
    i.type_desc AS Tipo,
    i.is_unique AS EsUnico,
    i.is_primary_key AS EsPK
FROM sys.indexes i
JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.name IN ('Reciclaje', 'Usuario', 'PuntoRecoleccion')
  AND i.name IS NOT NULL
ORDER BY t.name, i.is_primary_key DESC, i.name;
