import { Router } from 'express';
import { query } from '../../lib/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/options/thickness
router.get('/thickness', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM thickness_options WHERE is_active = true ORDER BY display_order, thickness_value'
    );
    return res.json({ success: true, thickness_options: result.rows });
  } catch (error) {
    console.error('Get thickness error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/options/services
router.get('/services', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM services WHERE is_active = true ORDER BY display_order, service_name'
    );
    return res.json({ success: true, services: result.rows });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/options/finishing
router.get('/finishing', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM finishing_options WHERE is_active = true ORDER BY display_order, finish_name'
    );
    return res.json({ success: true, finishing_options: result.rows });
  } catch (error) {
    console.error('Get finishing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/options/all - Get all options at once
router.get('/all', async (req, res) => {
  try {
    const [materials, thickness, services, finishing] = await Promise.all([
      query('SELECT * FROM materials WHERE is_active = true ORDER BY display_order, name'),
      query('SELECT * FROM thickness_options WHERE is_active = true ORDER BY display_order, thickness_value'),
      query('SELECT * FROM services WHERE is_active = true ORDER BY display_order, service_name'),
      query('SELECT * FROM finishing_options WHERE is_active = true ORDER BY display_order, finish_name'),
    ]);

    return res.json({
      success: true,
      materials: materials.rows,
      thickness_options: thickness.rows,
      services: services.rows,
      finishing_options: finishing.rows,
    });
  } catch (error) {
    console.error('Get all options error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
