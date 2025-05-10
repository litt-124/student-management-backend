'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * StudentActivitySchema
 */
const StudentActivitySchema = new Schema({
  session_id: { type: Schema.Types.ObjectId, ref: 'UserSession', required: true },
  exam_id: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date }
}, { timestamps: true });
mongoose.model('StudentActivity', StudentActivitySchema);