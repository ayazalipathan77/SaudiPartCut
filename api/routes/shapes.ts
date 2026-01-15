import { Router } from 'express';
import { query, getClient } from '../../lib/db';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/shapes - Get all shapes (public - only active, admin - all)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'manager');
    
    let queryText = `
      SELECT s.*, 
             u.full_name as created_by_name,
             COUNT(sp.id) as parameter_count
      FROM shapes s
      LEFT JOIN users u ON s.created_by = u.id
      LEFT JOIN shape_parameters sp ON s.id = sp.shape_id
    `;

    if (!isAdmin) {
      queryText += ' WHERE s.is_active = true';
    }

    queryText += ' GROUP BY s.id, u.full_name ORDER BY s.display_order, s.created_at DESC';

    const result = await query(queryText);

    return res.json({ success: true, shapes: result.rows });
  } catch (error) {
    console.error('Get shapes error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/shapes/:id - Get single shape with parameters and mappings
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'manager');

    // Get shape
    let shapeQuery = 'SELECT * FROM shapes WHERE id = $1';
    if (!isAdmin) {
      shapeQuery += ' AND is_active = true';
    }

    const shapeResult = await query(shapeQuery, [id]);

    if (shapeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shape not found' });
    }

    const shape = shapeResult.rows[0];

    // Get parameters
    const parametersResult = await query(
      'SELECT * FROM shape_parameters WHERE shape_id = $1 ORDER BY display_order',
      [id]
    );

    // Get material mappings
    const materialsResult = await query(
      `SELECT sm.*, m.name, m.material_type, m.color_hex, m.roughness, m.metalness
       FROM shape_materials sm
       JOIN materials m ON sm.material_id = m.id
       WHERE sm.shape_id = $1 AND m.is_active = true
       ORDER BY sm.display_order`,
      [id]
    );

    // Get thickness mappings
    const thicknessResult = await query(
      `SELECT st.*, t.thickness_value, t.unit
       FROM shape_thickness st
       JOIN thickness_options t ON st.thickness_id = t.id
       WHERE st.shape_id = $1 AND t.is_active = true
       ORDER BY st.display_order`,
      [id]
    );

    // Get service mappings
    const servicesResult = await query(
      `SELECT ss.*, s.service_name, s.description, s.base_cost
       FROM shape_services ss
       JOIN services s ON ss.service_id = s.id
       WHERE ss.shape_id = $1 AND s.is_active = true
       ORDER BY ss.display_order`,
      [id]
    );

    // Get finishing mappings
    const finishingResult = await query(
      `SELECT sf.*, f.finish_name, f.description, f.cost_multiplier
       FROM shape_finishing sf
       JOIN finishing_options f ON sf.finishing_id = f.id
       WHERE sf.shape_id = $1 AND f.is_active = true
       ORDER BY sf.display_order`,
      [id]
    );

    return res.json({
      success: true,
      shape: {
        ...shape,
        parameters: parametersResult.rows,
        materials: materialsResult.rows,
        thickness_options: thicknessResult.rows,
        services: servicesResult.rows,
        finishing_options: finishingResult.rows,
      },
    });
  } catch (error) {
    console.error('Get shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/shapes - Create new shape (admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');

    const {
      name,
      slug,
      description,
      category,
      svg_path_generator,
      threejs_shape_generator,
      cost_formula,
      parameters,
      materials,
      thickness_options,
      services,
      finishing_options,
    } = req.body;

    // Create shape
    const shapeResult = await client.query(
      `INSERT INTO shapes (name, slug, description, category, svg_path_generator, threejs_shape_generator, cost_formula, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, slug, description, category, svg_path_generator, threejs_shape_generator, cost_formula, req.user!.userId]
    );

    const shapeId = shapeResult.rows[0].id;

    // Insert parameters
    if (parameters && parameters.length > 0) {
      for (const param of parameters) {
        await client.query(
          `INSERT INTO shape_parameters 
           (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, options, help_text, placeholder, display_order, is_required, validation_formula, depends_on)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            shapeId,
            param.parameter_name,
            param.parameter_type,
            param.label,
            param.default_value,
            param.min_value,
            param.max_value,
            param.step_value || 1,
            param.unit,
            JSON.stringify(param.options || []),
            param.help_text,
            param.placeholder,
            param.display_order || 0,
            param.is_required !== false,
            param.validation_formula,
            param.depends_on,
          ]
        );
      }
    }

    // Insert material mappings
    if (materials && materials.length > 0) {
      for (let i = 0; i < materials.length; i++) {
        await client.query(
          'INSERT INTO shape_materials (shape_id, material_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, materials[i], i === 0, i]
        );
      }
    }

    // Insert thickness mappings
    if (thickness_options && thickness_options.length > 0) {
      for (let i = 0; i < thickness_options.length; i++) {
        await client.query(
          'INSERT INTO shape_thickness (shape_id, thickness_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, thickness_options[i], i === 0, i]
        );
      }
    }

    // Insert service mappings
    if (services && services.length > 0) {
      for (let i = 0; i < services.length; i++) {
        await client.query(
          'INSERT INTO shape_services (shape_id, service_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, services[i], i === 0, i]
        );
      }
    }

    // Insert finishing mappings
    if (finishing_options && finishing_options.length > 0) {
      for (let i = 0; i < finishing_options.length; i++) {
        await client.query(
          'INSERT INTO shape_finishing (shape_id, finishing_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, finishing_options[i], i === 0, i]
        );
      }
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      shape: shapeResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// PUT /api/shapes/:id - Update shape (admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      name,
      slug,
      description,
      category,
      svg_path_generator,
      threejs_shape_generator,
      cost_formula,
      is_active,
      display_order,
    } = req.body;

    const updateResult = await client.query(
      `UPDATE shapes 
       SET name = $1, slug = $2, description = $3, category = $4, 
           svg_path_generator = $5, threejs_shape_generator = $6, cost_formula = $7,
           is_active = $8, display_order = $9
       WHERE id = $10
       RETURNING *`,
      [name, slug, description, category, svg_path_generator, threejs_shape_generator, cost_formula, is_active, display_order, id]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Shape not found' });
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      shape: updateResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// PATCH /api/shapes/:id/activate - Toggle shape active status (admin only)
router.patch('/:id/activate', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const result = await query(
      'UPDATE shapes SET is_active = $1 WHERE id = $2 RETURNING *',
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shape not found' });
    }

    return res.json({
      success: true,
      shape: result.rows[0],
    });
  } catch (error) {
    console.error('Activate shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/shapes/:id - Delete shape (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM shapes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shape not found' });
    }

    return res.json({
      success: true,
      message: 'Shape deleted successfully',
    });
  } catch (error) {
    console.error('Delete shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
