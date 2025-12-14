const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  metric: Number,  // e.g., steps or minutes
  unit: { type: String, default: 'points' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);