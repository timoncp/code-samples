const coreValidation = require('./common-validation');

module.exports = {
  createUser: {
    body: {
      form: {
        firstName: coreValidation.userFirstName,
        lastName: coreValidation.userLastName,
        email: coreValidation.userEmail,
        role: coreValidation.userRole,
      },
    },
  },
  updateUser: {
    body: {
      form: {
        _id: coreValidation.objectId,
        firstName: coreValidation.userFirstName,
        lastName: coreValidation.userLastName,
        role: coreValidation.userRole,
      },
    },
  },
  deleteUser: {
    body: {
      form: {
        userId: coreValidation.objectId,
      },
    },
  },
  updateProfile: {
    body: {
      form: {
        firstName: coreValidation.userFirstName,
        lastName: coreValidation.userLastName,
      },
    },
  },
  changePassword: {
    body: {
      form: {
        oldPassword: coreValidation.required,
        newPassword: coreValidation.password,
      },
    },
  },
  changeUserStatus: {
    body: {
      form: {
        userId: coreValidation.objectId,
        enabled: coreValidation.boolean,
      },
    },
  },
};
