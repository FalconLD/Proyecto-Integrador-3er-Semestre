const { EntitySchema } = require('typeorm');

// Modelo Usuario - Proyecto Integrador H2O
const UsuarioSchema = new EntitySchema({
  name: 'Usuario',
  tableName: 'usuarios',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 100,
    },
    email: {
      type: 'varchar',
      length: 150,
      unique: true,
    },
    edad: {
      type: 'int',
    },
    avatar_url: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    modo_oscuro: {
      type: 'bit',
      default: 0,
    },
    passwordHash: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    role: {
      type: 'varchar',
      length: 50,
      default: 'user',
    },
    roleId: {
      type: 'int',
      nullable: true,
    },
    permisos: {
      type: 'nvarchar',
      length: 'MAX',
      nullable: true,
    },
    createdAt: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    rol: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: { name: 'roleId' },
    },
  },
});

module.exports = UsuarioSchema;
