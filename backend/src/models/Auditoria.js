const { EntitySchema } = require('typeorm');

const AuditoriaSchema = new EntitySchema({
  name: 'Auditoria',
  tableName: 'auditoria',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    usuarioId: {
      type: 'int',
      nullable: true,
    },
    entidad: {
      type: 'varchar',
      length: 100,
    },
    operacion: {
      type: 'varchar',
      length: 20,
    },
    detalle: {
      type: 'nvarchar',
      length: 'MAX',
      nullable: true,
    },
    fecha: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});

module.exports = AuditoriaSchema;
