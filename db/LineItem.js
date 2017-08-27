const Sequelize = require('sequelize');
const conn = require('./conn');

const LineItem = conn.define('lineitem', {
  quantity: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: false
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

// LineItem.createNewLineItem = function(id) {
//   return LineItem.create({ quantity: 1,  })
// }


module.exports = LineItem;
