const mongoose = require('mongoose');
const RankingEntry = require('../models/RankingEntry');

function mongoDisponible() {
  return mongoose.connection.readyState === 1;
}

async function obtener(req, res) {
  if (!mongoDisponible()) {
    return res.json([]);
  }
  try {
    const entries = await RankingEntry.find().sort({ avgConsumption: 1 });
    const ranking = entries.map((e, i) => ({
      ...e.toObject(),
      position: i + 1,
    }));
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function upsert(req, res) {
  if (!mongoDisponible()) {
    return res.status(503).json({ error: 'MongoDB no disponible' });
  }
  try {
    const { usuarioId, nombre, avgConsumption } = req.body;
    if (!usuarioId || avgConsumption === undefined) {
      return res.status(400).json({ error: 'usuarioId y avgConsumption son requeridos' });
    }
    const idSolicitado = Number(usuarioId);
    const idUsuario = req.user?.id;
    if (idUsuario != null && idSolicitado !== idUsuario) {
      return res.status(403).json({ error: 'Solo puedes actualizar tu propia posición en el ranking' });
    }
    const entry = await RankingEntry.findOneAndUpdate(
      { usuarioId },
      { usuarioId, nombre: nombre || null, avgConsumption },
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { obtener, upsert };
