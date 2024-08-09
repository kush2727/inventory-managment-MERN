const { EntitySchema } = require('typeorm');

const Sale = new EntitySchema({
  name: "Sale",
  tableName: "sales",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    customerName: {
      type: "varchar",
      length: 255
    },
    customerEmail: {
      type: "varchar",
      length: 255
    },
    quantity: {
      type: "int"
    },
    address: {
      type: "text"
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP"
    }
  },
  relations: {
    products: {
      type: "many-to-many",
      target: "Product",
      joinTable: {
        name: "sale_product", // Name of the join table
        joinColumn: {
          name: "saleId",
          referencedColumnName: "id"
        },
        inverseJoinColumn: {
          name: "productId",
          referencedColumnName: "id"
        }
      }
    }
  }
});

module.exports = Sale;
