const mongoose = require('mongoose');
const moment = require('moment');

const userSchema = require('path/to/schema')
const appConfig = require('path/to/config').app;
const pwd = require('path/to/password/helper');

const User = mongoose.model('User', userSchema);

async function getAllUsersPerClient(clientId, showEnabledOnly) {
  const query = {
    clientId,
  };

  if (showEnabledOnly) {
    query.enabled = true;
  }

  return User.find(query).sort({ createdAt: -1 }).lean();
}

async function getProfile(userId) {
  return User.findById(userId).lean();
}

async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() }).lean();
}

async function updateResetToken(email, token) {
  const tokenExpires = moment().add(appConfig.resetPasswordTokenValidDays, 'days');

  return User
    .findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: tokenExpires,
      },
    );
}

async function verifyResetToken(token) {
  return User
    .findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: moment() },
    });
}

function updatePassword(userId, hashWithSalt) {
  const data = {
    password: hashWithSalt.hashedPassword,
    salt: hashWithSalt.salt,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    activationToken: null,
    activationExpires: null,
  };

  return User.findOneAndUpdate({ _id: userId }, data, { new: true });
}

async function authenticate(requested) {
  const email = requested.email.toLowerCase();

  const userData = await User.findOne({ email }).lean();

  if (!userData || !userData.password || !userData.salt) return null;

  const { salt } = userData;
  const storedHash = userData.password;
  const computedHash = pwd.computeSaltedHash(requested.password, salt);

  if (storedHash !== computedHash) return null;

  return userData;
}

async function findUserById(_id) {
  return User.findById(_id).lean();
}

async function createUser(form, caller) {
  if (form.email) form.email = form.email.toLowerCase();

  return User.create(form);
}

async function updateUser(caller, userId, userData) {
  const foundUser = await User
    .findOne({ _id: userId, clientId: caller.clientId })
    .catch((e) => { throw new MongoError(e); });

  if (!foundUser) {
    return null;
  }

  if (foundUser.email) foundUser.email = foundUser.email.toLowerCase();

  foundUser.set(userData);

  return foundUser.save();
}

async function setActivationToken(id, token) {
  const tokenExpires = moment().add(appConfig.activationTokenValidDays, 'days');

  return User
    .findByIdAndUpdate(
      id,
      {
        activationToken: token,
        activationExpires: tokenExpires,
      },
      { new: true }
    );
}

async function getUserByActivationToken(token) {
  return User.findOne({ activationToken: token });
}

async function activateUser(id) {
  return User
    .findByIdAndUpdate(
      id,
      {
        active: true,
        enabled: true,
      },
      { new: true }
    );
}

async function deleteUser(caller, userId) {
  const { clientId } = caller;

  const foundUser = await User.findOne({ _id: userId, clientId });

  if (!foundUser) {
    return null;
  }

  return foundUser.remove();
}

async function changeUserStatus(caller, userId, enabled) {
  const { clientId } = caller;

  const foundUser = await User.findOne({ clientId, _id: userId });

  if (!foundUser) {
    return null;
  }

  foundUser.set({ enabled });

  return foundUser.save();
}

module.exports = {
  getAllUsersPerClient,
  getProfile,
  findUserByEmail,
  updateResetToken,
  verifyResetToken,
  updatePassword,
  authenticate,
  findUserById,
  updateUser,
  setActivationToken,
  getUserByActivationToken,
  activateUser,
  createUser,
  deleteUser,
  changeUserStatus,
};
