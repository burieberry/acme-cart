const Sequelize = require('sequelize');
const conn = require('./conn');

const Order = conn.define('product', {
  isCart: {
    type: Sequelize.BOOLEAN
  },
  address: {
    type: Sequelize.STRING,
  }
});

module.exports = Order;
