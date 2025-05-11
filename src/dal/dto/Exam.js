'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * ExamSchema
 */
const ExamSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'UserGroup', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  labId: { type: Schema.Types.ObjectId, ref: 'Lab' },
  status: { type: String, enum: ['Scheduled', 'Ongoing', 'Completed'], default: 'Scheduled' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('Exam', ExamSchema);
