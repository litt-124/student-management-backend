'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * ExamSchema
 */
const ExamSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'UserGroup', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lab_id: { type: Schema.Types.ObjectId, ref: 'Lab' },
  status: { type: String, enum: ['Scheduled', 'Ongoing', 'Completed'], default: 'Scheduled' }
}, { timestamps: true });
mongoose.model('Exam', ExamSchema);
