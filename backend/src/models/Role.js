const { EntitySchema } = require('typeorm');

/**
 * Roles del sistema. Cada rol tiene un conjunto de permisos (permisos_catalogo).
 * CRUD desde el panel admin.
 */
const RoleSchema = new EntitySchema({
  name: 'Role',
  tableName: 'roles',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 80,
      unique: true,
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
    permisos: {
      type: 'many-to-many',
      target: 'PermisoCatalogo',
      joinTable: {
        name: 'role_permisos',
        joinColumn: { name: 'roleId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permisoId', referencedColumnName: 'id' },
      },
    },
    usuarios: {
      type: 'one-to-many',
      target: 'Usuario',
      inverseSide: 'rol',
    },
  },
});

module.exports = RoleSchema;
