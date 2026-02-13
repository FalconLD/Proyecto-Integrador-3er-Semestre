USE EcoWrappedDB;
GO

CREATE TABLE dbo.AuditOutbox
(
    EventId BIGINT IDENTITY(1,1) PRIMARY KEY,
    EntityName VARCHAR(50) NOT NULL,          -- Ej: 'Reciclaje'
    EntityId INT NULL,                        -- Id del registro afectado
    Operation VARCHAR(10) NOT NULL,           -- 'INSERT'/'UPDATE'/'DELETE'
    EventTime DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    EventUser SYSNAME NOT NULL DEFAULT SUSER_SNAME(), -- usuario que ejecutó
    PayloadJson NVARCHAR(MAX) NOT NULL,       -- detalle del evento (JSON)
    SentToMongo BIT NOT NULL DEFAULT 0,       -- control de envío
    SentTime DATETIME2 NULL                   -- cuándo se envió
);
GO
