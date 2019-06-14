const uuidv4 = require('uuid/v4');
const moment = require('moment');
const _get = require('lodash/get');
const _isError = require('lodash/isError');
const _isEmpty = require('lodash/isEmpty');

const pwd = require('path/to/password/helper');
const email = require('path/to/email/helper');
const user = require('path/to/user/model');

async function getUsers(req, res, next) {
  const caller = req.user;
  const showEnabledOnly = (req.query.showDisabled !== 'true');

  const data = await user.getAllUsersPerClient(caller.clientId, showEnabledOnly).catch(error => ({ error }));
  const error = _get(data, 'error', {});

  if (_isError(error)) {
    return next(data);
  }

  return res.status(200).json({
    data: getSelectableData(userSchema, data),
  });
}

async function getProfile(req, res, next) {
  const caller = req.user;

  const data = await user.getProfile(caller._id).catch(error => ({ error }));
  const error = _get(data, 'error', {});

  if (_isError(error)) {
    return next(data);
  }

  return res.status(200).json({
    data,
  });
}

async function createUser(req, res, next) {
  const caller = req.user;
  const userData = req.body.form;

  const foundUser = await user.findUserByEmail(userData.email);
  const foundUserError = _get(foundUser, 'error', {});

  if (_isError(foundUserError)) {
    return next(foundUser);
  } else if (!_isEmpty(foundUser)) {
    return res.status(400).json({
      statusText: 'WARN_USER_EXISTS',
      errors: [
        {
          field: ['form', 'email'],
          messages: ['WARN_USER_EXISTS'],
        },
      ],
    });
  }

  const currentDate = moment();
  const userForm = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email.toLowerCase(),
    createdAt: currentDate,
    createdBy: caller._id,
    lastModified: currentDate,
    lastModifiedBy: caller._id,
    role: roleId,
    enabled: true,
    clientId: caller.clientId,
  };

  const userResponse = await user.createUser(userForm, caller).catch(error => ({ error }));
  const userError = _get(userResponse, 'error', {});

  if (_isError(userError)) {
    return next(userResponse);
  }

  const token = uuidv4();

  const userActivationResponse = await user.setActivationToken(userResponse._id, token)
    .catch(error => ({ error }));
  const userActivationError = _get(userActivationResponse, 'error', {});

  if (_isError(userActivationError)) {
    return next(userActivationResponse);
  }

  email.sendActivationEmail(userResponse.email, userData.returnUrl, token, userData.lang);

  return res.status(200).json({
    data: userResponse,
    message: 'SUCCESS_DATA_SAVED',
  });
}

async function updateUser(req, res, next) {
  const caller = req.user;
  const userData = req.body.form;

  const userId = userData._id;
  const updateData = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: roleId,
    lastModified: moment(),
    lastModifiedBy: caller._id,
  };

  const data = await user.updateUser(caller, userId, updateData).catch(error => ({ error }));
  const error = _get(data, 'error', {});

  if (_isError(error)) {
    return next(data);
  }

  if (!data) {
    return next({ status: 404, message: 'WARN_DATA_NOT_FOUND' });
  }

  return res.status(200).json({
    data,
    message: 'SUCCESS_DATA_SAVED',
  });
}

async function deleteUser(req, res, next) {
  const caller = req.user;
  const userData = req.body.form;

  const data = await user.deleteUser(caller, userData.userId).catch(error => ({ error }));
  const error = _get(data, 'error', {});

  if (_isError(error)) {
    return next(data);
  }

  if (!data) {
    return next({ status: 404, message: 'WARN_DATA_NOT_FOUND' });
  }

  return res.status(200).json({
    data,
    message: 'SUCCESS_DATA_DELETED',
  });
}

async function changePassword(req, res, next) {
  const caller = req.user;
  const { newPassword, oldPassword } = req.body.form;

  const userData = await user.findUserByIdWithSensitiveData(caller._id).catch(error => ({ error }));
  const userError = _get(userData, 'error', {});

  if (_isError(userError)) {
    return next(userData);
  }

  if (!userData) {
    return next({ status: 404, message: 'WARN_USER_NOT_FOUND' });
  }

  const { salt } = userData;
  const storedHash = userData.password;
  const computedHash = pwd.computeSaltedHash(oldPassword, salt);

  if (storedHash !== computedHash) {
    return res.status(400).json({
      statusText: 'WARN_INCORRECT_OLD_PASSWORD',
      errors: [
        {
          field: ['form', 'oldPassword'],
          messages: ['WARN_INCORRECT_OLD_PASSWORD'],
        },
      ],
    });
  }

  const hashWithSalt = pwd.hashWithSalt(newPassword);

  const newUserData = await user.updatePassword(caller._id, hashWithSalt).catch(error => ({ error }));
  const newUserError = _get(newUserData, 'error', {});

  if (_isError(newUserError)) {
    return next(newUserData);
  }

  if (!newUserData) {
    return next({ status: 404, message: 'WARN_DATA_NOT_FOUND' });
  }

  return res.status(200).json({
    message: 'SUCCESS_PASSWORD_CHANGED',
  });
}

async function resendActivationEmail(req, res, next) {
  const userData = req.body.form;
  const token = uuidv4();

  const data = await user.setActivationToken(userData.userId, token).catch(error => ({ error }));
  const error = _get(data, 'error', {});

  email.sendActivationEmail(data.email, userData.returnUrl, token, userData.lang);

  if (_isError(error)) {
    return next(data);
  }

  return res.status(200).json({
    data,
    message: '',
  });
}

module.exports = {
  getUsers,
  getProfile,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  resendActivationEmail,
};
