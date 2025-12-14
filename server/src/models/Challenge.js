const mongoose = require('mongoose');
const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  targetMetric: { type: String, default: 'steps' }, // or 'minutes'
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);