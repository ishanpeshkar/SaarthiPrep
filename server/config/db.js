const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  // If already connected, return the existing connection
  if (mongoose.connection.readyState >= 1) {
    console.log('Using existing database connection');
    return;
  }

  // If there's no MONGO_URI, use a local MongoDB instance
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/saarthiprep';
  
  try {
    await mongoose.connect(mongoUri, {
      // Remove deprecated options
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    
    // If it's a connection error, suggest starting MongoDB
    if (err.name === 'MongoServerSelectionError') {
      console.error('\nCould not connect to MongoDB. Please make sure:');
      console.error('1. MongoDB is installed on your system');
      console.error('2. MongoDB service is running');
      console.error('3. The connection string is correct in your .env file\n');
      console.error('You can install MongoDB from: https://www.mongodb.com/try/download/community');
      console.error('Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register');
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;