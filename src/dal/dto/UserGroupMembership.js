'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * UserGroupMembershipSchema
 */
const UserGroupMembershipSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  group_id: { type: Schema.Types.ObjectId, ref: 'UserGroup', required: true }
}, { timestamps: true });
mongoose.model('UserGroupMembership', UserGroupMembershipSchema);