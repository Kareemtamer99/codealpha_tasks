const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { port } = require('./config/env');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Connect to Redis (non-blocking - app works without it)
  await connectRedis();

  // Start the server
  app.listen(port, () => {
    console.log(`\n🍽️  RMS API Server running on http://localhost:${port}`);
    console.log(`📋 Health check: http://localhost:${port}/api/health\n`);
  });
};

startServer();
