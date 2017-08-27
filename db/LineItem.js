const Sequelize = require('sequelize');
const conn = require('./conn');

const LineItem = conn.define('product', {
  quantity: {
    type: Sequelize.INTEGER
  }
});

module.exports = LineItem;
