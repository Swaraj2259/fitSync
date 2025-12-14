require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Activity = require('../models/Activity');
const bcrypt = require('bcrypt');

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to DB...');
    
    await User.deleteMany();
    await Challenge.deleteMany();
    await Activity.deleteMany();
    console.log('Cleared old data...');

    const pw = await bcrypt.hash('password123', 10);
    
    // Create Users
    const admin = await User.create({ name: 'Admin', email: 'admin@fit.com', passwordHash: pw, role: 'admin', totalPoints: 1200 });
    const u1 = await User.create({ name: 'Aman', email: 'aman@fit.com', passwordHash: pw, role: 'user', totalPoints: 5000 });
    const u2 = await User.create({ name: 'Bala', email: 'bala@fit.com', passwordHash: pw, role: 'user', totalPoints: 7000 });
    const u3 = await User.create({ name: 'Chloe', email: 'chloe@fit.com', passwordHash: pw, role: 'user', totalPoints: 3200 });
    const u4 = await User.create({ name: 'David', email: 'david@fit.com', passwordHash: pw, role: 'user', totalPoints: 8900 });

    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    // --- ACTIVE CHALLENGES ---
    const activeChallenges = [
      {
        title: 'Morning Yoga Flow',
        description: 'Start your day with 30 minutes of yoga for better flexibility and mindfulness.',
        startDate: new Date(now.getTime() - 2 * day),
        endDate: new Date(now.getTime() + 5 * day),
        targetMetric: 'minutes',
        isActive: true
      },
      {
        title: 'Urban Cycling Race',
        description: 'Cycle 50km this week around the city.',
        startDate: new Date(now.getTime() - 1 * day),
        endDate: new Date(now.getTime() + 6 * day),
        targetMetric: 'km',
        isActive: true
      },
      {
        title: 'Daily Steps Master',
        description: 'Hit 10,000 steps every day to stay active.',
        startDate: new Date(now.getTime() - 3 * day),
        endDate: new Date(now.getTime() + 4 * day),
        targetMetric: 'steps',
        isActive: true
      },
      {
        title: 'Plank Power Challenge',
        description: 'Accumulate 5 minutes of plank hold every day.',
        startDate: new Date(now.getTime() - 1 * day),
        endDate: new Date(now.getTime() + 6 * day),
        targetMetric: 'minutes',
        isActive: true
      },
      {
        title: 'Hydration Hero',
        description: 'Track your water intake. Aim for 3 liters daily.',
        startDate: new Date(now.getTime() - 4 * day),
        endDate: new Date(now.getTime() + 3 * day),
        targetMetric: 'liters',
        isActive: true
      }
    ];

    // --- COMPLETED CHALLENGES ---
    const completedChallenges = [
      {
        title: 'November Marathon Prep',
        description: 'Run a total of 42km over the month.',
        startDate: new Date(now.getTime() - 30 * day),
        endDate: new Date(now.getTime() - 2 * day),
        targetMetric: 'km',
        isActive: false
      },
      {
        title: 'October Hiking Adventure',
        description: 'Hike a total of 20km on trails.',
        startDate: new Date(now.getTime() - 45 * day),
        endDate: new Date(now.getTime() - 15 * day),
        targetMetric: 'km',
        isActive: false
      },
      {
        title: 'Swim the Distance',
        description: 'Swim 20 laps in the pool.',
        startDate: new Date(now.getTime() - 15 * day),
        endDate: new Date(now.getTime() - 5 * day),
        targetMetric: 'laps',
        isActive: false
      },
      {
        title: 'Heavy Lifting Week',
        description: 'Log your gym sessions. Aim for 5 sessions.',
        startDate: new Date(now.getTime() - 10 * day),
        endDate: new Date(now.getTime() - 1 * day),
        targetMetric: 'sessions',
        isActive: false
      }
    ];

    // --- UPCOMING CHALLENGES ---
    const upcomingChallenges = [
      {
        title: 'New Year Resolution Run',
        description: 'Start the year with a 5k run.',
        startDate: new Date(now.getTime() + 5 * day),
        endDate: new Date(now.getTime() + 10 * day),
        targetMetric: 'km',
        isActive: true
      },
      {
        title: 'Meditation Mastery',
        description: '10 minutes of meditation daily for a week.',
        startDate: new Date(now.getTime() + 3 * day),
        endDate: new Date(now.getTime() + 10 * day),
        targetMetric: 'minutes',
        isActive: true
      },
      {
        title: 'Spring HIIT Blast',
        description: 'High intensity interval training to burn calories.',
        startDate: new Date(now.getTime() + 15 * day),
        endDate: new Date(now.getTime() + 22 * day),
        targetMetric: 'calories',
        isActive: true
      },
      {
        title: 'Summer Swim Series',
        description: 'Prepare for summer with a 1km swim challenge.',
        startDate: new Date(now.getTime() + 20 * day),
        endDate: new Date(now.getTime() + 30 * day),
        targetMetric: 'km',
        isActive: true
      }
    ];

    const allChallenges = [...activeChallenges, ...completedChallenges, ...upcomingChallenges];
    
    for (const c of allChallenges) {
      await Challenge.create(c);
    }

    console.log(`Created ${allChallenges.length} challenges.`);

    // --- SEED ACTIVITIES ---
    const dbChallenges = await Challenge.find();
    const dbUsers = await User.find();
    const adminUser = await User.findOne({ email: 'admin@fit.com' });
    const sampleActivities = [];

    // 1. Generate specific history for the Admin user (You)
    // Create 20 activities for Admin over the last 30 days
    if (adminUser) {
      for (let i = 0; i < 20; i++) {
        const randomChallenge = dbChallenges[Math.floor(Math.random() * dbChallenges.length)];
        const daysAgo = Math.floor(Math.random() * 30); // Random day in last month
        const date = new Date(now.getTime() - daysAgo * day);
        
        // Add some time variation
        date.setHours(Math.floor(Math.random() * 14) + 6); // Between 6 AM and 8 PM

        sampleActivities.push({
          user: adminUser._id,
          challenge: randomChallenge._id,
          metric: Math.floor(Math.random() * 500) + 100, // Good points
          createdAt: date,
          updatedAt: date
        });
      }
    }

    // 2. Generate random activities for other users (for Leaderboard population)
    for (let i = 0; i < 40; i++) {
      const otherUsers = dbUsers.filter(u => u.email !== 'admin@fit.com');
      if (otherUsers.length === 0) break;
      
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      const randomChallenge = dbChallenges[Math.floor(Math.random() * dbChallenges.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now.getTime() - daysAgo * day);

      sampleActivities.push({
        user: randomUser._id,
        challenge: randomChallenge._id,
        metric: Math.floor(Math.random() * 400) + 50,
        createdAt: date,
        updatedAt: date
      });
    }

    await Activity.insertMany(sampleActivities);
    console.log(`Created ${sampleActivities.length} historical activities (20 for Admin).`);

    console.log('Seeded data done. Admin login: admin@fit.com / password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();