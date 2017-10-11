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
      console.log(order.get())
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
    .then( order => {
      return Order.findById(order.id, {
        include: {
          model: conn.models.lineitem,
          include: [ conn.models.product ]
        }
      });
    });
};

Order.addProductToCart = function(productId) {
  return this.findCart()
    .then(order => {
      // find if product is already in the cart
      return conn.models.lineitem.findOne({ where: {
          productId,
          orderId: order.id
        }})
        .then(lineitem => {
          // if product is in the cart, increment quantity by 1
          if (lineitem) {
            lineitem.quantity++;
            return lineitem.save();
          }
          else {
            // if product not in cart, create new lineitem
            return conn.models.lineitem.create({
                orderId: order.id,
                productId
              })
          }
      })
    })
};

module.exports = Order;
