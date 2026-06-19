import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './config/env.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ─── Global Middleware ─────────────────────────────────────

// Security headers (CSP disabled — would block inline scripts/styles in the SPA;
// crossOriginEmbedderPolicy disabled — would block Cloudinary images)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Gzip compression — ~60-80% smaller JSON responses
app.use(compression());

// CORS — allow website + mobile app origins
// Derive both www and non-www variants of CLIENT_URL so visitors on either work
const clientVariants = (() => {
  if (!env.CLIENT_URL) return [];
  try {
    const u = new URL(env.CLIENT_URL);
    const host = u.host.replace(/^www\./, '');
    return [`${u.protocol}//${host}`, `${u.protocol}//www.${host}`];
  } catch {
    return [env.CLIENT_URL];
  }
})();

const allowedOrigins = [
  ...clientVariants,
  'http://localhost',       // Capacitor Android
  'https://localhost',      // Capacitor Android (https)
  'capacitor://localhost',  // Capacitor fallback
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

  // Static assets with long-term caching (Vite hashed filenames make this safe)
  app.use(express.static(clientDist, {
    maxAge: '1y',
    immutable: true,
  }));

  // All non-API routes → index.html (SPA routing)
  app.get(/(.*)/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'), {
      maxAge: 0, // Don't cache index.html itself
    });
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

// ─── Error Handler ─────────────────────────────────────────

app.use(errorHandler);

export default app;
