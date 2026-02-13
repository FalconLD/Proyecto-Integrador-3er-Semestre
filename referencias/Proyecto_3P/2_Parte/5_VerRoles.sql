USE EcoWrappedDB;
GO

SELECT r.name AS Rol, m.name AS Miembro
FROM sys.database_role_members drm
JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
WHERE r.name IN ('role_app_writer','role_app_reader','role_etl_reader','role_etl_writer')
ORDER BY r.name, m.name;
