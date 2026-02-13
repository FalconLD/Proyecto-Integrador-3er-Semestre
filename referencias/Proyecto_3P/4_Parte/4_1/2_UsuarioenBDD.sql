USE EcoWrappedDB;
GO

CREATE USER etl_reader_login FOR LOGIN etl_reader_login;
GO

GRANT SELECT ON dbo.Usuario TO etl_reader_login;
GRANT SELECT ON dbo.PuntoRecoleccion TO etl_reader_login;
GRANT SELECT ON dbo.Reciclaje TO etl_reader_login;
GO
