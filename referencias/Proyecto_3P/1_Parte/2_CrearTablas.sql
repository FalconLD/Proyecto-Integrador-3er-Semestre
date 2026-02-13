USE EcoWrappedDB;
GO

-- =====================================================
-- Tabla: Usuario
-- =====================================================

CREATE TABLE dbo.Usuario (
    UsuarioId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    FechaRegistro DATETIME2 NOT NULL 
        CONSTRAINT DF_Usuario_FechaRegistro DEFAULT SYSDATETIME(),
    Activo BIT NOT NULL 
        CONSTRAINT DF_Usuario_Activo DEFAULT 1,
    CONSTRAINT UQ_Usuario_Email UNIQUE (Email)
);
GO

-- =====================================================
-- Tabla: PuntoRecoleccion
-- =====================================================

CREATE TABLE dbo.PuntoRecoleccion (
    PuntoId INT IDENTITY(1,1) PRIMARY KEY,
    NombrePunto NVARCHAR(80) NOT NULL,
    Campus NVARCHAR(80) NOT NULL,
    Activo BIT NOT NULL 
        CONSTRAINT DF_Punto_Activo DEFAULT 1,
    CONSTRAINT UQ_Punto_Nombre UNIQUE (NombrePunto, Campus)
);
GO

-- =====================================================
-- Tabla: Reciclaje
-- =====================================================

CREATE TABLE dbo.Reciclaje (
    ReciclajeId INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    PuntoId INT NOT NULL,
    FechaRegistro DATETIME2 NOT NULL 
        CONSTRAINT DF_Reciclaje_Fecha DEFAULT SYSDATETIME(),
    CantidadBotellas INT NOT NULL,
    PesoKg DECIMAL(6,2) NOT NULL,
    TipoMaterial VARCHAR(50) NOT NULL,
    EsValido BIT NOT NULL 
        CONSTRAINT DF_Reciclaje_Valido DEFAULT 1,

    CONSTRAINT FK_Reciclaje_Usuario 
        FOREIGN KEY (UsuarioId) 
        REFERENCES dbo.Usuario (UsuarioId),

    CONSTRAINT FK_Reciclaje_Punto 
        FOREIGN KEY (PuntoId) 
        REFERENCES dbo.PuntoRecoleccion (PuntoId),

    CONSTRAINT CK_Reciclaje_Cantidad 
        CHECK (CantidadBotellas > 0),

    CONSTRAINT CK_Reciclaje_Peso 
        CHECK (PesoKg >= 0)
);
GO
