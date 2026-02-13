const AppDataSource = require('../config/database');

const getRegistroRepo = () => AppDataSource.getRepository('RegistroDiario');
const getSemanalRepo = () => AppDataSource.getRepository('RegistroSemanal');
const getAuditoriaRepo = () => AppDataSource.getRepository('Auditoria');

const logAuditoria = async (usuarioId, entidad, operacion, detalle) => {
  try {
    const repo = getAuditoriaRepo();
    await repo.save({ usuarioId, entidad, operacion, detalle });
  } catch (e) {
    console.warn('Error auditoría:', e.message);
  }
};

async function obtenerPorUsuario(req, res) {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId) return res.status(400).json({ error: 'Falta usuarioId' });

    const repo = getRegistroRepo();
    const registros = await repo.find({
      where: { usuarioId: parseInt(usuarioId) },
      order: { fecha: 'DESC', createdAt: 'DESC' },
    });

    const formatted = registros.map((r) => ({
      id: r.id,
      fecha: r.fecha ? new Date(r.fecha).toLocaleDateString() : new Date().toLocaleDateString(),
      fechaISO: r.fechaISO,
      total: r.total,
      virtualTotal: r.virtualTotal,
      details: r.details ? (typeof r.details === 'string' ? JSON.parse(r.details) : r.details) : null,
      createdAt: r.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error obteniendo registros:", error);
    res.status(500).json({ error: error.message });
  }
}

async function crear(req, res) {
  try {
    const { usuarioId, fecha, fechaISO, total, virtualTotal, details } = req.body;

    if (!usuarioId || total === undefined) {
      return res.status(400).json({ error: 'usuarioId y total son requeridos' });
    }

    let fechaFinal = new Date();
    if (fecha) {
      const parsedDate = new Date(fecha);
      if (!isNaN(parsedDate.getTime())) {
        fechaFinal = parsedDate;
      }
    }

    const repo = getRegistroRepo();
    
    const registro = repo.create({
      usuarioId: parseInt(usuarioId),
      fecha: fechaFinal,
      fechaISO: fechaISO || fechaFinal.toISOString(),
      total: parseInt(total),
      virtualTotal: virtualTotal ? parseInt(virtualTotal) : null,
      details: details ? JSON.stringify(details) : null,
    });

    const guardado = await repo.save(registro);

    logAuditoria(usuarioId, 'registros_diarios', 'INSERT', `total=${total}`).catch(console.error);

    res.status(201).json({
      id: guardado.id,
      fecha: guardado.fecha ? new Date(guardado.fecha).toLocaleDateString() : new Date().toLocaleDateString(),
      fechaISO: guardado.fechaISO,
      total: guardado.total,
      virtualTotal: guardado.virtualTotal,
      details: details,
      createdAt: guardado.createdAt,
    });

  } catch (error) {
    console.error("Error creando registro:", error);
    res.status(500).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const repo = getRegistroRepo();
    const registro = await repo.findOne({ where: { id: parseInt(id) } });

    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });

    const usuarioId = registro.usuarioId;
    await repo.remove(registro);

    logAuditoria(usuarioId, 'registros_diarios', 'DELETE', `id=${id}`).catch(console.error);

    res.json({ mensaje: 'Registro eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerSemanales(req, res) {
  try {
    const { usuarioId } = req.params;
    const repo = getRegistroRepo();
    const registros = await repo.find({
      where: { usuarioId: parseInt(usuarioId) },
      order: { fecha: 'ASC' },
    });

    if (!registros || registros.length === 0) {
      return res.json([]);
    }

    const validRegistros = registros.filter(r => r.fechaISO && !isNaN(new Date(r.fechaISO).getTime()));

    const sorted = [...validRegistros].sort((a, b) => new Date(a.fechaISO) - new Date(b.fechaISO));
    const weeks = [];
    let currentWeek = [];

    sorted.forEach((r, idx) => {
      currentWeek.push(r);
      if (currentWeek.length === 7 || idx === sorted.length - 1) {
        const total = currentWeek.reduce((s, d) => s + (parseInt(d.total) || 0), 0);
        weeks.push({
          label: `Semana ${weeks.length + 1}`,
          total,
          estimated: currentWeek.length < 7,
        });
        currentWeek = [];
      }
    });

    res.json(weeks);
  } catch (error) {
    console.error("Error semanales:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerPorUsuario,
  crear,
  eliminar,
  obtenerSemanales,
};