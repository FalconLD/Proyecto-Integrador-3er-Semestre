require('dotenv').config();
const bcrypt = require('bcrypt');
const AppDataSource = require('../config/database');

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a Azure SQL para seeders');

    const usuarioRepo = AppDataSource.getRepository('Usuario');
    const registroRepo = AppDataSource.getRepository('RegistroDiario');

    // Admin demo (para pruebas): admin@test.com / admin123
    let admin = await usuarioRepo.findOne({ where: { email: 'admin@test.com' } });
    if (!admin) {
      const hash = await bcrypt.hash('admin123', 10);
      admin = usuarioRepo.create({
        nombre: 'Admin Demo',
        email: 'admin@test.com',
        edad: 30,
        passwordHash: hash,
        role: 'admin',
      });
      admin = await usuarioRepo.save(admin);
      console.log('Usuario admin creado: admin@test.com / admin123');
    } else {
      console.log('Admin ya existe');
    }

    // Usuario demo principal
    let user = await usuarioRepo.findOne({ where: { email: 'demo.h2o@puce.edu.ec' } });
    if (!user) {
      user = usuarioRepo.create({
        nombre: 'demo',
        email: 'demo.h2o@puce.edu.ec',
        edad: 21,
      });
      user = await usuarioRepo.save(user);
      console.log('Usuario demo creado con id', user.id);
    } else {
      console.log('Usuario demo ya existe con id', user.id);
    }

    // Tres registros diarios simples
    const baseDate = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);

      const registro = registroRepo.create({
        usuarioId: user.id,
        fecha: d,
        fechaISO: d.toISOString(),
        total: 120 + i * 10,
        virtualTotal: 2500,
        details: JSON.stringify({ seeded: true }),
      });
      await registroRepo.save(registro);
    }

    console.log('Registros demo insertados');
  } catch (err) {
    console.error('Error en seeder:', err.message);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

run();

