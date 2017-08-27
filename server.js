const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
nunjucks.configure('views', { noCache: true });

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
