const Challenge = require('../models/Challenge');

exports.create = async (req, res) => {
  try {
    const challengeData = { ...req.body, createdBy: req.user._id };
    const challenge = await Challenge.create(challengeData);
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: 'Error creating challenge', error: err });
  }
};

exports.list = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ startDate: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching challenges', error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching challenge', error: err });
  }
};