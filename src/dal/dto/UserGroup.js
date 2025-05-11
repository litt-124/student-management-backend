'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * UserGroupSchema
 */
const UserGroupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('UserGroup', UserGroupSchema);