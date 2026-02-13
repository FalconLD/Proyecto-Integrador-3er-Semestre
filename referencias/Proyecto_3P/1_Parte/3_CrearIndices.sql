-- =====================================================
-- Índices recomendados
-- =====================================================

CREATE INDEX IX_Reciclaje_Fecha
ON dbo.Reciclaje (FechaRegistro);

CREATE INDEX IX_Reciclaje_Usuario
ON dbo.Reciclaje (UsuarioId);

CREATE INDEX IX_Reciclaje_Punto
ON dbo.Reciclaje (PuntoId);
GO
