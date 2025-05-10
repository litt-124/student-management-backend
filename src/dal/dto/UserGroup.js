'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * UserGroupSchema
 */
const UserGroupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });
mongoose.model('UserGroup', UserGroupSchema);