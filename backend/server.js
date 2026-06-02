import dotenv from 'dotenv';
dotenv.config(); // 🔥 MUST BE FIRST

import express from 'express';
import cors from 'cors';
import passport from './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { validateEnv } from './config/env.js';

validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json());

/* =========================
   PASSPORT INIT
========================= */
app.use(passport.initialize());

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* =========================
   ERROR HANDLERS
========================= */
app.use(notFoundHandler);
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Debugging: Log critical environment variables
console.log(
   "GOOGLE_CLIENT_ID:",
   process.env.GOOGLE_CLIENT_ID || "MISSING"
);
console.log(
   "GOOGLE_CLIENT_SECRET:",
   process.env.GOOGLE_CLIENT_SECRET || "MISSING"
);
console.log(
   "JWT_SECRET:",
   process.env.JWT_SECRET || "MISSING"
);