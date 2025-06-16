const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const setupWebSocket = require('./websocket');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
setupWebSocket(server);

// Connect to Database
connectDB();

// Get the default connection
const db = mongoose.connection;

// Init Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple route for testing
app.get('/api', (req, res) => {
  res.send('API is running');
});

// Define API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Use a different port if 5000 is in use
const PORT = process.env.PORT || 5001; // Changed default port to 5001

// Start the server
const runningServer = server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
runningServer.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server and exit process
  gracefulShutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server and exit process
  gracefulShutdown('uncaughtException');
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Graceful shutdown function
async function gracefulShutdown(reason) {
  console.log(`\nShutting down server (${reason})...`);
  
  try {
    // Close the server
    if (runningServer) {
      runningServer.close(() => {
        console.log('HTTP server closed');
      });
    }
    
    // Close database connection
    if (db) {
      await db.close();
      console.log('Database connection closed');
    }
    
    console.log('Shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
}