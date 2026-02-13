EXECUTE AS USER = 'app_writer';

-- Esto SÍ debe funcionar
EXEC dbo.sp_RegistrarReciclaje
    @UsuarioId = 1,
    @PuntoId = 1,
    @CantidadBotellas = 2,
    @PesoKg = 0.5,
    @TipoMaterial = 'PET';

-- Esto DEBE FALLAR
INSERT INTO dbo.Reciclaje
VALUES (1,1,SYSDATETIME(),1,0.2,'PET',1);

REVERT;
