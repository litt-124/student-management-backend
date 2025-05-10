'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * AnswerSchema
 */
const AnswerSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  value: { type: String, required: true },
  attachment: { type: String }
}, { timestamps: true });
mongoose.model('Answer', AnswerSchema);