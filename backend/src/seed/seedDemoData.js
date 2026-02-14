require('dotenv').config();
const bcrypt = require('bcryptjs');
const AppDataSource = require('../config/database');
const { getUsuarioRepo, getRegistroRepo, getPermisoRepo, getRoleRepo } = require('../repositories');
const { LISTA_PERMISOS } = require('../config/permisos');

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a Azure SQL para seeders');

    const usuarioRepo = getUsuarioRepo();
    const registroRepo = getRegistroRepo();
    const permisoRepo = getPermisoRepo();
    const roleRepo = getRoleRepo();

    // 1. Catálogo de permisos (crear si no existen)
    for (const nombre of LISTA_PERMISOS) {
      let p = await permisoRepo.findOne({ where: { nombre } });
      if (!p) {
        const grupo = nombre.split('.')[0];
        p = permisoRepo.create({ nombre, grupo, descripcion: null });
        await permisoRepo.save(p);
        console.log('Permiso creado:', nombre);
      }
    }

    // 2. Roles: Administrador y Usuario
    let rolAdmin = await roleRepo.findOne({ where: { nombre: 'Administrador' }, relations: ['permisos'] });
    if (!rolAdmin) {
      rolAdmin = roleRepo.create({ nombre: 'Administrador', descripcion: 'Acceso total al panel y gestión' });
      await roleRepo.save(rolAdmin);
      const todosPermisos = await permisoRepo.find();
      rolAdmin.permisos = todosPermisos;
      await roleRepo.save(rolAdmin);
      console.log('Rol Administrador creado con todos los permisos');
    }
    let rolUsuario = await roleRepo.findOne({ where: { nombre: 'Usuario' } });
    if (!rolUsuario) {
      rolUsuario = roleRepo.create({ nombre: 'Usuario', descripcion: 'Usuario estándar' });
      await roleRepo.save(rolUsuario);
      console.log('Rol Usuario creado');
    }

    // 3. Admin demo (para pruebas): admin@puce.edu.ec / password
    let admin = await usuarioRepo.findOne({ where: { email: 'admin@puce.edu.ec' } });
    if (!admin) {
      const hash = await bcrypt.hash('password', 10);
      admin = usuarioRepo.create({
        nombre: 'Admin Demo',
        email: 'admin@puce.edu.ec',
        edad: 30,
        passwordHash: hash,
        role: 'admin',
        roleId: rolAdmin.id,
      });
      admin = await usuarioRepo.save(admin);
      console.log('Usuario admin creado: admin@puce.edu.ec / password');
    } else {
      if (!admin.roleId && rolAdmin) {
        admin.roleId = rolAdmin.id;
        admin.role = 'admin';
        await usuarioRepo.save(admin);
        console.log('Admin vinculado al rol Administrador');
      } else {
        console.log('Admin ya existe');
      }
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

