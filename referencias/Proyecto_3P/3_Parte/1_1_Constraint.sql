USE EcoWrappedDB;
GO

SELECT kc.name AS NombreConstraint, t.name AS Tabla
FROM sys.key_constraints kc
JOIN sys.tables t ON kc.parent_object_id = t.object_id
WHERE t.name = 'Usuario' AND kc.type = 'UQ';
GO
