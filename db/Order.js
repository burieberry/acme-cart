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

// Order.hook('beforeUpdate', (order) => {
//   if (!order.address) {
//     throw new Error('address required');
//   }
// });

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

Order.updateFromRequestBody = function(id, reqBody) {
  if (!reqBody.address) throw new Error('address required');

  return Order.findById(id)
    // move order from cart to submitted orders (only if there's an address)
    .then(order => {
      order.isCart = false;
      order.address = reqBody.address;
      return order.save();
    })
};

Order.destroyLineItem = function(orderId, id) {
  return this.findById(orderId)
    .then(order => {
      return order.getLineitems({ where: { id: id }})
        .then(lineitems => {
          return lineitems[0].destroy();
        })
    })
};

module.exports = Order;
