// server/src/controllers/activityController.js
const Activity = require('../models/Activity');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.logActivity = async (req, res, next) => {
  try {
    const { challengeId, metric, unit } = req.body;
    const userId = req.user._id;

    const activity = await Activity.create({
      user: userId,
      challenge: challengeId,
      metric,
      unit: unit || 'points'
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: metric } },
      { new: true }
    );

    // --- BADGE LOGIC ---
    const newBadges = [];
    const totalPoints = updatedUser.totalPoints;
    const activityCount = await Activity.countDocuments({ user: userId });

    const hasBadge = (name) => updatedUser.badges.some(b => b.name === name);

    if (!hasBadge('First Step') && activityCount >= 1) {
      newBadges.push({ name: 'First Step', icon: '👟' });
    }
    if (!hasBadge('High Flyer') && totalPoints >= 5000) {
      newBadges.push({ name: 'High Flyer', icon: '🦅' });
    }
    if (!hasBadge('Marathoner') && totalPoints >= 10000) {
      newBadges.push({ name: 'Marathoner', icon: '🏃' });
    }
    if (!hasBadge('Consistent') && activityCount >= 10) {
      newBadges.push({ name: 'Consistent', icon: '📅' });
    }

    if (newBadges.length > 0) {
      await User.findByIdAndUpdate(userId, { $push: { badges: { $each: newBadges } } });
    }
    // -------------------

    const challengeObjectId = new mongoose.Types.ObjectId(challengeId);

    const agg = await Activity.aggregate([
      { $match: { challenge: challengeObjectId } },
      { $group: { _id: '$user', total: { $sum: '$metric' } } },
      { $sort: { total: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          total: 1,
          'user._id': 1,
          'user.name': 1,
          'user.email': 1
        }
      }
    ]);

    const io = req.app.get('io');
    if (io) {
      io.to(`challenge_${challengeId}`).emit('leaderboardUpdate', {
        challengeId,
        leaderboard: agg
      });

      io.to(`user_${userId}`).emit('userTotalUpdated', {
        userId,
        totalPoints: updatedUser.totalPoints
      });
    }

    res.status(200).json(activity);
  } catch (err) {
    next(err);
  }
};

exports.leaderboard = async (req, res, next) => {
  try {
    const { challengeId } = req.query;
    if (!challengeId) return res.status(400).json({ message: 'challengeId required' });

    const challengeObjectId = new mongoose.Types.ObjectId(challengeId);
    const agg = await Activity.aggregate([
      { $match: { challenge: challengeObjectId } },
      { $group: { _id: '$user', total: { $sum: '$metric' } } },
      { $sort: { total: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          total: 1,
          'user._id': 1,
          'user.name': 1,
          'user.email': 1
        }
      }
    ]);
    res.json(agg);
  } catch (err) {
    next(err);
  }
};

exports.getWeeklyStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const stats = await Activity.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          points: { $sum: "$metric" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days with 0
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const found = stats.find(s => s._id === dateStr);
      result.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        points: found ? found.points : 0
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/activity
 * Returns activity logs.
 * If query ?userId= is provided (or default to the authenticated user), returns filtered logs.
 * Admins can pass no userId to get all logs (optional).
 */
exports.listActivities = async (req, res, next) => {
  try {
    // allow optional query param ?userId= or default to authenticated user
    const queryUser = req.query.userId || req.user && req.user._id;
    const q = {};
    if (queryUser) q.user = queryUser;

    // optional: support pagination later (skip/limit)
    const activities = await Activity.find(q).sort({ createdAt: -1 }).limit(200).lean();

    // attach challenge titles client-side; return as-is
    res.json(activities);
  } catch (err) {
    next(err);
  }
};