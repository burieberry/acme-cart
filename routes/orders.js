// const { Order } = require('../db').models;
const app = require('express').Router();

const db = require('../db');
const Product = db.models.Product,
      Order = db.models.Order,
      LineItem = db.models.LineItem;

app.get('/', (req, res, next) => {
  return Promise.all([
      Product.findAll(),
      Order.findOrderList(),
      LineItem.findLineItemsList()
    ])
    .then(([products, orders, lineitems]) => {
      res.render('index', { products, orders, lineitems });
    })
    .catch(next);
})

app.put('/:id', (req, res, next)=> {
  Order.updateFromRequestBody(req.params.id, req.body)
    .then(() => res.redirect('/'))
    .catch(ex => {
      if(ex.message === 'address required'){
        return res.render('index', { error: ex });
      }
      next(ex);
    });
});

app.post('/:id/lineItems', (req, res, next)=> {
  Order.addProductToCart(req.body.productId*1)
    .then(()=> res.redirect('/'))
    .catch(next);
});

app.delete('/:orderId/lineItems/:id', (req, res, next)=> {
  Order.destroyLineItem(req.params.orderId, req.params.id)
    .then(()=> res.redirect('/'))
    .catch(next);
});

module.exports = app;
