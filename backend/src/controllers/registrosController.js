const AppDataSource = require('../config/database');
const { tienePermiso, PERMISOS } = require('../config/permisos');

const getRegistroRepo = () => AppDataSource.getRepository('RegistroDiario');
const getSemanalRepo = () => AppDataSource.getRepository('RegistroSemanal');
const getAuditoriaRepo = () => AppDataSource.getRepository('Auditoria');

function puedeVerRegistrosDeOtro(usuario) {
  return usuario && (usuario.role === 'admin' || tienePermiso(usuario, PERMISOS.REGISTROS_VER_TODOS));
}

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
    const idSolicitado = parseInt(usuarioId);
    if (!usuarioId) return res.status(400).json({ error: 'Falta usuarioId' });
    if (req.user.id !== idSolicitado && !puedeVerRegistrosDeOtro(req.user)) {
      return res.status(403).json({ error: 'No tienes permiso para ver los registros de otro usuario' });
    }
    const repo = getRegistroRepo();
    const registros = await repo.find({
      where: { usuarioId: idSolicitado },
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
    const idPropuesto = parseInt(usuarioId);
    if (req.user.id !== idPropuesto) {
      return res.status(403).json({ error: 'Solo puedes crear registros para tu propio usuario' });
    }
    // Usar fechaISO (ISO 8601) para evitar "Invalid date" con fechas en formato locale (ej. 13/2/2026)
    const fechaValida = fechaISO ? new Date(fechaISO) : (fecha ? new Date(fecha) : new Date());
    const fechaParaBD = (fechaValida instanceof Date && !Number.isNaN(fechaValida.getTime()))
      ? fechaValida
      : new Date();
    const fechaISOStr = fechaISO || fechaParaBD.toISOString();
    // Formato DATE para SQL Server (YYYY-MM-DD)
    const fechaSolo = fechaParaBD.toISOString().slice(0, 10);
    const totalNum = parseInt(total);
    const virtualTotalNum = virtualTotal !== undefined && virtualTotal !== null ? parseInt(virtualTotal) : null;
    const detailsStr = details ? (typeof details === 'string' ? details : JSON.stringify(details)) : null;

    const repo = getRegistroRepo();
    let guardado = null;

    try {
      // Inserción vía stored procedure (rúbrica BD + clases Proyecto_3P)
      const sqlVirtual = virtualTotalNum === null ? 'NULL' : String(virtualTotalNum);
      const sqlDetails = detailsStr === null ? 'NULL' : "'" + String(detailsStr).replace(/'/g, "''") + "'";
      await AppDataSource.query(
        `EXEC dbo.sp_InsertRegistroSeguroH2O @UsuarioId = ${idPropuesto}, @Fecha = '${fechaSolo}', @Total = ${totalNum}, @VirtualTotal = ${sqlVirtual}, @Details = ${sqlDetails}`
      );
      const rows = await AppDataSource.query(
        `SELECT TOP 1 id, usuarioId, fecha, fechaISO, total, virtualTotal, details, createdAt
         FROM dbo.registros_diarios
         WHERE usuarioId = ${idPropuesto} AND CONVERT(date, fecha) = '${fechaSolo}'
         ORDER BY id DESC`
      );
      guardado = rows && rows[0] ? {
        id: rows[0].id,
        usuarioId: rows[0].usuarioId,
        fecha: rows[0].fecha,
        fechaISO: rows[0].fechaISO,
        total: rows[0].total,
        virtualTotal: rows[0].virtualTotal,
        details: rows[0].details,
        createdAt: rows[0].createdAt,
      } : null;
    } catch (spError) {
      const msg = spError && spError.message ? spError.message : String(spError);
      if (msg.includes('Could not find stored procedure') || msg.includes('sp_InsertRegistroSeguroH2O')) {
        console.warn('SP sp_InsertRegistroSeguroH2O no encontrado; usando repository.save(). Ejecute backend/sql/h2o_extras.sql en la BD.');
        const registro = repo.create({
          usuarioId: idPropuesto,
          fecha: fechaParaBD,
          fechaISO: fechaISOStr,
          total: totalNum,
          virtualTotal: virtualTotalNum,
          details: detailsStr,
        });
        guardado = await repo.save(registro);
      } else {
        throw spError;
      }
    }

    if (!guardado) {
      return res.status(201).json({
        mensaje: 'Registro creado con sp_InsertRegistroSeguroH2O',
        fecha: fechaParaBD.toLocaleDateString(),
        fechaISO: fechaISOStr,
        total: totalNum,
        virtualTotal: virtualTotalNum,
        details: details || null,
      });
    }
    await logAuditoria(idPropuesto, 'registros_diarios', 'INSERT', `total=${total}`);
    const detailsResp = (() => {
      if (details != null) return typeof details === 'string' ? (() => { try { return JSON.parse(details); } catch (_) { return details; } })() : details;
      if (guardado.details == null) return null;
      if (typeof guardado.details === 'string') { try { return JSON.parse(guardado.details); } catch (_) { return guardado.details; } }
      return guardado.details;
    })();
    res.status(201).json({
      id: guardado.id,
      fecha: guardado.fecha ? new Date(guardado.fecha).toLocaleDateString() : new Date().toLocaleDateString(),
      fechaISO: guardado.fechaISO,
      total: guardado.total,
      virtualTotal: guardado.virtualTotal,
      details: detailsResp,
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
    const esDueño = registro.usuarioId === req.user.id;
    const esAdmin = puedeVerRegistrosDeOtro(req.user);
    if (!esDueño && !esAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este registro' });
    }
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
    const idSolicitado = parseInt(usuarioId);
    if (req.user.id !== idSolicitado && !puedeVerRegistrosDeOtro(req.user)) {
      return res.status(403).json({ error: 'No tienes permiso para ver los registros de otro usuario' });
    }
    const repo = getRegistroRepo();
    const registros = await repo.find({
      where: { usuarioId: idSolicitado },
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