'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * QuestionSchema
 */
const QuestionSchema = new Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, required: true },
  attachments: { type: String },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('Question', QuestionSchema);
