import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

const query = async (text, params) => {
  const res = await pool.query(text, params);
  return res;
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth utilities
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = payload;
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Optional auth - sets req.user if token is valid but doesn't require it
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
};

// ============== AUTH ROUTES ==============

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await query(
      'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const result = await query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1 AND is_active = true',
      [payload.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============== SHAPES ROUTES ==============

app.get('/api/shapes', optionalAuth, async (req, res) => {
  try {
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'manager');

    let queryText = `
      SELECT s.*, u.full_name as created_by_name,
             (SELECT COUNT(*) FROM shape_parameters WHERE shape_id = s.id) as parameter_count
      FROM shapes s
      LEFT JOIN users u ON s.created_by = u.id
    `;

    if (!isAdmin) {
      queryText += ' WHERE s.is_active = true';
    }

    queryText += ' ORDER BY s.display_order, s.created_at DESC';

    const result = await query(queryText);
    return res.json({ success: true, shapes: result.rows });
  } catch (error) {
    console.error('Get shapes error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/shapes/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'manager');

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

    // Get mappings
    const [materials, thickness, services, finishing] = await Promise.all([
      query(`SELECT sm.*, m.name, m.material_type, m.color_hex, m.roughness, m.metalness
             FROM shape_materials sm JOIN materials m ON sm.material_id = m.id
             WHERE sm.shape_id = $1 AND m.is_active = true ORDER BY sm.display_order`, [id]),
      query(`SELECT st.*, t.thickness_value, t.unit
             FROM shape_thickness st JOIN thickness_options t ON st.thickness_id = t.id
             WHERE st.shape_id = $1 AND t.is_active = true ORDER BY st.display_order`, [id]),
      query(`SELECT ss.*, s.service_name, s.description, s.base_cost
             FROM shape_services ss JOIN services s ON ss.service_id = s.id
             WHERE ss.shape_id = $1 AND s.is_active = true ORDER BY ss.display_order`, [id]),
      query(`SELECT sf.*, f.finish_name, f.description, f.cost_multiplier
             FROM shape_finishing sf JOIN finishing_options f ON sf.finishing_id = f.id
             WHERE sf.shape_id = $1 AND f.is_active = true ORDER BY sf.display_order`, [id]),
    ]);

    return res.json({
      success: true,
      shape: {
        ...shape,
        parameters: parametersResult.rows,
        materials: materials.rows,
        thickness_options: thickness.rows,
        services: services.rows,
        finishing_options: finishing.rows,
      },
    });
  } catch (error) {
    console.error('Get shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/shapes', authenticate, requireAdmin, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      name, slug, description, category,
      svg_path_generator, threejs_shape_generator, cost_formula,
      parameters, materials, thickness_options, services, finishing_options,
    } = req.body;

    const shapeResult = await client.query(
      `INSERT INTO shapes (name, slug, description, category, svg_path_generator, threejs_shape_generator, cost_formula, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, slug, description, category, svg_path_generator, threejs_shape_generator, cost_formula, req.user.userId]
    );

    const shapeId = shapeResult.rows[0].id;

    // Insert parameters
    if (parameters && parameters.length > 0) {
      for (const param of parameters) {
        await client.query(
          `INSERT INTO shape_parameters
           (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, options, help_text, placeholder, display_order, is_required, validation_formula, depends_on)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [shapeId, param.parameter_name, param.parameter_type, param.label, param.default_value,
           param.min_value, param.max_value, param.step_value || 1, param.unit,
           JSON.stringify(param.options || []), param.help_text, param.placeholder,
           param.display_order || 0, param.is_required !== false, param.validation_formula, param.depends_on]
        );
      }
    }

    // Insert mappings
    if (materials && materials.length > 0) {
      for (let i = 0; i < materials.length; i++) {
        await client.query(
          'INSERT INTO shape_materials (shape_id, material_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, materials[i], i === 0, i]
        );
      }
    }

    if (thickness_options && thickness_options.length > 0) {
      for (let i = 0; i < thickness_options.length; i++) {
        await client.query(
          'INSERT INTO shape_thickness (shape_id, thickness_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, thickness_options[i], i === 0, i]
        );
      }
    }

    if (services && services.length > 0) {
      for (let i = 0; i < services.length; i++) {
        await client.query(
          'INSERT INTO shape_services (shape_id, service_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, services[i], i === 0, i]
        );
      }
    }

    if (finishing_options && finishing_options.length > 0) {
      for (let i = 0; i < finishing_options.length; i++) {
        await client.query(
          'INSERT INTO shape_finishing (shape_id, finishing_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
          [shapeId, finishing_options[i], i === 0, i]
        );
      }
    }

    await client.query('COMMIT');

    return res.status(201).json({ success: true, shape: shapeResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.put('/api/shapes/:id', authenticate, requireAdmin, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      name, slug, description, category,
      svg_path_generator, threejs_shape_generator, cost_formula,
      is_active, display_order, parameters, materials, thickness_options, services, finishing_options,
    } = req.body;

    const updateResult = await client.query(
      `UPDATE shapes SET name = $1, slug = $2, description = $3, category = $4,
       svg_path_generator = $5, threejs_shape_generator = $6, cost_formula = $7,
       is_active = $8, display_order = $9 WHERE id = $10 RETURNING *`,
      [name, slug, description, category, svg_path_generator, threejs_shape_generator, cost_formula, is_active, display_order, id]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Shape not found' });
    }

    // Update parameters - delete existing and re-insert
    if (parameters !== undefined) {
      await client.query('DELETE FROM shape_parameters WHERE shape_id = $1', [id]);
      if (parameters && parameters.length > 0) {
        for (const param of parameters) {
          await client.query(
            `INSERT INTO shape_parameters
             (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, options, help_text, placeholder, display_order, is_required, validation_formula, depends_on)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [id, param.parameter_name, param.parameter_type, param.label, param.default_value,
             param.min_value, param.max_value, param.step_value || 1, param.unit,
             JSON.stringify(param.options || []), param.help_text, param.placeholder,
             param.display_order || 0, param.is_required !== false, param.validation_formula, param.depends_on]
          );
        }
      }
    }

    // Update mappings
    if (materials !== undefined) {
      await client.query('DELETE FROM shape_materials WHERE shape_id = $1', [id]);
      if (materials && materials.length > 0) {
        for (let i = 0; i < materials.length; i++) {
          await client.query(
            'INSERT INTO shape_materials (shape_id, material_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
            [id, materials[i], i === 0, i]
          );
        }
      }
    }

    if (thickness_options !== undefined) {
      await client.query('DELETE FROM shape_thickness WHERE shape_id = $1', [id]);
      if (thickness_options && thickness_options.length > 0) {
        for (let i = 0; i < thickness_options.length; i++) {
          await client.query(
            'INSERT INTO shape_thickness (shape_id, thickness_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
            [id, thickness_options[i], i === 0, i]
          );
        }
      }
    }

    if (services !== undefined) {
      await client.query('DELETE FROM shape_services WHERE shape_id = $1', [id]);
      if (services && services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          await client.query(
            'INSERT INTO shape_services (shape_id, service_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
            [id, services[i], i === 0, i]
          );
        }
      }
    }

    if (finishing_options !== undefined) {
      await client.query('DELETE FROM shape_finishing WHERE shape_id = $1', [id]);
      if (finishing_options && finishing_options.length > 0) {
        for (let i = 0; i < finishing_options.length; i++) {
          await client.query(
            'INSERT INTO shape_finishing (shape_id, finishing_id, is_default, display_order) VALUES ($1, $2, $3, $4)',
            [id, finishing_options[i], i === 0, i]
          );
        }
      }
    }

    await client.query('COMMIT');

    return res.json({ success: true, shape: updateResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.patch('/api/shapes/:id/activate', authenticate, requireAdmin, async (req, res) => {
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

    return res.json({ success: true, shape: result.rows[0] });
  } catch (error) {
    console.error('Activate shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/shapes/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM shapes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shape not found' });
    }

    return res.json({ success: true, message: 'Shape deleted' });
  } catch (error) {
    console.error('Delete shape error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============== OPTIONS ROUTES ==============

app.get('/api/materials', async (req, res) => {
  try {
    const result = await query('SELECT * FROM materials WHERE is_active = true ORDER BY display_order, name');
    return res.json({ success: true, materials: result.rows });
  } catch (error) {
    console.error('Get materials error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/options/all', async (req, res) => {
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
    console.error('Get options error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
