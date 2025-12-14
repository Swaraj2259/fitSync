const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  totalPoints: { type: Number, default: 0 },
  badges: [{
    name: String,
    icon: String,
    date: { type: Date, default: Date.now }
  }]
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
