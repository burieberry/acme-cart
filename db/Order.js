const Sequelize = require('sequelize');
const conn = require('./conn');

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

Order.addProductToCart = function(id) {
  return conn.models.product.findById(id)
    // identify product to add to cart
    .then(product => {
      return Order.findOne({ where: { isCart: true }})
        // find if there's an order in the cart
        .then(order => {
          if (!order) {
            // if no order in the cart, create new order
            return Order.create({ isCart: true })
              .then(order => { return order });
          }
          // else, return order
          return order;
        })
        .then(order => {
          // find if product is already in the cart
          return conn.models.lineitem.findAll({ where: {
              productId: product.id,
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
                    quantity: 1,
                    orderId: order.id,
                    productId: product.id
                  })
                  .then(lineitem => {
                    return lineitem.save();
                  })
              }
          })
        })
    })
};

Order.findOrderList = function() {
  // list of submitted orders
  return Order.findAll({
    where: { isCart: false },
    include: [{
      model: conn.models.lineitem,
      include: conn.models.product
    }]
  })
}

Order.destroyLineItem = function(orderId, id) {
  return conn.models.lineitem.destroy({ where: { orderId, id }});
};

module.exports = Order;
