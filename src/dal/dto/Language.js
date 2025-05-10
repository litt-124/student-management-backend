'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * LanguageSchema dto, keeps data related with languages
 */
const LanguageSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  active: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false }
}, {
  timestamps: true
});

mongoose.model('Language', LanguageSchema);
