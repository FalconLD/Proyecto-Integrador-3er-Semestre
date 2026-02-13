GRANT EXECUTE ON dbo.sp_RegistrarReciclaje TO role_app_writer;

DENY INSERT, UPDATE, DELETE ON dbo.Reciclaje TO role_app_writer;
DENY INSERT, UPDATE, DELETE ON dbo.Usuario TO role_app_writer;
DENY INSERT, UPDATE, DELETE ON dbo.PuntoRecoleccion TO role_app_writer;

GRANT SELECT ON dbo.Usuario TO role_app_reader;
GRANT SELECT ON dbo.PuntoRecoleccion TO role_app_reader;
GRANT SELECT ON dbo.Reciclaje TO role_app_reader;

GRANT SELECT ON dbo.Usuario TO role_etl_reader;
GRANT SELECT ON dbo.PuntoRecoleccion TO role_etl_reader;
GRANT SELECT ON dbo.Reciclaje TO role_etl_reader;
GRANT SELECT ON dbo.AuditOutbox TO role_etl_reader;
