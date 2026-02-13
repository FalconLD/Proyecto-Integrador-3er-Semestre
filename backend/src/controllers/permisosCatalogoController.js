const AppDataSource = require('../config/database');

const getPermisoRepo = () => AppDataSource.getRepository('PermisoCatalogo');

async function listar(req, res) {
  try {
    const repo = getPermisoRepo();
    const list = await repo.find({ order: { grupo: 'ASC', nombre: 'ASC' } });
    res.json(list.map((p) => ({ id: p.id, nombre: p.nombre, grupo: p.grupo, descripcion: p.descripcion })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crear(req, res) {
  try {
    const { nombre, grupo, descripcion } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre del permiso es obligatorio' });
    }
    const repo = getPermisoRepo();
    const existe = await repo.findOne({ where: { nombre: nombre.trim() } });
    if (existe) return res.status(400).json({ error: 'Ya existe un permiso con ese nombre' });
    const permiso = repo.create({
      nombre: nombre.trim(),
      grupo: grupo ? grupo.trim() : null,
      descripcion: descripcion ? descripcion.trim() : null,
    });
    const guardado = await repo.save(permiso);
    res.status(201).json({ id: guardado.id, nombre: guardado.nombre, grupo: guardado.grupo, descripcion: guardado.descripcion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const { nombre, grupo, descripcion } = req.body;
    const repo = getPermisoRepo();
    const permiso = await repo.findOne({ where: { id: parseInt(id) } });
    if (!permiso) return res.status(404).json({ error: 'Permiso no encontrado' });
    if (nombre !== undefined) permiso.nombre = nombre.trim();
    if (grupo !== undefined) permiso.grupo = grupo ? grupo.trim() : null;
    if (descripcion !== undefined) permiso.descripcion = descripcion ? descripcion.trim() : null;
    await repo.save(permiso);
    res.json({ id: permiso.id, nombre: permiso.nombre, grupo: permiso.grupo, descripcion: permiso.descripcion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const repo = getPermisoRepo();
    const permiso = await repo.findOne({ where: { id: parseInt(id) } });
    if (!permiso) return res.status(404).json({ error: 'Permiso no encontrado' });
    await repo.remove(permiso);
    res.json({ mensaje: 'Permiso eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listar, crear, actualizar, eliminar };
