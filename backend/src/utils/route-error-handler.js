const _isError = require('lodash/isError');
const ev = require('express-validation');
const Raven = require('raven');
const config = require('../helpers/configHelpers').getConfig();

const console = require('./console');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ev.ValidationError) {
    return res.status(err.status).json(err);
  } else if (_isError(err.error)) {
    console.log(err.error); // eslint-disable-line no-console

    if (!config.dev) {
      const user = req.user || null;
      const headers = req.headers || {};

      // only collect user and client context
      // if user present on request
      if (user) {
        Raven.setContext({
          user: {
            id: user._id,
            email: user.email,
            ip_address: user.requestIp,
            'Role': { // eslint-disable-line quote-props
              access: user.role.access || {},
              label: user.role.label || '',
            },
            'Client ID': user.clientId,
          },
          tags: {
            client_id: user.clientId,
          },
        });
      }

      Raven.captureException(err.error, {
        extra: {
          user_agent: headers['user-agent'] || '',
        },
      });
    }
  }

  const error = err || {};
  const status = error.status || 500;
  const message = {
    message: error.message || 'ERROR_SOMETHING_WENT_WRONG',
    data: error.data,
  };
  next();
  return res.status(status).send(message);
};

module.exports = errorHandler;
