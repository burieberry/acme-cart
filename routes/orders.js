const { Order } = require('../db').models;
const app = require('express').Router();

app.get('/', (req, res, next) => {
  res.redirect('/');
});

app.put('/:id', (req, res, next)=> {
  Order.updateFromRequestBody(req.params.id, req.body)
    .then(() => res.redirect('/'))
    // .catch(ex => {
    //   if (ex.message === 'address required') {
    //     return res.render('index', { error: ex });
    //   }
    //   next(ex);
    // });
    .catch(next); // note: commented out above, added this
});

app.post('/:id/lineItems', (req, res, next)=> {
  Order.addProductToCart(req.params.id * 1)
    .then(()=> res.redirect('/'))
    .catch(next);
});

app.delete('/:orderId/lineItems/:id', (req, res, next)=> {
  Order.destroyLineItem(req.params.orderId, req.params.id)
    .then(()=> res.redirect('/'))
    .catch(next);
});

module.exports = app;
