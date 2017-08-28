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

const findEverything = function() {
  return Promise.all([
    Product.findAll(),
    Order.findOrderList(),
    LineItem.findLineItemsList()
  ])
}

Order.hasMany(LineItem);
LineItem.belongsTo(Order);
LineItem.belongsTo(Product);

module.exports = {
  seed,
  sync,
  findEverything,
  models: {
    Product,
    Order,
    LineItem
  }
}
