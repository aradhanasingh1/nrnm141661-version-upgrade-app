import path from 'path';
process.chdir(path.join(__dirname, '..'));

import express from 'express';
import next from 'next';
// import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connect } from './services/mongodb';

// Import routers directly
import authRouter from './routes/auth';
import apiRouter from './routes/api';

// dotenv.config();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  // Middleware
  server.use(express.json());
  server.use(cookieParser());

  // --- NEW: Global CORS + OPTIONS handling ---
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  server.get('/health', (req, res) => {
    res.json({ status: 'ok', env: process.env.NODE_ENV });
  });

  // Test DB connection
  try {
    const db = await connect();
    console.log('✅ MongoDB connected:', db.databaseName);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }

  // --- IMPORTANT: Mount your API routes BEFORE Next handler ---
  server.use('/auth', authRouter);
  server.use('/api', apiRouter);

  // Next.js page handling (catch‑all for everything else)
  server.get('*', (req, res) => {
    return handle(req, res);
  });
  server.post('*', (req, res) => {
    return handle(req, res);
  });
  server.put('*', (req, res) => {
    return handle(req, res);
  });
  server.delete('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});


