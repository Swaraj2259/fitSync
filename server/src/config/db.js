// // src/config/db.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGO_URI;
//     // modern mongoose no longer needs useNewUrlParser/useUnifiedTopology options
//     await mongoose.connect(uri);
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('MongoDB connection error', err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/fitsync';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
};

module.exports = connectDB;