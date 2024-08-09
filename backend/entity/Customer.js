const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Customer',
  tableName: 'customers',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: true
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: true
    },
    address: {
      type: 'text',
      nullable: true
    }
  }
});
