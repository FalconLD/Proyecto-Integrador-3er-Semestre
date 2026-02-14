const mongoose = require('mongoose');
const RankingEntry = require('../models/RankingEntry');
const authController = require('./authController');
const { tienePermiso, PERMISOS } = require('../config/permisos');
const { getUsuarioRepo, getAuditoriaRepo, getRegistroRepo, getSemanalRepo } = require('../repositories');

function puedeGestionarUsuarios(usuario) {
  return usuario && (usuario.role === 'admin' || tienePermiso(usuario, PERMISOS.USUARIOS_LISTAR) || tienePermiso(usuario, PERMISOS.ADMIN_VER_PANEL));
}

const logAuditoria = async (usuarioId, entidad, operacion, detalle) => {
  try {
    const repo = getAuditoriaRepo();
    await repo.save({ usuarioId, entidad, operacion, detalle });
  } catch (e) {
    console.warn('Error auditoría:', e.message);
  }
};

async function obtenerTodos(req, res) {
  try {
    if (!puedeGestionarUsuarios(req.user)) {
      return res.status(403).json({ error: 'No tienes permiso para listar usuarios' });
    }
    const repo = getUsuarioRepo();
    const usuarios = await repo.find({ order: { id: 'ASC' }, relations: ['rol', 'rol.permisos'] });
    const safe = usuarios.map((u) => authController.toSafeUser(u));
    res.json(safe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (req.user.id !== idNum && !puedeGestionarUsuarios(req.user)) {
      return res.status(403).json({ error: 'Solo puedes ver tu propio perfil' });
    }
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { id: idNum }, relations: ['rol', 'rol.permisos'] });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(authController.toSafeUser(usuario));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorEmail(req, res) {
  try {
    const { email } = req.params;
    const emailDecoded = decodeURIComponent(email);
    if (req.user.email !== emailDecoded && !puedeGestionarUsuarios(req.user)) {
      return res.status(403).json({ error: 'Solo puedes consultar tu propio perfil' });
    }
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { email: emailDecoded }, relations: ['rol', 'rol.permisos'] });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(authController.toSafeUser(usuario));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crear(req, res) {
  try {
    if (!puedeGestionarUsuarios(req.user)) {
      return res.status(403).json({ error: 'Solo un administrador puede crear usuarios por esta vía' });
    }
    const { nombre, email, edad, avatar_url, modo_oscuro } = req.body;
    if (!nombre || !email || !edad) {
      return res.status(400).json({ error: 'Nombre, email y edad son requeridos' });
    }
    const repo = getUsuarioRepo();
    const existe = await repo.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: 'El correo ya está registrado' });
    const usuario = repo.create({
      nombre,
      email,
      edad: parseInt(edad),
      avatar_url: avatar_url || null,
      modo_oscuro: modo_oscuro ? 1 : 0,
    });
    const guardado = await repo.save(usuario);
    await logAuditoria(guardado.id, 'usuarios', 'INSERT', JSON.stringify({ nombre, email }));
    const withRelations = await repo.findOne({ where: { id: guardado.id }, relations: ['rol', 'rol.permisos'] });
    res.status(201).json(authController.toSafeUser(withRelations || guardado));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (req.user.id !== idNum && !puedeGestionarUsuarios(req.user)) {
      return res.status(403).json({ error: 'Solo puedes actualizar tu propio perfil' });
    }
    const { nombre, edad, avatar_url, modo_oscuro } = req.body;
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { id: idNum } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (nombre !== undefined) usuario.nombre = nombre;
    if (edad !== undefined) usuario.edad = parseInt(edad);
    if (avatar_url !== undefined) usuario.avatar_url = avatar_url;
    if (modo_oscuro !== undefined) usuario.modo_oscuro = modo_oscuro ? 1 : 0;
    const actualizado = await repo.save(usuario);
    await logAuditoria(usuario.id, 'usuarios', 'UPDATE', JSON.stringify(req.body));
    const withRelations = await repo.findOne({ where: { id: actualizado.id }, relations: ['rol', 'rol.permisos'] });
    res.json(authController.toSafeUser(withRelations || actualizado));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = parseInt(id);
    if (req.user.id !== usuarioId && !puedeGestionarUsuarios(req.user)) {
      return res.status(403).json({ error: 'Solo puedes eliminar tu propia cuenta o tener permiso de administración' });
    }
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { id: usuarioId } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Eliminar registros asociados en Azure SQL
    const regRepo = getRegistroRepo();
    const semRepo = getSemanalRepo();
    await regRepo.delete({ usuarioId });
    await semRepo.delete({ usuarioId });

    // Eliminar entrada de ranking en MongoDB (si está disponible)
    if (mongoose.connection.readyState === 1) {
      await RankingEntry.deleteMany({ usuarioId });
    }

    await repo.remove(usuario);
    await logAuditoria(usuarioId, 'usuarios', 'DELETE', usuario.email);
    res.json({ mensaje: 'Usuario y registros asociados eliminados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  obtenerPorEmail,
  crear,
  actualizar,
  eliminar,
};
