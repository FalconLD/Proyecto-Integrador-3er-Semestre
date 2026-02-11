const mongoose = require('mongoose');

const connectMongo = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/h2o-db';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB conectado');
  } catch (err) {
    console.warn('MongoDB no disponible:', err.message);
  }
};

module.exports = { connectMongo };
