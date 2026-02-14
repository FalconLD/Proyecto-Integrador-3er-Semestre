const mongoose = require('mongoose');
const RankingEntry = require('../models/RankingEntry');
const { tienePermiso } = require('../config/permisos');
const { getRegistroRepo } = require('../repositories');

function puedeVerRachasDeOtro(usuario) {
  if (!usuario) return false;
  if (usuario.role === 'admin' || usuario.role === 'Administrador') return true;
  return tienePermiso(usuario, 'registros.ver_todos');
}

function daysBetween(a, b) {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const da = new Date(a);
  const db = new Date(b);
  // Normalizar a fecha sin hora
  da.setHours(0, 0, 0, 0);
  db.setHours(0, 0, 0, 0);
  return Math.round((db - da) / ONE_DAY);
}

async function resumenUsuario(req, res) {
  try {
    const { usuarioId } = req.params;
    const id = parseInt(usuarioId);
    const userId = req.user?.id;
    if (userId != null && id !== userId && !puedeVerRachasDeOtro(req.user)) {
      return res.status(403).json({ error: 'Solo puedes consultar tus propias rachas' });
    }
    const repo = getRegistroRepo();

    const registros = await repo.find({
      where: { usuarioId: id },
      order: { fechaISO: 'ASC' },
    });

    if (!registros.length) {
      return res.json({
        currentStreak: 0,
        maxStreak: 0,
        alliance: null,
      });
    }

    // Calcular rachas (días consecutivos con registro)
    let maxStreak = 1;
    let currentStreak = 1;
    let streakSegments = [[registros[0]]];

    for (let i = 1; i < registros.length; i++) {
      const prev = registros[i - 1];
      const cur = registros[i];
      const diff = daysBetween(prev.fechaISO || prev.fecha, cur.fechaISO || cur.fecha);

      if (diff === 0) {
        // mismo día, unificar en el mismo segmento sin aumentar longitud
        streakSegments[streakSegments.length - 1].push(cur);
      } else if (diff === 1) {
        // día siguiente: continúa racha
        streakSegments[streakSegments.length - 1].push(cur);
      } else {
        // se rompe racha
        streakSegments.push([cur]);
      }
    }

    maxStreak = Math.max(...streakSegments.map((seg) => seg.length));
    const lastSegment = streakSegments[streakSegments.length - 1];
    const diffToToday = daysBetween(
      lastSegment[lastSegment.length - 1].fechaISO || lastSegment[lastSegment.length - 1].fecha,
      new Date()
    );
    currentStreak = diffToToday <= 1 ? lastSegment.length : 0;

    // Buscar alianza usando ranking global (MongoDB)
    let alliance = null;
    if (mongoose.connection.readyState === 1) {
      const entries = await RankingEntry.find().sort({ avgConsumption: 1 });
      const idx = entries.findIndex((e) => e.usuarioId === id);
      if (idx !== -1) {
        const vecinos = [entries[idx - 1], entries[idx], entries[idx + 1]].filter(Boolean);
        alliance = {
          nombre: 'Alianza Eco',
          miembros: vecinos.map((e) => ({
            usuarioId: e.usuarioId,
            nombre: e.nombre || `Usuario ${e.usuarioId}`,
            avgConsumption: e.avgConsumption,
          })),
        };
      }
    }

    res.json({
      currentStreak,
      maxStreak,
      alliance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { resumenUsuario };

