import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import shapesRoutes from './routes/shapes';
import materialsRoutes from './routes/materials';
import optionsRoutes from './routes/options';

// Import middleware
import { authenticate, AuthRequest } from './middleware/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Optional authentication for some routes
app.use('/api/shapes', (req: AuthRequest, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { verifyToken } = require('../lib/auth');
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shapes', shapesRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/options', optionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
