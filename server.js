const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
nunjucks.configure('views', { noCache: true });

const db = require('./db');
const { Product, Order, LineItem } = db.models;

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/', express.static(require('path').join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

app.get('/', (req, res, next) => {
  Order.findEverything()
    .then(([products, orders, lineitems]) => {
      res.render('index', { products, orders, lineitems });
    })
    .catch(next);
})

app.use('/orders', require('./routes/orders'));

app.use((req, res, next) => {
  const error = new Error('Page not found.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  if (err.message === 'address required') {
    return Order.findEverything()
      .then(([products, orders, lineitems]) => {
        res.render('index', { products, orders, lineitems, error: err });
      })
  }
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  db.sync()
    .then(db.seed)
    .then(() => {
      console.log(`Listening on port ${port}.`);
    })
    .catch(console.error);
});
