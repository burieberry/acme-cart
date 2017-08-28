const Sequelize = require('sequelize');
const conn = require('./conn');
const LineItem = require('./LineItem');

const Order = conn.define('order', {
  isCart: {
    type: Sequelize.BOOLEAN
  },
  address: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

// Order.hook('beforeUpdate', (order) => {
//   if (!order.address) {
//     throw new Error('address required');
//   }
// });

Order.findOrderList = function() {
  return Order.findAll({
    where: { isCart: false },
    include: [{
      model: conn.models.lineitem,
      include: conn.models.product
    }]
  })
}

Order.updateFromRequestBody = function(id, reqBody) {
  if (!reqBody.address) throw new Error('address required');

  return Order.findById(id)
    .then(order => {
      order.isCart = false;
      order.address = reqBody.address;
      return order.save();
    })
};

module.exports = Order;
