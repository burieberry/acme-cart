const Sequelize = require('sequelize');
const conn = require('./conn');

const Product = conn.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Product;

