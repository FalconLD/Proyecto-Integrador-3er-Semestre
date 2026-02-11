// Modelo Mongoose para rachas/alianzas - MongoDB
const mongoose = require('mongoose');

const rachaSchema = new mongoose.Schema({
  nombre: { type: String },
  usuarios: [{ type: Number }],
  tipo: { type: String, enum: ['racha', 'alianza'], default: 'alianza' },
  estado: { type: String, default: 'activa' },
}, { timestamps: true });

const Racha = mongoose.model('Racha', rachaSchema);
module.exports = Racha;
