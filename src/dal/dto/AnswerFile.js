'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * AnswerFileSchema
 */
const AnswerFileSchema = new Schema({
  answerId: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
  fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('AnswerFile', AnswerFileSchema);