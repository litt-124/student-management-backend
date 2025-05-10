'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * FileSchema
 */
const FileSchema = new Schema({
  name: { type: String, required: true },
  content: { type: Buffer, required: true }
}, { timestamps: true });
mongoose.model('File', FileSchema);
