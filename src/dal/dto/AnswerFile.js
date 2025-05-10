'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * AnswerFileSchema
 */
const AnswerFileSchema = new Schema({
  answer_id: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
  file_id: { type: Schema.Types.ObjectId, ref: 'File', required: true }
}, { timestamps: true });
mongoose.model('AnswerFile', AnswerFileSchema);