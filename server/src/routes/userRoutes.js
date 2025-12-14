// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { listUsers, getUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


// GET /api/users
router.get('/', protect, listUsers);

// GET /api/users/:id
router.get('/:id', protect, getUser);

module.exports = router;