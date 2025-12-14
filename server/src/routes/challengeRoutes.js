const express = require('express');
const router = express.Router();

const {
  create,
  list,
  getById
} = require('../controllers/challengeController');

const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// GET /api/challenges
router.get('/', list);

// GET /api/challenges/:id   (optional)
router.get('/:id', getById);

// POST /api/challenges  (any authenticated user)
router.post('/', protect, create);

module.exports = router;