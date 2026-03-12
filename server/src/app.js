import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './config/env.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Global Middleware ─────────────────────────────────────

// CORS
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Rate limiting (general)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', generalLimiter);

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});
app.use('/api/auth', authLimiter);

// ─── Routes ────────────────────────────────────────────────

app.use('/api', routes);

// ─── Serve Frontend in Production ──────────────────────────

if (env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));

  // All non-API routes → index.html (SPA routing)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

// ─── Error Handler ─────────────────────────────────────────

app.use(errorHandler);

export default app;

