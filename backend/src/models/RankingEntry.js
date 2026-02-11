// Modelo Mongoose para ranking - MongoDB
const mongoose = require('mongoose');

const rankingEntrySchema = new mongoose.Schema({
  usuarioId: { type: Number, required: true },
  nombre: { type: String },
  avgConsumption: { type: Number, required: true },
  periodo: { type: String, default: 'semanal' },
}, { timestamps: true });

const RankingEntry = mongoose.model('RankingEntry', rankingEntrySchema);
module.exports = RankingEntry;
