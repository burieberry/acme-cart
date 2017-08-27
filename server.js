const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
nunjucks.configure('views', { noCache: true });

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/', express.static(require('path').join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

app.get('/', (req, res, next) => {
  res.render('index');
});

app.use((req, res, next) => {
  const error = new Error('Page not found.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message, status: err.status, stack: err.stack } || 'Internal server error.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
