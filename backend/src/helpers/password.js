const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

const hashWithSalt = (password) => {
  const salt = uuidv4();
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');

  return {
    salt,
    hashedPassword: hash,
  };
};

const computeSaltedHash = (password, salt) => {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
};

module.exports = {
  hashWithSalt,
  computeSaltedHash,
};
