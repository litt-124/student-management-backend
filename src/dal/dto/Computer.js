'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * ComputerSchema
 */
const ComputerSchema = new Schema({
  name: { type: String, required: true },
  ip_address: { type: String, required: true },
  lab_id: { type: Schema.Types.ObjectId, ref: 'Lab', required: true }
}, { timestamps: true });
mongoose.model('Computer', ComputerSchema);
