const coreValidation = require('./common-validation');

module.exports = {
  activate: {
    body: {
      form: {
        password: coreValidation.password,
        token: coreValidation.required,
      },
    },
  },
  reset: {
    body: {
      form: {
        password: coreValidation.password,
        token: coreValidation.required,
      },
    },
  },
};
