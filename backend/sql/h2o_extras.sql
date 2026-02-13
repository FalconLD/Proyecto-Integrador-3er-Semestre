-- Scripts extra para Azure SQL - Proyecto H2O
-- Restricciones, triggers y stored procedures

USE [h2o-db];
GO

--------------------------------------------------
-- 1. RESTRICCIONES (CHECK / UNIQUE)
--------------------------------------------------

-- Edad entre 16 y 120
IF NOT EXISTS (
  SELECT 1
  FROM sys.check_constraints
  WHERE name = 'CK_usuarios_edad_rango'
)
BEGIN
  ALTER TABLE dbo.usuarios
  ADD CONSTRAINT CK_usuarios_edad_rango
    CHECK (edad BETWEEN 16 AND 120);
END;
GO

-- Total de litros no negativo
IF NOT EXISTS (
  SELECT 1
  FROM sys.check_constraints
  WHERE name = 'CK_registros_diarios_total_no_negativo'
)
BEGIN
  ALTER TABLE dbo.registros_diarios
  ADD CONSTRAINT CK_registros_diarios_total_no_negativo
    CHECK (total >= 0);
END;
GO

--------------------------------------------------
-- 2. TRIGGER DE AUDITORÍA ADICIONAL
-- (además de la auditoría desde la API)
--------------------------------------------------

IF OBJECT_ID('dbo.trg_registros_diarios_auditoria', 'TR') IS NOT NULL
  DROP TRIGGER dbo.trg_registros_diarios_auditoria;
GO

CREATE TRIGGER dbo.trg_registros_diarios_auditoria
ON dbo.registros_diarios
AFTER INSERT, DELETE
AS
BEGIN
  SET NOCOUNT ON;

  -- INSERT
  INSERT INTO dbo.auditoria (usuarioId, entidad, operacion, detalle, fecha)
  SELECT
    i.usuarioId,
    'registros_diarios',
    'INSERT',
    CONCAT('total=', i.total),
    SYSDATETIME()
  FROM inserted i;

  -- DELETE
  INSERT INTO dbo.auditoria (usuarioId, entidad, operacion, detalle, fecha)
  SELECT
    d.usuarioId,
    'registros_diarios',
    'DELETE',
    CONCAT('id=', d.id),
    SYSDATETIME()
  FROM deleted d;
END;
GO

--------------------------------------------------
-- 3. STORED PROCEDURES
--------------------------------------------------

-- 3.1 Resumen por usuario
IF OBJECT_ID('dbo.sp_ResumenUsuarioH2O', 'P') IS NOT NULL
  DROP PROCEDURE dbo.sp_ResumenUsuarioH2O;
GO

CREATE PROCEDURE dbo.sp_ResumenUsuarioH2O
  @UsuarioId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    u.id AS UsuarioId,
    u.nombre,
    u.email,
    COUNT(r.id) AS TotalRegistros,
    ISNULL(AVG(CAST(r.total AS FLOAT)), 0) AS PromedioLitros,
    ISNULL(MIN(r.total), 0) AS MinimoLitros,
    ISNULL(MAX(r.total), 0) AS MaximoLitros
  FROM dbo.usuarios u
  LEFT JOIN dbo.registros_diarios r
    ON r.usuarioId = u.id
  WHERE u.id = @UsuarioId
  GROUP BY u.id, u.nombre, u.email;
END;
GO

-- 3.2 Top N usuarios más eficientes (bajo consumo)
IF OBJECT_ID('dbo.sp_TopUsuariosEficientesH2O', 'P') IS NOT NULL
  DROP PROCEDURE dbo.sp_TopUsuariosEficientesH2O;
GO

CREATE PROCEDURE dbo.sp_TopUsuariosEficientesH2O
  @TopN INT = 5
AS
BEGIN
  SET NOCOUNT ON;

  WITH Consumos AS (
    SELECT
      u.id AS UsuarioId,
      u.nombre,
      u.email,
      COUNT(r.id) AS TotalRegistros,
      ISNULL(AVG(CAST(r.total AS FLOAT)), 0) AS PromedioLitros
    FROM dbo.usuarios u
    LEFT JOIN dbo.registros_diarios r
      ON r.usuarioId = u.id
    GROUP BY u.id, u.nombre, u.email
  )
  SELECT TOP (@TopN)
    UsuarioId,
    nombre,
    email,
    TotalRegistros,
    PromedioLitros
  FROM Consumos
  WHERE TotalRegistros > 0
  ORDER BY PromedioLitros ASC;
END;
GO

-- 3.3 Inserción segura de registro diario
IF OBJECT_ID('dbo.sp_InsertRegistroSeguroH2O', 'P') IS NOT NULL
  DROP PROCEDURE dbo.sp_InsertRegistroSeguroH2O;
GO

CREATE PROCEDURE dbo.sp_InsertRegistroSeguroH2O
  @UsuarioId INT,
  @Fecha DATE,
  @Total INT,
  @VirtualTotal INT = NULL,
  @Details NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRY
    BEGIN TRAN;

    -- Validaciones de negocio críticas
    IF NOT EXISTS (SELECT 1 FROM dbo.usuarios WHERE id = @UsuarioId)
    BEGIN
      RAISERROR ('Usuario no existe', 16, 1);
    END;

    IF @Total < 0
    BEGIN
      RAISERROR ('El total no puede ser negativo', 16, 1);
    END;

    -- Inserción del registro diario
    INSERT INTO dbo.registros_diarios (usuarioId, fecha, fechaISO, total, virtualTotal, details)
    VALUES (
      @UsuarioId,
      ISNULL(@Fecha, CAST(GETDATE() AS DATE)),
      CONVERT(VARCHAR(50), SYSDATETIMEOFFSET(), 126),
      @Total,
      @VirtualTotal,
      @Details
    );

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0
      ROLLBACK TRAN;

    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR (@ErrorMessage, 16, 1);
  END CATCH;
END;
GO

--------------------------------------------------
-- 4. VISTAS COMPLEJAS PARA REPORTES
--------------------------------------------------

-- 4.1 Vista de resumen por usuario (agregados de consumo)
IF OBJECT_ID('dbo.vw_ResumenUsuarioH2O', 'V') IS NOT NULL
  DROP VIEW dbo.vw_ResumenUsuarioH2O;
GO

CREATE VIEW dbo.vw_ResumenUsuarioH2O
AS
  SELECT
    u.id AS UsuarioId,
    u.nombre,
    u.email,
    COUNT(r.id) AS TotalRegistros,
    ISNULL(AVG(CAST(r.total AS FLOAT)), 0) AS PromedioLitros,
    ISNULL(MIN(r.total), 0) AS MinimoLitros,
    ISNULL(MAX(r.total), 0) AS MaximoLitros
  FROM dbo.usuarios u
  LEFT JOIN dbo.registros_diarios r
    ON r.usuarioId = u.id
  GROUP BY u.id, u.nombre, u.email;
GO

-- 4.2 Vista de top usuarios más eficientes (bajo consumo)
IF OBJECT_ID('dbo.vw_TopUsuariosEficientesH2O', 'V') IS NOT NULL
  DROP VIEW dbo.vw_TopUsuariosEficientesH2O;
GO

CREATE VIEW dbo.vw_TopUsuariosEficientesH2O
AS
  WITH Consumos AS (
    SELECT
      u.id AS UsuarioId,
      u.nombre,
      u.email,
      COUNT(r.id) AS TotalRegistros,
      ISNULL(AVG(CAST(r.total AS FLOAT)), 0) AS PromedioLitros
    FROM dbo.usuarios u
    LEFT JOIN dbo.registros_diarios r
      ON r.usuarioId = u.id
    GROUP BY u.id, u.nombre, u.email
  )
  SELECT TOP (5)
    UsuarioId,
    nombre,
    email,
    TotalRegistros,
    PromedioLitros
  FROM Consumos
  WHERE TotalRegistros > 0
  ORDER BY PromedioLitros ASC;
GO
