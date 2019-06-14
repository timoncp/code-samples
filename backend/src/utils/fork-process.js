const { fork } = require('child_process');
const { isDevEnvironment } = require('../helpers/configHelpers');

module.exports = (fileName) => {
  const { DB_USER, DB_PASS, SENTRY_KEY } = process.env;

  const args = isDevEnvironment() ? ['-dev'] : [];

  const options = {};

  if (!isDevEnvironment()) {
    options.env = {
      DB_USER,
      DB_PASS,
      SENTRY_KEY,
    };
  }

  return fork(fileName, args, options);
};
