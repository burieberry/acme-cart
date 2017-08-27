const Sequelize = require('sequelize');
const conn = require('./conn');

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
