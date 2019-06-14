const devConfig = require('../config/config.dev.js');
const prodConfig = require('../config/config.prod.js');

const isDevEnvironment = () =>
  process.env.NODE_ENV === 'development' || process.argv.indexOf('-dev') !== -1;

const getConfig = function getConfig() {
  return isDevEnvironment() ? devConfig : prodConfig;
};

module.exports = {
  getConfig,
  isDevEnvironment,
};
