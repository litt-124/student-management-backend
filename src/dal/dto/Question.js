'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * QuestionSchema
 */
const QuestionSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  type: { type: String, enum: ['text', 'multiple-choice', 'file-upload'], required: true },
  title: { type: String, required: true },
  answerOptions: [String], // only for multiple-choice
  allowAttachments: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('Question', QuestionSchema);
