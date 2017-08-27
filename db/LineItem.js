const Sequelize = require('sequelize');
const conn = require('./conn');

const LineItem = conn.define('lineitem', {
  quantity: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: false
});

module.exports = LineItem;
