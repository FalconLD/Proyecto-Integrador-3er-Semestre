    EXEC dbo.sp_RegistrarReciclaje
        @UsuarioId = 1,
        @PuntoId = 2,
        @CantidadBotellas = 3,
        @PesoKg = 0.80,
        @TipoMaterial = 'PET';
