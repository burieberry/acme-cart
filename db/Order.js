const Sequelize = require('sequelize');
const conn = require('./conn');

const Order = conn.define('order', {
  isCart: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  address: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

Order.hook('beforeUpdate', (order) => {
  if (!order.address) {
    throw new Error('address required');
  }
});

Order.updateFromRequestBody = function(id, reqBody) {
  return Order.findById(id)
    .then(order => {
      Object.assign(order, reqBody);
      return order.save();
    })
};

Order.destroyLineItem = function(orderId, id) {
  return conn.models.lineitem.destroy({ where: { orderId, id }});
};

Order.findOrderList = function() {
  // list of submitted orders
  return Order.findAll({
    where: { isCart: false },
    include: [{
      model: conn.models.lineitem,
      include: [ conn.models.product ]
    }]
  })
};

Order.findCart = function() {
  return Order.findOne({ where: { isCart: true }})
    .then(order => {
      if (!order) return Order.create();
      return order;
    })
};


Order.addProductToCart = function(productId) {
  return this.findCart()
    .then(order => {
      // find if product is already in the cart
      return conn.models.lineitem.findAll({ where: {
          productId,
          orderId: order.id
        }})
        .then(lineitem => {
          // if product is in the cart, increment quantity by 1
          if (lineitem.length) {
            lineitem[0].quantity++;
            return lineitem[0].save();
          }
          else {
            // if product not in cart, create new lineitem
            return conn.models.lineitem.create({
                orderId: order.id,
                productId
              })
              .then(lineitem => {
                return lineitem.save();
              })
          }
      })
    })
};

module.exports = Order;
