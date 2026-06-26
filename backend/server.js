import dotenv from 'dotenv';
dotenv.config();

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { validateEnv } from './config/env.js';
import { pool } from './config/db.js';

validateEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 5000;

/* =========================
   SECURITY + LOGGING
========================= */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/* =========================
   CORS
========================= */
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS rejected for origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   PASSPORT
========================= */
app.use(passport.initialize());

/* =========================
   STATIC UPLOADS
========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   ROUTES
========================= */
app.get('/', (_req, res) => {
  res.json({
    name: 'Veenbreeze Solutions API',
    status: 'ok',
    docs: '/api/health'
  });
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'degraded', database: 'disconnected', error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api', messageRoutes);
app.use('/api/admin', adminRoutes);

/* =========================
   ERROR HANDLERS
========================= */
app.use(notFoundHandler);
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Veenbreeze API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
