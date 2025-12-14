// server/src/routes/activityRoutes.js
const express = require('express');
const router = express.Router();

const { logActivity, leaderboard, listActivities, getWeeklyStats } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const { requireMetric } = require('../middleware/validate');

// POST /api/activity  → log activity (protected + validate)
router.post('/', protect, requireMetric, logActivity);

// GET /api/activity/stats → weekly stats for chart
router.get('/stats', protect, getWeeklyStats);

// GET /api/activity  → list activities (protected, defaults to current user)
router.get('/', protect, listActivities);

// GET /api/activity/leaderboard?challengeId=...  → leaderboard aggregation
router.get('/leaderboard', protect, leaderboard);

module.exports = router;