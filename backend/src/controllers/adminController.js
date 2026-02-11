const AppDataSource = require('../config/database');
const authController = require('./authController');

const getUsuarioRepo = () => AppDataSource.getRepository('Usuario');
const getRegistroRepo = () => AppDataSource.getRepository('RegistroDiario');

async function resumen(req, res) {
  try {
    const usuarioRepo = getUsuarioRepo();
    const registroRepo = getRegistroRepo();

    const [usuarios, registros] = await Promise.all([
      usuarioRepo.find(),
      registroRepo.find(),
    ]);

    const totalUsuarios = usuarios.length;
    const totalRegistros = registros.length;

    const totalLitros = registros.reduce((acc, r) => acc + (r.total || 0), 0);
    const promedioGlobal =
      totalRegistros > 0 ? Math.round(totalLitros / totalRegistros) : 0;

    const porUsuario = new Map();
    registros.forEach((r) => {
      const id = r.usuarioId;
      if (!porUsuario.has(id)) {
        porUsuario.set(id, { usuarioId: id, suma: 0, cuenta: 0 });
      }
      const entry = porUsuario.get(id);
      entry.suma += r.total || 0;
      entry.cuenta += 1;
    });

    const rankingUsuarios = Array.from(porUsuario.values())
      .map((u) => {
        const usuario = usuarios.find((x) => x.id === u.usuarioId);
        const avg = u.cuenta > 0 ? Math.round(u.suma / u.cuenta) : 0;
        return {
          usuarioId: u.usuarioId,
          nombre: usuario ? usuario.nombre : `Usuario ${u.usuarioId}`,
          email: usuario ? usuario.email : null,
          registros: u.cuenta,
          avgConsumption: avg,
        };
      })
      .sort((a, b) => a.avgConsumption - b.avgConsumption)
      .slice(0, 5);

    const bajoObjetivoOMS = rankingUsuarios.filter(
      (u) => u.avgConsumption > 0 && u.avgConsumption <= 150
    ).length;

    res.json({
      totalUsuarios,
      totalRegistros,
      promedioGlobal,
      topUsuarios: rankingUsuarios,
      indicadores: {
        bajoObjetivoOMS,
        objetivoOMS: 150,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listarUsuarios(req, res) {
  try {
    const repo = getUsuarioRepo();
    const usuarios = await repo.find({ order: { id: 'ASC' } });
    const safe = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      edad: u.edad,
      role: u.role || 'user',
      permisos: authController.parsePermisos(u.permisos),
    }));
    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cambiarRol(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Rol debe ser "user" o "admin"' });
    }
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { id: parseInt(id) } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    usuario.role = role;
    await repo.save(usuario);
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function asignarPermisos(req, res) {
  try {
    const { id } = req.params;
    const { permisos } = req.body;
    if (!Array.isArray(permisos)) {
      return res.status(400).json({ error: 'permisos debe ser un array' });
    }
    const repo = getUsuarioRepo();
    const usuario = await repo.findOne({ where: { id: parseInt(id) } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    usuario.permisos = JSON.stringify(permisos.filter((p) => typeof p === 'string'));
    await repo.save(usuario);
    res.json({
      id: usuario.id,
      permisos: authController.parsePermisos(usuario.permisos),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { resumen, listarUsuarios, cambiarRol, asignarPermisos };

