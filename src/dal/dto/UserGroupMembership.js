'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * UserGroupMembershipSchema
 */
const UserGroupMembershipSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userGroupId: { type: Schema.Types.ObjectId, ref: 'UserGroup', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('UserGroupMembership', UserGroupMembershipSchema);