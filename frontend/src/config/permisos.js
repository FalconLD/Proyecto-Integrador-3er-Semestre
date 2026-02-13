/**
 * Catálogo de permisos (debe coincidir con backend).
 * Rol admin tiene todos. Aceptamos nombres antiguos y nuevos para compatibilidad.
 */
export const PERMISOS = {
  ADMIN_VER_PANEL: 'admin.ver_panel',
  ADMIN_VER_ESTADISTICAS: 'admin.ver_estadisticas',
  USUARIOS_LISTAR: 'usuarios.listar',
  USUARIOS_EDITAR_ROL: 'usuarios.editar_rol',
  USUARIOS_ASIGNAR_PERMISOS: 'usuarios.asignar_permisos',
  REGISTROS_VER_TODOS: 'registros.ver_todos',
  AUDITORIA_VER: 'auditoria.ver',
};

const EQUIVALENCIAS_ANTIGUOS = {
  ver_panel_admin: PERMISOS.ADMIN_VER_PANEL,
  ver_estadisticas_avanzadas: PERMISOS.ADMIN_VER_ESTADISTICAS,
  gestionar_usuarios: PERMISOS.USUARIOS_LISTAR,
  asignar_permisos: PERMISOS.USUARIOS_ASIGNAR_PERMISOS,
};

export const LISTA_PERMISOS = Object.values(PERMISOS);

/** Agrupados por recurso (prefijo antes del punto) para el editor del panel */
export const PERMISOS_POR_GRUPO = Object.entries(
  LISTA_PERMISOS.reduce((acc, p) => {
    const grupo = p.split('.')[0];
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(p);
    return acc;
  }, {})
).map(([grupo, permisos]) => ({ grupo, permisos }));

export function tienePermiso(user, permisoRequerido) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'Administrador') return true;
  const permisos = Array.isArray(user.permisos) ? user.permisos : [];
  if (permisos.includes(permisoRequerido)) return true;
  const nuevoEquiv = EQUIVALENCIAS_ANTIGUOS[permisoRequerido];
  if (nuevoEquiv && permisos.includes(nuevoEquiv)) return true;
  const claveAntigua = Object.keys(EQUIVALENCIAS_ANTIGUOS).find(
    (k) => EQUIVALENCIAS_ANTIGUOS[k] === permisoRequerido
  );
  return claveAntigua ? permisos.includes(claveAntigua) : false;
}

export function tieneAlgunPermiso(user, ...permisosRequeridos) {
  return permisosRequeridos.some((p) => tienePermiso(user, p));
}

/** Dado el array de permisos del usuario (puede tener nombres antiguos), devuelve el Set de nombres nuevos seleccionados */
export function permisosEfectivosParaEditor(permisosArray) {
  const arr = Array.isArray(permisosArray) ? permisosArray : [];
  const set = new Set();
  for (const p of LISTA_PERMISOS) {
    if (arr.includes(p)) set.add(p);
  }
  for (const oldKey of Object.keys(EQUIVALENCIAS_ANTIGUOS)) {
    if (arr.includes(oldKey)) set.add(EQUIVALENCIAS_ANTIGUOS[oldKey]);
  }
  return set;
}
