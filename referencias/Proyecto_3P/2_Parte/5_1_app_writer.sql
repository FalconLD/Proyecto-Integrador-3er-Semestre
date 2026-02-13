USE EcoWrappedDB;
GO

EXECUTE AS USER = 'app_writer';
GO

-- Debe funcionar (tiene EXECUTE)
EXEC dbo.sp_RegistrarReciclaje
    @UsuarioId = 1,
    @PuntoId = 1,
    @CantidadBotellas = 2,
    @PesoKg = 0.50,
    @TipoMaterial = 'PET';

-- Debe FALLAR (no debe insertar directo)
INSERT INTO dbo.Reciclaje (UsuarioId, PuntoId, FechaRegistro, CantidadBotellas, PesoKg, TipoMaterial, EsValido)
VALUES (1, 1, SYSDATETIME(), 1, 0.20, 'PET', 1);

REVERT;
GO
