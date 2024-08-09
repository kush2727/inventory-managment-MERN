const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'SaleItem',
  tableName: 'sale_items',
  columns: {
    id: {
        type: 'int',
        primary: true,
        generated: true,
    },
    name: {
        type: 'varchar',
        length: 255,
    },
    quantity: {
        type: 'int',
    },
    price: {
        type: 'decimal',
        precision: 10,
        scale: 2,
    },
    category: {
        type: 'varchar',
        length: 255,
    },
    image: {
        type: 'text',
        nullable: true,
    },
},
});


