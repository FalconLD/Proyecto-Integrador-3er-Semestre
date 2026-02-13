USE EcoWrappedDB;
GO

EXECUTE AS USER = 'etl_writer';
GO

-- Debe funcionar (lee catálogos para obtener IDs)
SELECT TOP 1 UsuarioId FROM dbo.Usuario ORDER BY UsuarioId;
SELECT TOP 1 PuntoId FROM dbo.PuntoRecoleccion ORDER BY PuntoId;

-- Debe funcionar (inserta en Reciclaje)
INSERT INTO dbo.Reciclaje (UsuarioId, PuntoId, FechaRegistro, CantidadBotellas, PesoKg, TipoMaterial, EsValido)
VALUES (1, 1, SYSDATETIME(), 3, 0.80, 'PET', 1);

-- Debe FALLAR (no debe modificar/borrar)
UPDATE dbo.Reciclaje SET EsValido = 0 WHERE ReciclajeId = 1;

REVERT;
GO
