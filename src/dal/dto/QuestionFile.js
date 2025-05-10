'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * QuestionFileSchema
 */
const QuestionFileSchema = new Schema({
  question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  file_id: { type: Schema.Types.ObjectId, ref: 'File', required: true }
}, { timestamps: true });
mongoose.model('QuestionFile', QuestionFileSchema);