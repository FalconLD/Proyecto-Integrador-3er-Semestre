USE EcoWrappedDB;
GO

CREATE USER etl_writer WITHOUT LOGIN;
GO

CREATE ROLE role_etl_writer;
GO

ALTER ROLE role_etl_writer ADD MEMBER etl_writer;
GO

GRANT INSERT ON dbo.Reciclaje TO role_etl_writer;
