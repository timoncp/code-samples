const { Schema } = require('mongoose');
const { schemaOptions } = require('path/to/db/helper');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: { type: String, select: false },
  salt: { type: String, select: false },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'role',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  createdAt: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  lastModified: Date,
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  enabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null, select: false },
  resetPasswordExpires: { type: Date, default: null, select: false },
  activationToken: { type: String, default: null, select: false },
  activationExpires: { type: Date, default: null, select: false },
  clientId: { type: Schema.Types.ObjectId, ref: 'client' },
}, Object.assign({}, schemaOptions));

module.exports = userSchema;
