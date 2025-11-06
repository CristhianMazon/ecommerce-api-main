const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderProduct = sequelize.define('OrderProduct', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', onDelete: 'CASCADE' });
// onDelete 'CASCADE': Se um Produto for deletado, as entradas correspondentes em OrderProduct serão deletadas.
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = OrderProduct;
