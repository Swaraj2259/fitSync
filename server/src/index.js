// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');   // <-- IMPORTANT
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const activityRoutes = require('./routes/activityRoutes');
const kudosRoutes = require('./routes/kudosRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());


// ========================= ROUTES ==============================
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/kudos', kudosRoutes);
app.use('/api/users', userRoutes);
// error handler (keep last)
app.use(errorHandler);

// ========================= SOCKET & SERVER ======================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// expose socket.io to controllers
app.set('io', io);

// ========================= SOCKET HANDLERS ======================
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // ---- AUTHENTICATE SOCKET ----
  socket.on('authenticate', async (token) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.id;

      socket.userId = userId;
      socket.join(`user_${userId}`);

      console.log(`Socket ${socket.id} authenticated as user ${userId}`);
      socket.emit('authSuccess', { userId });

    } catch (err) {
      console.log('Socket auth failed');
      socket.emit('authError', { message: 'Invalid token' });
      socket.disconnect();
    }
  });

  // ---- JOIN CHALLENGE ROOM ----
  socket.on('joinChallenge', (challengeId) => {
    socket.join(`challenge_${challengeId}`);
    console.log(`Socket ${socket.id} joined challenge_${challengeId}`);
  });

  // ---- LEAVE CHALLENGE ROOM ----
  socket.on('leaveChallenge', (challengeId) => {
    socket.leave(`challenge_${challengeId}`);
    console.log(`Socket ${socket.id} left challenge_${challengeId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// ========================= START DB & SERVER ====================
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      const PORT = process.env.PORT || 5001;
      server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    } catch (err) {
      console.error('Failed to start server', err);
      process.exit(1);
    }
  })();
}

module.exports = { app, server, io };