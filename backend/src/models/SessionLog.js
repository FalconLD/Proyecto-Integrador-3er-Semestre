const mongoose = require('mongoose');

const sessionLogSchema = new mongoose.Schema({
  // ID numérico del usuario en Azure SQL (no ref: Usuario está en otra BD)
  usuarioId: { type: Number, default: null },
  
  accion: { 
    type: String, 
    required: true 
  },

  detalles: { 
    type: mongoose.Schema.Types.Mixed 
  },

  ip: { type: String },
  navegador: { type: String },
  
  fecha: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('SessionLog', sessionLogSchema);