/**
 * Catálogo de permisos del sistema (convención recurso.accion).
 * Rol admin tiene todos implícitamente.
 */
const PERMISOS = Object.freeze({
  ADMIN_VER_PANEL: 'admin.ver_panel',
  ADMIN_VER_ESTADISTICAS: 'admin.ver_estadisticas',
  USUARIOS_LISTAR: 'usuarios.listar',
  USUARIOS_EDITAR_ROL: 'usuarios.editar_rol',
  USUARIOS_ASIGNAR_PERMISOS: 'usuarios.asignar_permisos',
  REGISTROS_VER_TODOS: 'registros.ver_todos',
  AUDITORIA_VER: 'auditoria.ver',
});

/** Lista plana para validaciones y UI */
const LISTA_PERMISOS = Object.values(PERMISOS);

/** Agrupados por recurso para el editor del panel (clave = prefijo antes del punto) */
const PERMISOS_POR_GRUPO = Object.entries(
  LISTA_PERMISOS.reduce((acc, p) => {
    const grupo = p.split('.')[0];
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(p);
    return acc;
  }, {})
).map(([grupo, permisos]) => ({ grupo, permisos }));

/**
 * Compatibilidad: permisos antiguos que se consideran equivalentes a los nuevos.
 * Así usuarios con permisos viejos siguen funcionando hasta que se migren.
 */
const EQUIVALENCIAS_ANTIGUOS = {
  ver_panel_admin: PERMISOS.ADMIN_VER_PANEL,
  ver_estadisticas_avanzadas: PERMISOS.ADMIN_VER_ESTADISTICAS,
  gestionar_usuarios: PERMISOS.USUARIOS_LISTAR,
  asignar_permisos: PERMISOS.USUARIOS_ASIGNAR_PERMISOS,
};

function getPermisosEfectivos(usuario) {
  if (!usuario) return [];
  const porRol = usuario.rol && usuario.rol.permisos
    ? usuario.rol.permisos.map((p) => p.nombre)
    : [];
  const porUsuario = parsePermisosFromUser(usuario);
  return [...new Set([...porRol, ...porUsuario])];
}

function tienePermiso(usuario, permisoRequerido) {
  if (!usuario) return false;
  const role = usuario.role || 'user';
  if (role === 'admin' || role === 'Administrador') return true;
  const permisos = getPermisosEfectivos(usuario);
  if (permisos.includes(permisoRequerido)) return true;
  const nuevoEquiv = EQUIVALENCIAS_ANTIGUOS[permisoRequerido];
  if (nuevoEquiv && permisos.includes(nuevoEquiv)) return true;
  const claveAntigua = Object.keys(EQUIVALENCIAS_ANTIGUOS).find((k) => EQUIVALENCIAS_ANTIGUOS[k] === permisoRequerido);
  return claveAntigua ? permisos.includes(claveAntigua) : false;
}

function tieneAlgunPermiso(usuario, ...permisosRequeridos) {
  return permisosRequeridos.some((p) => tienePermiso(usuario, p));
}

function parsePermisosFromUser(usuario) {
  if (!usuario || !usuario.permisos) return [];
  if (typeof usuario.permisos === 'string') {
    try {
      const arr = JSON.parse(usuario.permisos);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(usuario.permisos) ? usuario.permisos : [];
}

module.exports = {
  PERMISOS,
  LISTA_PERMISOS,
  PERMISOS_POR_GRUPO,
  EQUIVALENCIAS_ANTIGUOS,
  tienePermiso,
  tieneAlgunPermiso,
  getPermisosEfectivos,
  parsePermisosFromUser,
};
