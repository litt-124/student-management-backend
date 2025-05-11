'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * FileSchema
 */
const FileSchema = new Schema({
  name: { type: String, required: true },
  content: { type: Buffer, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('File', FileSchema);
