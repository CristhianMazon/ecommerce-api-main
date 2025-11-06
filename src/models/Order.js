const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true }); // Adicione foreignKey aqui
Order.belongsTo(User, { foreignKey: 'userId' }); // Adicione foreignKey aqui

module.exports = Order;
