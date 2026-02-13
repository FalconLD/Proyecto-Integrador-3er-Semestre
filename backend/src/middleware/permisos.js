const { tienePermiso: tienePermisoUsuario, tieneAlgunPermiso: tieneAlgunPermisoUsuario } = require('../config/permisos');

function tienePermiso(permisoRequerido) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (tienePermisoUsuario(req.user, permisoRequerido)) return next();
    return res.status(403).json({ error: 'Sin permiso para esta acción' });
  };
}

function tieneAlgunPermiso(...permisosRequeridos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (tieneAlgunPermisoUsuario(req.user, ...permisosRequeridos)) return next();
    return res.status(403).json({ error: 'Sin permiso para esta acción' });
  };
}

module.exports = { tienePermiso, tieneAlgunPermiso };
