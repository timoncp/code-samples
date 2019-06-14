const moment = require('moment');
const _get = require('lodash/get');
const _isError = require('lodash/isError');

const login = require('path/to/login/helper');
const pwd = require('path/to/pwd/helper');
const user = require('path/to/model');

async function login(req, res, next) {
  const userData = await user.authenticate(req.body).catch(error => ({ error }));
  const userError = _get(userResponse, 'error', {});

  if (_isError(userError)) {
    return next(userResponse);
  }

  if (!userData) {
    return next({ status: 401, message: 'WARN_WRONG_CREDENTIALS' });
  }

  if (!userData.enabled || !userData.active || !userData.clientId.active) {
    return next({ status: 400, message: 'WARN_ACCOUNT_DISABLED' });
  }

  const newToken = await login
    .createToken({
      _id: userData._id,
      email: userData.email,
      role: userData.role,
      clientId: userData.clientId,
      firstName: userData.firstName,
      lastName: userData.lastName,
    })
    .catch(error => ({ error }));

  const newTokenError = _get(newToken, 'error', {});

  if (_isError(newTokenError)) {
    return next(newToken);
  }

  return res.status(200).json({
    token: newToken,
    user: userData,
    message: 'SUCCESS_AUTHENTICATION',
  });
}

async function verifyToken(req, res) {
  let token = _get(req, 'headers.authorization', '');

  if (token.indexOf('Bearer') !== -1) {
    token = token.replace('Bearer ', '');
  }

  const tokenData = await login.verifyToken(token).catch(error => ({ error }));
  const tokenError = _get(tokenData, 'error', {});

  if (_isError(tokenError)) {
    return res.status(200).json({
      isAuthenticated: false,
    });
  }

  return res.status(200).json({
    isAuthenticated: true,
    user: tokenData,
  });
}

async function renewToken(req, res, next) {
  let token = req.headers.authorization || req.query.token || '';

  if (token.indexOf('Bearer') !== -1) {
    token = token.replace('Bearer ', '');
  }

  const tokenData = await login.verifyToken(token).catch(error => ({ error }));
  const tokenError = _get(tokenData, 'error', {});

  if (_isError(tokenError)) {
    return next({ status: 401, message: 'WARN_AUTH_TOKEN_INVALID' });
  }

  const userResponse = await user.findUserById(tokenData._id).catch(error => ({ error }));
  const userError = _get(userResponse, 'error', {});

  if (_isError(userError)) {
    return next(userResponse);
  }

  const newToken = await login
    .createToken({
      _id: userResponse._id,
      email: userResponse.email,
      role: userResponse.role,
      clientId: userResponse.clientId,
      firstName: userResponse.firstName,
      lastName: userResponse.lastName,
      impersonator: tokenData.impersonator,
      clientName: tokenData.clientName,
    })
    .catch(error => ({ error }));

  const newTokenError = _get(newToken, 'error', {});

  if (_isError(newTokenError)) {
    return next(newToken);
  }

  return res.status(200).json({
    token: newToken,
    user: userResponse,
  });
}

async function activate(req, res, next) {
  const userData = req.body.form;

  const userResponse = await user.getUserByActivationToken(userData.token).catch(error => ({ error }));
  const userError = _get(userResponse, 'error', {});

  if (_isError(userError)) {
    return next(userResponse);
  }

  if (!userResponse || moment().isAfter(moment(userResponse.activationExpires))) {
    return next({ status: 400, message: 'WARN_TOKEN_INVALID' });
  }

  const userActivatedResponse = await user.activateUser(userResponse._id).catch(error => ({ error }));
  const userActivatedError = _get(userActivatedResponse, 'error', {});

  if (_isError(userActivatedError)) {
    return next(userActivatedResponse);
  }

  const hashWithSalt = pwd.hashWithSalt(userData.password);

  const passwordUpdateResponse = await user
    .updatePassword(userResponse._id, hashWithSalt)
    .catch(error => ({ error }));
  const passwordUpdateError = _get(passwordUpdateResponse, 'error', {});

  if (_isError(passwordUpdateError)) {
    return next(passwordUpdateResponse);
  }

  if (!passwordUpdateResponse) {
    return next({ status: 404, message: 'WARN_DATA_NOT_FOUND' });
  }

  return res.status(200).json({
    message: 'SUCCESS_PASSWORD_CHANGED',
  });
}

module.exports = {
  login,
  renewToken,
  activate,
  verifyToken,
};
