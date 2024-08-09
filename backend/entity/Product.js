const { EntitySchema } = require('typeorm');

const Product = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      length: 255
    },
    quantity: {
      type: "int"
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2
    },
    category: {
      type: "varchar",
      length: 20
    },
    image: {
      type: "varchar",
      nullable: true
    }
  },
  relations: {
    sales: {
      type: "many-to-many",
      target: "Sale",
      inverseSide: "products",
      
    }
  }
});

module.exports = Product;
