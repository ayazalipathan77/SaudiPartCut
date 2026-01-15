import { Router } from 'express';
import { authenticateUser } from '../../lib/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authenticateUser(email, password);

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const { verifyToken, getUserById } = await import('../../lib/auth');
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
