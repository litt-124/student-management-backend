'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * ComputerSchema
 */
const ComputerSchema = new Schema({
  name: { type: String, required: true },
  ipAddress: { type: String, required: true },
  labId: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('Computer', ComputerSchema);
