'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * ExamSchema
 */
const ExamSchema = new Schema({
  title: { type: String, required: true },
  userGroupId: { type: Schema.Types.ObjectId, ref: 'UserGroup', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  labId: { type: Schema.Types.ObjectId, ref: 'Lab', default: null },
  status: { type: String, enum: ['draft', 'scheduled', 'ongoing', 'completed'], default: 'draft' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('Exam', ExamSchema);
