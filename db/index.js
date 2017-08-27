const Sequelize = require('sequelize');
const conn = require('./conn');
const Product = require('./Product'),
      Order = require('./Order'),
      LineItem = require('./LineItem');

const sync = () => {
  return conn.sync({ force: true });
}

module.exports = {
  sync,
  models: {
    Product,
    Order,
    LineItem
  }
}
