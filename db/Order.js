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
    .then(product => {
      return Order.findAll({ where: { isCart: true }})
        .then(orders => {
          if (!orders.length) {
            return Order.create({ isCart: true })
              .then(order => { return order });
          }
          else {
            orders[0].isCart = true;
            return orders[0].save();
          }
        })
        .then(order => {
          return conn.models.lineitem.findAll({ where: {
              productId: product.id,
              orderId: order.id
            }})
            .then(lineitem => {
              if (lineitem.length) {
                lineitem[0].quantity++;
                return lineitem[0].save();
              }
              else {
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
