const AppDataSource = require('../config/database');
const mongoose = require('mongoose');
const RankingEntry = require('../models/RankingEntry');

const getUsuarioRepo = () => AppDataSource.getRepository('Usuario');
const getAuditoriaRepo = () => AppDataSource.getRepository('Auditoria');
const getRegistroRepo = () => AppDataSource.getRepository('RegistroDiario');
const getSemanalRepo = () => AppDataSource.getRepository('RegistroSemanal');

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
    const repo = getUsuarioRepo();
    const usuarios = await repo.find({ order: { id: 'ASC' } });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { id: parseInt(id) } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorEmail(req, res) {
  try {
    const { email } = req.params;
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crear(req, res) {
  try {
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
    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const { nombre, edad, avatar_url, modo_oscuro } = req.body;
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { id: parseInt(id) } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (nombre !== undefined) usuario.nombre = nombre;
    if (edad !== undefined) usuario.edad = parseInt(edad);
    if (avatar_url !== undefined) usuario.avatar_url = avatar_url;
    if (modo_oscuro !== undefined) usuario.modo_oscuro = modo_oscuro ? 1 : 0;
    const actualizado = await repo.save(usuario);
    await logAuditoria(usuario.id, 'usuarios', 'UPDATE', JSON.stringify(req.body));
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = parseInt(id);
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
