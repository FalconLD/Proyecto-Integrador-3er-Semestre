SELECT
    t.name AS Tabla,
    i.name AS Indice,
    c.name AS Columna,
    ic.key_ordinal AS OrdenEnIndice
FROM sys.indexes i
JOIN sys.index_columns ic 
    ON i.object_id = ic.object_id AND i.index_id = ic.index_id
JOIN sys.columns c
    ON ic.object_id = c.object_id AND ic.column_id = c.column_id
JOIN sys.tables t
    ON i.object_id = t.object_id
WHERE t.name = 'Reciclaje'
ORDER BY i.name, ic.key_ordinal;
