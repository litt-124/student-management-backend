'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * QuestionFileSchema
 */
const QuestionFileSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('QuestionFile', QuestionFileSchema);