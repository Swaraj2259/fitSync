const express = require('express');
const router = express.Router();

const { giveKudos, getMyKudos } = require('../controllers/kudosController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/kudos  → send kudos to another user
router.post('/', protect, giveKudos);

// GET /api/kudos/my → get kudos received by current user
router.get('/my', protect, getMyKudos);

module.exports = router;