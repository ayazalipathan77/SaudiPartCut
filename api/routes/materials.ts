import { Router } from 'express';
import { query } from '../../lib/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/materials
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM materials WHERE is_active = true ORDER BY display_order, name'
    );
    return res.json({ success: true, materials: result.rows });
  } catch (error) {
    console.error('Get materials error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/materials/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM materials WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.json({ success: true, material: result.rows[0] });
  } catch (error) {
    console.error('Get material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/materials (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, material_type, density, color_hex, roughness, metalness, cost_per_kg, cost_per_sqm, description } = req.body;

    const result = await query(
      `INSERT INTO materials (name, material_type, density, color_hex, roughness, metalness, cost_per_kg, cost_per_sqm, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, material_type, density, color_hex, roughness, metalness, cost_per_kg, cost_per_sqm, description]
    );

    return res.status(201).json({ success: true, material: result.rows[0] });
  } catch (error) {
    console.error('Create material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/materials/:id (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, material_type, density, color_hex, roughness, metalness, cost_per_kg, cost_per_sqm, description, is_active } = req.body;

    const result = await query(
      `UPDATE materials 
       SET name = $1, material_type = $2, density = $3, color_hex = $4, roughness = $5, metalness = $6, cost_per_kg = $7, cost_per_sqm = $8, description = $9, is_active = $10
       WHERE id = $11 RETURNING *`,
      [name, material_type, density, color_hex, roughness, metalness, cost_per_kg, cost_per_sqm, description, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.json({ success: true, material: result.rows[0] });
  } catch (error) {
    console.error('Update material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
