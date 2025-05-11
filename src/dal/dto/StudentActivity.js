'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * StudentActivitySchema
 */
const StudentActivitySchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'UserSession', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
mongoose.model('StudentActivity', StudentActivitySchema);