const AppDataSource = require('../config/database');
const { In } = require('typeorm');

const getRoleRepo = () => AppDataSource.getRepository('Role');
const getUsuarioRepo = () => AppDataSource.getRepository('Usuario');

async function listar(req, res) {
  try {
    const repo = getRoleRepo();
    const roles = await repo.find({
      relations: ['permisos'],
      order: { nombre: 'ASC' },
    });
    const countRepo = getUsuarioRepo();
    const counts = await countRepo
      .createQueryBuilder('u')
      .select('u.roleId', 'roleId')
      .addSelect('COUNT(*)', 'count')
      .where('u.roleId IS NOT NULL')
      .groupBy('u.roleId')
      .getRawMany();
    const countByRole = counts.reduce((acc, row) => {
      acc[row.roleId] = parseInt(row.count, 10);
      return acc;
    }, {});
    res.json(
      roles.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        descripcion: r.descripcion,
        permisos: (r.permisos || []).map((p) => ({ id: p.id, nombre: p.nombre, grupo: p.grupo })),
        usuariosCount: countByRole[r.id] || 0,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crear(req, res) {
  try {
    const { nombre, descripcion, permisoIds } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
    }
    const repo = getRoleRepo();
    const existe = await repo.findOne({ where: { nombre: nombre.trim() } });
    if (existe) return res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
    const role = repo.create({ nombre: nombre.trim(), descripcion: descripcion ? descripcion.trim() : null });
    const guardado = await repo.save(role);
    if (Array.isArray(permisoIds) && permisoIds.length > 0) {
      await syncPermisos(guardado.id, permisoIds);
    }
    const conPermisos = await repo.findOne({ where: { id: guardado.id }, relations: ['permisos'] });
    res.status(201).json({
      id: conPermisos.id,
      nombre: conPermisos.nombre,
      descripcion: conPermisos.descripcion,
      permisos: (conPermisos.permisos || []).map((p) => ({ id: p.id, nombre: p.nombre, grupo: p.grupo })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, permisoIds } = req.body;
    const repo = getRoleRepo();
    const role = await repo.findOne({ where: { id: parseInt(id) }, relations: ['permisos'] });
    if (!role) return res.status(404).json({ error: 'Rol no encontrado' });
    if (nombre !== undefined) role.nombre = nombre.trim();
    if (descripcion !== undefined) role.descripcion = descripcion ? descripcion.trim() : null;
    await repo.save(role);
    if (Array.isArray(permisoIds)) {
      await syncPermisos(role.id, permisoIds);
    }
    const actualizado = await repo.findOne({ where: { id: role.id }, relations: ['permisos'] });
    res.json({
      id: actualizado.id,
      nombre: actualizado.nombre,
      descripcion: actualizado.descripcion,
      permisos: (actualizado.permisos || []).map((p) => ({ id: p.id, nombre: p.nombre, grupo: p.grupo })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const repo = getRoleRepo();
    const role = await repo.findOne({ where: { id: parseInt(id) }, relations: ['usuarios'] });
    if (!role) return res.status(404).json({ error: 'Rol no encontrado' });
    const usuariosConRol = (role.usuarios || []).length;
    if (usuariosConRol > 0) {
      return res.status(400).json({
        error: `No se puede eliminar el rol: ${usuariosConRol} usuario(s) lo tienen asignado. Reasigna primero.`,
      });
    }
    if (role.nombre === 'Administrador') {
      return res.status(400).json({ error: 'No se puede eliminar el rol Administrador' });
    }
    await repo.remove(role);
    res.json({ mensaje: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function syncPermisos(roleId, permisoIds) {
  const roleRepo = getRoleRepo();
  const permisoRepo = AppDataSource.getRepository('PermisoCatalogo');
  const role = await roleRepo.findOne({ where: { id: roleId }, relations: ['permisos'] });
  if (!role) return;
  const ids = permisoIds.filter((id) => Number.isInteger(Number(id))).map((id) => parseInt(id, 10));
  const permisos = ids.length ? await permisoRepo.find({ where: { id: In(ids) } }) : [];
  if (permisos.length !== ids.length && ids.length > 0) {
    const found = permisos.map((p) => p.id);
    const missing = ids.filter((id) => !found.includes(id));
    if (missing.length) console.warn('Algunos permisoIds no existen:', missing);
  }
  role.permisos = permisos;
  await roleRepo.save(role);
}

module.exports = { listar, crear, actualizar, eliminar };
