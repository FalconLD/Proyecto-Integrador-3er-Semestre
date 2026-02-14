require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPermisosEfectivos } = require('../config/permisos');
const SessionLog = require('../models/SessionLog');
const { getUsuarioRepo } = require('../repositories');

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
  const permisos = getPermisosEfectivos(usuario).length
    ? getPermisosEfectivos(usuario)
    : parsePermisos(usuario.permisos);
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    edad: usuario.edad,
    avatar_url: usuario.avatar_url,
    modo_oscuro: usuario.modo_oscuro,
    role: usuario.role || 'user',
    roleId: usuario.roleId ?? null,
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
    const usuario = await repo.findOne({
      where: { email },
      relations: ['rol', 'rol.permisos'],
    });
    if (!usuario || !usuario.passwordHash) {
      try {
        await SessionLog.create({
          accion: 'LOGIN_FALLIDO',
          detalles: { emailIntento: email, error: 'Usuario no encontrado o pass incorrecto' },
          ip: req.ip,
          navegador: req.headers['user-agent']
        });
      } catch (e) { console.log('No se pudo guardar log de fallo'); }
      
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, usuario.passwordHash);

    if (!ok) {
        try {
            await SessionLog.create({
              accion: 'LOGIN_FALLIDO',
              detalles: { emailIntento: email, error: 'Contraseña incorrecta' },
              ip: req.ip,
              navegador: req.headers['user-agent']
            });
          } catch (e) { console.log('No se pudo guardar log de fallo'); }

      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    try {
      await SessionLog.create({
        usuarioId: usuario.id,
        accion: 'LOGIN_EXITOSO',
        detalles: { 
          email: usuario.email, 
          role: usuario.role,
          mensaje: 'Ingreso correcto al sistema'
        },
        ip: req.ip || req.connection.remoteAddress,
        navegador: req.headers['user-agent']
      });
      console.log('✅ [MongoDB] Log de sesión guardado correctamente');
    } catch (mongoError) {
      console.error('⚠️ [MongoDB Warning] No se pudo guardar el log:', mongoError.message);
    }

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