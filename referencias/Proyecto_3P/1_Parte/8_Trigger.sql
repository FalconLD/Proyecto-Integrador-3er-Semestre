USE EcoWrappedDB;
GO

CREATE OR ALTER TRIGGER dbo.trg_Reciclaje_AuditOutbox
ON dbo.Reciclaje
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @op VARCHAR(10);

    -- Determinar operación
    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        SET @op = 'UPDATE';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        SET @op = 'INSERT';
    ELSE
        SET @op = 'DELETE';

    -- INSERT/UPDATE: usar inserted
    IF @op IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO dbo.AuditOutbox (EntityName, EntityId, Operation, PayloadJson)
        SELECT
            'Reciclaje' AS EntityName,
            i.ReciclajeId AS EntityId,
            @op AS Operation,
            (
                SELECT
                    @op AS operation,
                    SYSDATETIME() AS eventTime,
                    SUSER_SNAME() AS eventUser,
                    i.ReciclajeId,
                    i.UsuarioId,
                    i.PuntoId,
                    i.FechaRegistro,
                    i.CantidadBotellas,
                    i.PesoKg,
                    i.TipoMaterial,
                    i.EsValido
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS PayloadJson
        FROM inserted i;
    END
    ELSE
    BEGIN
        -- DELETE: usar deleted
        INSERT INTO dbo.AuditOutbox (EntityName, EntityId, Operation, PayloadJson)
        SELECT
            'Reciclaje' AS EntityName,
            d.ReciclajeId AS EntityId,
            @op AS Operation,
            (
                SELECT
                    @op AS operation,
                    SYSDATETIME() AS eventTime,
                    SUSER_SNAME() AS eventUser,
                    d.ReciclajeId,
                    d.UsuarioId,
                    d.PuntoId,
                    d.FechaRegistro,
                    d.CantidadBotellas,
                    d.PesoKg,
                    d.TipoMaterial,
                    d.EsValido
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS PayloadJson
        FROM deleted d;
    END
END;
GO
