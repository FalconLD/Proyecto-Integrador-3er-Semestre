const mongoose = require('mongoose');

const sessionLogSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    default: null 
  },
  
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