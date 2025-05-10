'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * UserSessionSchema
 */
const UserSessionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date },
  ip_address: { type: String },
  token: { type: String }
}, { timestamps: true });
mongoose.model('UserSession', UserSessionSchema);