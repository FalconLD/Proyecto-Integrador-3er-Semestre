ALTER TABLE dbo.Usuario
ADD CONSTRAINT UQ_Usuario_Email UNIQUE (Email);
GO
