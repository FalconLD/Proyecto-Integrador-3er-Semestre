USE EcoWrappedDB;
GO

CREATE OR ALTER PROCEDURE dbo.sp_RegistrarReciclaje
(
    @UsuarioId INT,
    @PuntoId INT,
    @CantidadBotellas INT,
    @PesoKg DECIMAL(6,2),
    @TipoMaterial VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -------------------------------------------------
        -- VALIDACIONES DE NEGOCIO
        -------------------------------------------------

        -- Validar usuario activo
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.Usuario
            WHERE UsuarioId = @UsuarioId
              AND Activo = 1
        )
        BEGIN
            THROW 50001, 'El usuario no existe o se encuentra inactivo.', 1;
        END

        -- Validar punto activo
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.PuntoRecoleccion
            WHERE PuntoId = @PuntoId
              AND Activo = 1
        )
        BEGIN
            THROW 50002, 'El punto de recolección no existe o se encuentra inactivo.', 1;
        END

        -- Validar cantidad
        IF @CantidadBotellas <= 0
        BEGIN
            THROW 50003, 'La cantidad de botellas debe ser mayor a cero.', 1;
        END

        -- Validar peso
        IF @PesoKg < 0
        BEGIN
            THROW 50004, 'El peso no puede ser negativo.', 1;
        END

        -------------------------------------------------
        -- TRANSACCIÓN
        -------------------------------------------------
        BEGIN TRAN;

        INSERT INTO dbo.Reciclaje
        (
            UsuarioId,
            PuntoId,
            CantidadBotellas,
            PesoKg,
            TipoMaterial
        )
        VALUES
        (
            @UsuarioId,
            @PuntoId,
            @CantidadBotellas,
            @PesoKg,
            @TipoMaterial
        );

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        -------------------------------------------------
        -- MANEJO DE ERRORES
        -------------------------------------------------
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        -- Re-lanzar el error original
        THROW;
    END CATCH
END;
GO
