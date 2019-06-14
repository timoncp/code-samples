const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const _get = require('lodash/get');

const privateKey = fs.readFileSync(path.resolve(__dirname, '../config/private.key'));

const parseToken = (token) => {
  if (!token) {
    return false;
  }

  return token.replace('Bearer ', '');
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, privateKey);
  } catch (e) {
    return false;
  }
};

const isAllowed = ({ user, access }) => {
  const userPermissions = user.role.access;

  return Object.keys(userPermissions).find((permission) => {
    const permissionStatus = userPermissions[permission];
    return (permissionStatus === true && access.indexOf(permission) !== -1);
  });
};

const permit = (access) => {
  return (req, res, next) => {
    const requestIp = req.connection.remoteAddress;

    // allow public route
    if (access.indexOf('all') !== -1) {
      return next();
    }

    const headerAuthorization = _get(req, 'headers.authorization', '');
    const authToken = parseToken(headerAuthorization);

    if (!authToken) {
      return res.status(401).json({
        message: 'WARN_AUTH_TOKEN_INVALID',
      });
    }

    const userInfo = verifyToken(authToken);
    if (!userInfo) {
      return res.status(401).json({
        message: 'WARN_AUTH_TOKEN_INVALID',
      });
    }

    if (!isAllowed({ user: userInfo, access })) {
      return res.status(403).json({
        message: 'WARN_AUTH_PERMISSION_DENIED',
      });
    }

    req.user = Object.assign({}, userInfo, { requestIp }); // eslint-disable-line no-param-reassign
    req.token = authToken; // eslint-disable-line no-param-reassign

    // everything is ok - the user is allowed
    return next();
  };
};

module.exports = permit;
