const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/database');

const getUsuarioRepo = () => AppDataSource.getRepository('Usuario');

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    );
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({
      where: { id: decoded.id },
      relations: ['rol', 'rol.permisos'],
    });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    req.user = usuario;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(500).json({ error: err.message });
  }
}

function authOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET || 'fallback-secret',
    async (err, decoded) => {
      if (err) {
        req.user = null;
        return next();
      }
      try {
        const repo = getUsuarioRepo();
        const usuario = await repo.findOne({ where: { id: decoded.id } });
        req.user = usuario || null;
      } catch {
        req.user = null;
      }
      next();
    }
  );
}

module.exports = { auth, authOptional };
