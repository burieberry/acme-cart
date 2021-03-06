const Sequelize = require('sequelize');
const conn = require('./conn');

const LineItem = conn.define('lineitem', {
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
});

LineItem.findLineItemsList = function() {
  return LineItem.findAll({
    where: { quantity: { $gt: 0 } },
    include: [
      conn.models.product,
      {
        model: conn.models.order,
        where: { isCart: true }
      }
    ]
  });
};

module.exports = LineItem;
