// server/src/controllers/userController.js
const User = require('../models/User');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { passwordHash: 0, __v: 0 }).sort({ name: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id, { passwordHash: 0, __v: 0 });
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (err) {
    next(err);
  }
};