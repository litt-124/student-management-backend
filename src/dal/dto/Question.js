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
  exam_id: { type: Schema.Types.ObjectId, ref: 'Exam', required: true }
}, { timestamps: true });
mongoose.model('Question', QuestionSchema);
