require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/database');

const getUsuarioRepo = () => AppDataSource.getRepository('Usuario');

function parsePermisos(permisosStr) {
  if (!permisosStr) return [];
  try {
    const arr = JSON.parse(permisosStr);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function toSafeUser(usuario) {
  const permisos = parsePermisos(usuario.permisos);
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    edad: usuario.edad,
    avatar_url: usuario.avatar_url,
    modo_oscuro: usuario.modo_oscuro,
    role: usuario.role || 'user',
    permisos,
  };
}

async function register(req, res) {
  try {
    const { nombre, email, edad, password } = req.body;
    if (!nombre || !email || !edad || !password) {
      return res.status(400).json({
        error: 'Nombre, email, edad y contraseña son requeridos',
      });
    }
    const repo = getUsuarioRepo();
    const existe = await repo.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const usuario = repo.create({
      nombre,
      email,
      edad: parseInt(edad),
      passwordHash,
      role: 'user',
    });
    const guardado = await repo.save(usuario);
    const token = jwt.sign(
      { id: guardado.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    res.status(201).json({
      token,
      user: toSafeUser(guardado),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { email } });
    if (!usuario || !usuario.passwordHash) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const ok = await bcrypt.compare(password, usuario.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: toSafeUser(usuario),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function me(req, res) {
  try {
    const usuario = req.user;
    if (!usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    res.json(toSafeUser(usuario));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  me,
  parsePermisos,
  toSafeUser,
};
