const { EntitySchema } = require('typeorm');

const RegistroDiarioSchema = new EntitySchema({
  name: 'RegistroDiario',
  tableName: 'registros_diarios',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    usuarioId: {
      type: 'int',
    },
    fecha: {
      type: 'date',
    },
    fechaISO: {
      type: 'varchar',
      length: 50,
    },
    total: {
      type: 'int',
    },
    virtualTotal: {
      type: 'int',
      nullable: true,
    },
    details: {
      type: 'nvarchar',
      length: 'MAX',
      nullable: true,
    },
    createdAt: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    usuario: {
      type: 'many-to-one',
      target: 'Usuario',
      joinColumn: { name: 'usuarioId' },
    },
  },
});

module.exports = RegistroDiarioSchema;
