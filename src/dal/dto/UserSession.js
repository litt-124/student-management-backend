'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * UserSessionSchema
 */
const UserSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  ipAddress: { type: String },
  token: { type: String }
}, { timestamps: true });
mongoose.model('UserSession', UserSessionSchema);