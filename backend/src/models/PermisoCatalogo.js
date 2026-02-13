const { EntitySchema } = require('typeorm');

/**
 * Catálogo de permisos que se pueden asignar a roles.
 * CRUD desde el panel admin.
 */
const PermisoCatalogoSchema = new EntitySchema({
  name: 'PermisoCatalogo',
  tableName: 'permisos_catalogo',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 100,
      unique: true,
    },
    grupo: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    descripcion: {
      type: 'nvarchar',
      length: 500,
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
    roles: {
      type: 'many-to-many',
      target: 'Role',
      mappedBy: 'permisos',
      inverseSide: 'permisos',
    },
  },
});

module.exports = PermisoCatalogoSchema;
