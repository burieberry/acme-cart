const Sequelize = require('sequelize');
const conn = require('./conn');
const Product = require('./Product'),
      Order = require('./Order'),
      LineItem = require('./LineItem');

const sync = () => {
  return conn.sync({ force: true });
};

const seed = () => {
  return require('./seed')(Product, LineItem, Order);
};

Order.hasMany(LineItem);
LineItem.belongsTo(Order);
LineItem.belongsTo(Product);

module.exports = {
  seed,
  sync,
  models: {
    Product,
    Order,
    LineItem
  }
}
