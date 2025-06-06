'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * LabSchema
 */
const LabSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('Lab', LabSchema);
