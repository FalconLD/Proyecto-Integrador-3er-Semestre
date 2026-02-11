const authController = require('../controllers/authController');

function tienePermiso(permisoRequerido) {
  return (req, res, next) => {
    const usuario = req.user;
    if (!usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const role = usuario.role || 'user';
    const permisos = authController.parsePermisos(usuario.permisos);
    if (role === 'admin') {
      return next();
    }
    if (permisos.includes(permisoRequerido)) {
      return next();
    }
    return res.status(403).json({ error: 'Sin permiso para esta acción' });
  };
}

function tieneAlgunPermiso(...permisosRequeridos) {
  return (req, res, next) => {
    const usuario = req.user;
    if (!usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const role = usuario.role || 'user';
    const permisos = authController.parsePermisos(usuario.permisos);
    if (role === 'admin') {
      return next();
    }
    const tiene = permisosRequeridos.some((p) => permisos.includes(p));
    if (tiene) {
      return next();
    }
    return res.status(403).json({ error: 'Sin permiso para esta acción' });
  };
}

module.exports = { tienePermiso, tieneAlgunPermiso };
