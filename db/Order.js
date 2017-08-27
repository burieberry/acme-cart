const Sequelize = require('sequelize');
const conn = require('./conn');
const LineItem = require('./LineItem');

const Order = conn.define('order', {
  isCart: {
    type: Sequelize.BOOLEAN
  },
  address: {
    type: Sequelize.STRING,
  }
}, {
  timestamps: false
});

Order.findOrderList = function() {
  return Order.findAll({
    where: { isCart: false },
    include: [{
      model: conn.models.lineitem,
      include: conn.models.product
    }]
  })
}

module.exports = Order;
