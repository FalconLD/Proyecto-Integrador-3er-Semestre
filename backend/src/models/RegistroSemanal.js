const { EntitySchema } = require('typeorm');

const RegistroSemanalSchema = new EntitySchema({
  name: 'RegistroSemanal',
  tableName: 'registros_semanales',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    usuarioId: {
      type: 'int',
    },
    semanaInicio: {
      type: 'date',
    },
    total: {
      type: 'int',
    },
    esEstimado: {
      type: 'bit',
      default: 0,
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

module.exports = RegistroSemanalSchema;
