const config = require('./config').getConfig();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const reconnectAttemptInterval = 3000;

const schemaOptions = {
  // By default, mongoose buffers commands when the connection goes down
  // until the driver manages to reconnect
  bufferCommands: true,
};

const options = {
  db: {
    // Max Number of operations buffered while waiting for server reconnect
    bufferMaxEntries: 50,
  },
  // Options to set on the server objects, see Server constructor
  server: {
    // Number of tries to reconnect
    reconnectTries: Number.MAX_VALUE,
    // Number of milliseconds between retries
    reconnectInterval: reconnectAttemptInterval,
    // Number of connections in the connection pool
    poolSize: 500,
  },
};

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

if (dbUser && dbPass) {
  options.user = dbUser;
  options.pass = dbPass;
}

const getURL = () =>
  `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.dbname}?authSource=admin`;

const initMongoose = () => {
  return mongoose.connect(getURL(), options).catch(() => {
    console.log('initMongoose(): Error in MongoDB connection.'); // eslint-disable-line no-console

    setTimeout(() => {
      initMongoose();
    }, reconnectAttemptInterval);
  });
};

const connect = () => {
  mongoose.connect(getURL(), options);
  return mongoose.connection;
};

module.exports = {
  initMongoose,
  schemaOptions,
  getURL,
  connect,
};
