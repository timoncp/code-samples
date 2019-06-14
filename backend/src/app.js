const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const Raven = require('raven');

const config = require('path/to/config/helper').getConfig();
const routes = require('path/to/routes');
const errorHandler = require('path/to/error/handler');

const app = express();

if (!config.dev) {
  // configure sentry and connect to sentry app
  Raven.config(process.env.SENTRY_KEY || '', {
    autoBreadcrumbs: {
      http: true,
    },
  }).install();

  // Sentry request handler must be the first
  // middleware on the app
  app.use(Raven.requestHandler());
}

// Config middleware
app
  .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  .use(bodyParser.json({ limit: '50mb' }))
  .use(cors())
  .use(express.static('static'))
  .use(express.static('public'));


if (config.dev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/api/ping', (req, res) => {
  res.status(200).json({
    status: 'OK',
  });
});

app.use(routes); // routes

// Config headers
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Cache-Control', 'no-store');
  res.header('Cache-Control', 'no-cache');
  res.header('Pragma', 'no-store');
  res.header('Content-type', 'application/json;charset=utf-8');
  next();
});

// router error handler
app.use(errorHandler);

module.exports = app;
