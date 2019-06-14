const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const getAPIKey = () => fs.readFileSync(path.resolve(__dirname, 'path/to/private.key'));

async function verifyToken(token) {
  const key = getAPIKey();

  let tokenData;
  try {
    tokenData = await jwt.verify(token, key);
  } catch (e) {
    throw new Error(e);
  }

  return tokenData;
}

async function createToken(user) {
  const key = getAPIKey();

  let newToken;
  try {
    newToken = jwt.sign(user, key, { expiresIn: 60 * 60 * 24 });
  } catch (e) {
    throw new Error(e);
  }

  return newToken;
}

module.exports = {
  createToken,
  verifyToken,
};
