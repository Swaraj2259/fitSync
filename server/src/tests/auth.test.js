// server/src/tests/auth.test.js
// Run with: MONGO_URI=... npm test  OR ensure .env.test is present

jest.setTimeout(20000); // increase default timeout to 20s for DB ops

const request = require('supertest');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');

// Load test env (so connectDB uses test DB)
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

const connectDB = require('../config/db'); // function that connects mongoose
const User = require('../models/User');

// Import the app+server AFTER loading env (index.js doesn't auto-start server due to require.main check)
const { app, server, io } = require('../index');

describe('Auth Tests', () => {
  // ensure DB connected and seed a known admin user
  beforeAll(async () => {
    // connect to test DB
    await connectDB();

    // create or update admin user (so tests are repeatable)
    const pw = await bcrypt.hash('password123', 10);
    await User.findOneAndUpdate(
      { email: 'admin@fit.com' },
      { name: 'Admin', email: 'admin@fit.com', passwordHash: pw, role: 'admin', totalPoints: 0 },
      { upsert: true, new: true }
    );
  });

  test('Login returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@fit.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('admin@fit.com');
  });

  afterAll(async () => {
  // Close mongoose connection if open
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      // Optional: drop test database for clean slate
      try { await mongoose.connection.dropDatabase(); } catch(e){ /* ignore */ }
      await mongoose.connection.close();
    }
  } catch (err) {
    // ignore
  }

  // Close socket.io if present
  if (io && typeof io.close === 'function') {
    try {
      await io.close();
    } catch (e) {
      // ignore
    }
  }

  // Close the http server only if it is actually listening
  if (server && typeof server.close === 'function') {
    try {
      // Node's server has .listening boolean
      if (server.listening) {
        await new Promise((resolve, reject) => {
          server.close(err => (err ? reject(err) : resolve()));
        });
      } else {
        // server not listening — nothing to close
      }
    } catch (e) {
      // ignore close errors
    }
  }
});
});