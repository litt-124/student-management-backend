'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * LabSchema
 */
const LabSchema = new Schema({
  name: { type: String, required: true }
}, { timestamps: true });
mongoose.model('Lab', LabSchema);
