const { Order } = require('../db').models;
const app = require('express').Router();

app.put('/:id', (req, res, next)=> {
  Order.updateFromRequestBody(req.params.id, req.body)
    .then(() => res.redirect('/'))
    .catch(ex => {
      if(ex.message === 'address required'){
        console.log(ex);
        return res.render('index', { error: ex });
      }
      next(ex);
    });
});

app.post('/:id/lineItems', (req, res, next)=> {
  // note: this was req.body.productId
  Order.addProductToCart(req.params.id*1)
    .then(()=> res.redirect('/'))
    .catch(next);
});

app.delete('/:orderId/lineItems/:id', (req, res, next)=> {
  Order.destroyLineItem(req.params.orderId, req.params.id)
    .then(()=> res.redirect('/'))
    .catch(next);
});

module.exports = app;
