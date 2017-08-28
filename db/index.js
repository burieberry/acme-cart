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

Order.hasMany(LineItem);
LineItem.belongsTo(Order);
LineItem.belongsTo(Product);

Order.addProductToCart = function(id) {
  return Product.findById(id)
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
          return LineItem.findAll({ where: { productId: product.id, orderId: order.id }})
            .then(lineitem => {
              if (lineitem.length) {
                lineitem[0].quantity++;
                return lineitem[0].save();
              }
              else {
                return LineItem.create({
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


module.exports = {
  seed,
  sync,
  models: {
    Product,
    Order,
    LineItem
  }
}
