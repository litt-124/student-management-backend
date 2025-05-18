'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * AnswerSchema
 */
const AnswerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  value: { type: String, required: false,default:null },
  attachment: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('Answer', AnswerSchema);