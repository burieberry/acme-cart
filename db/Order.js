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

// Order.addProductToCart = function(id) {
//   return this.findById(id)
//     .then(product => {
//       Order.create({ isCart: true })
//         .then(order => {
//           product.orderId = order.id;
//           return product.save();
//         })
//     })
// };

module.exports = Order;
