import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`📦 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ─────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed.');
      process.exit(0);
    });
    // Force close after 10s if connections don't finish
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ─── Unhandled Errors ──────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message || err);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message || err);
  process.exit(1);
});

startServer();
