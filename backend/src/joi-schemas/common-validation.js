const Joi = require('joi');

module.exports = {
  userFirstName: Joi.string().required().options({
    language: {
      any: {
        empty: 'VALIDATION_USER_FIRST_NAME_EMPTY',
      },
    },
  }),
  userLastName: Joi.string().required().options({
    language: {
      any: {
        empty: 'VALIDATION_USER_LAST_NAME_EMPTY',
      },
    },
  }),
  userEmail: Joi.string().email().required().options({
    language: {
      string: {
        email: 'VALIDATION_USER_EMAIL_NOT_VALID',
      },
      any: {
        empty: 'VALIDATION_USER_EMAIL_EMPTY',
      },
    },
  }),
  userRole: Joi.string().required().options({
    language: {
      any: {
        empty: 'VALIDATION_USER_ROLE_EMPTY',
      },
    },
  }),
  objectId: Joi.string().required().options({
    language: {
      any: {
        empty: 'WARN_MISSING_DATA',
      },
    },
  }),
  fileName: Joi.string().required().options({
    language: {
      any: {
        empty: 'WARN_MISSING_DATA',
      },
    },
  }),
  file: Joi.string().base64().required().options({
    language: {
      any: {
        empty: 'WARN_MISSING_DATA',
      },
      string: {
        base64: 'WARN_MISSING_DATA',
      },
    },
  }),
  templateId: Joi.string().required().options({
    language: {
      any: {
        empty: 'WARN_MISSING_DATA',
      },
    },
  }),
  clientId: Joi.string().required().options({
    language: {
      any: {
        empty: 'WARN_MISSING_DATA',
      },
    },
  }),
  industryId: Joi.string().required().options({
    language: {
      any: {
        empty: 'WARN_MISSING_DATA',
      },
    },
  }),
  language: Joi.string().required().options({
    language: {
      any: {
        empty: 'WARN_MISSING_DATA',
      },
    },
  }),
  appStatus: Joi.string().required().options({
    language: {
      any: {
        empty: 'VALIDATION_APPLICATION_STATUS_EMPTY',
      },
    },
  }),
  appType: Joi.string().required().options({
    language: {
      any: {
        empty: 'VALIDATION_APPLICATION_TYPE_EMPTY',
      },
    },
  }),
  appName: Joi.string().required().options({
    language: {
      any: {
        empty: 'VALIDATION_APPLICATION_NAME_EMPTY',
      },
    },
  }),
  required: Joi.string().required().options({
    language: {
      any: {
        empty: 'VALIDATION_FIELD_REQUIRED',
      },
    },
  }),
  boolean: Joi.boolean().required().options({
    language: {
      any: {
        empty: 'VALIDATION_FIELD_REQUIRED',
      },
    },
  }),
  password: Joi.string().regex(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/, { invert: true }).options({
    language: {
      string: {
        regex: {
          invert: {
            base: 'WARN_PASSWORD_INVALID',
          },
        },
      },
    },
  }),
  validationNumber: Joi.number()
    .allow(null)
    .allow('')
    .options({
      language: {
        number: {
          base: 'VALIDATION_FIELD_TO_BE_NUMBER',
        },
      },
    }),
};
