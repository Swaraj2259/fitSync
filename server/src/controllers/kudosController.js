const Kudos = require('../models/Kudos');
const User = require('../models/User');

exports.giveKudos = async (req, res, next) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id;

    const kudos = await Kudos.create({ from, to, message });

    // Increment points for the recipient (e.g., 5 points per kudos)
    await User.findByIdAndUpdate(to, { $inc: { totalPoints: 5 } });

    const io = req.app.get('io');

    if (io) {
      console.log(`Sending kudos to user_${to}`);

      io.to(`user_${to}`).emit('kudosReceived', {
        from: { _id: req.user._id, name: req.user.name },
        message,
        createdAt: kudos.createdAt
      });
    }

    res.status(201).json(kudos);

  } catch (err) {
    next(err);
  }
};

exports.getMyKudos = async (req, res, next) => {
  try {
    const kudos = await Kudos.find({ to: req.user._id })
      .populate('from', 'name email')
      .sort({ createdAt: -1 });
    res.json(kudos);
  } catch (err) {
    next(err);
  }
};