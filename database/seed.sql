-- Seed Data for KSAPartCut Manufacturing Platform

-- Insert Default Admin User (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@ksapartcut.com', '$2b$10$drb6LaJi0pmslyYGY1uWzOz.GtY7Bqm5DB9WoWjYrmDNLsBkTCJky', 'Admin User', 'admin');

-- Insert Materials (matching current system + more)
INSERT INTO materials (name, material_type, density, color_hex, roughness, metalness, cost_per_kg, cost_per_sqm, is_active, display_order) VALUES
('Mild Steel', 'mild_steel', 7850.0, '#8b9196', 0.60, 0.30, 2.50, 15.00, true, 1),
('Stainless Steel 304', 'stainless_304', 8000.0, '#c0c5ca', 0.50, 0.25, 8.00, 48.00, true, 2),
('Stainless Steel 316', 'stainless_316', 8000.0, '#d0d5da', 0.50, 0.25, 12.00, 72.00, true, 3),
('Aluminum 5052', 'aluminum', 2680.0, '#b8bec3', 0.55, 0.28, 5.00, 20.00, true, 4),
('Brass C260', 'brass', 8530.0, '#c9a961', 0.50, 0.30, 15.00, 85.00, true, 5),
('Copper C110', 'copper', 8960.0, '#b87333', 0.45, 0.35, 18.00, 100.00, true, 6);

-- Insert Thickness Options
INSERT INTO thickness_options (thickness_value, unit, cost_multiplier, is_active, display_order) VALUES
(0.5, 'mm', 0.8, true, 1),
(1.0, 'mm', 0.9, true, 2),
(1.5, 'mm', 1.0, true, 3),
(2.0, 'mm', 1.1, true, 4),
(3.0, 'mm', 1.3, true, 5),
(4.0, 'mm', 1.5, true, 6),
(5.0, 'mm', 1.7, true, 7),
(6.0, 'mm', 2.0, true, 8),
(8.0, 'mm', 2.5, true, 9),
(10.0, 'mm', 3.0, true, 10);

-- Insert Services
INSERT INTO services (service_name, service_type, description, base_cost, cost_formula, is_active, display_order) VALUES
('Laser Cutting', 'cutting', 'Precision laser cutting for clean edges', 50.00, 'base_cost + (perimeter * 0.5)', true, 1),
('Waterjet Cutting', 'cutting', 'Waterjet cutting for thick materials', 75.00, 'base_cost + (perimeter * 0.7)', true, 2),
('CNC Bending', 'bending', 'Precision bending service', 100.00, 'base_cost + (bend_count * 25)', true, 3),
('Deburring', 'finishing', 'Remove sharp edges', 25.00, 'base_cost + (perimeter * 0.2)', true, 4),
('Threading', 'machining', 'Add threaded holes', 15.00, 'base_cost + (hole_count * 10)', true, 5);

-- Insert Finishing Options
INSERT INTO finishing_options (finish_name, finish_type, description, cost_multiplier, cost_per_sqm, is_active, display_order) VALUES
('Mill Finish', 'none', 'As-cut finish, no additional processing', 1.0, 0.00, true, 1),
('Brush Finish', 'polishing', 'Brushed surface finish', 1.2, 5.00, true, 2),
('Mirror Polish', 'polishing', 'High-gloss mirror finish', 1.5, 15.00, true, 3),
('Powder Coating', 'coating', 'Durable powder coating in various colors', 1.4, 20.00, true, 4),
('Anodizing (Aluminum)', 'coating', 'Anodized finish for aluminum parts', 1.3, 12.00, true, 5),
('Zinc Plating', 'coating', 'Corrosion-resistant zinc plating', 1.25, 8.00, true, 6);

-- Sample Shapes (Similar to SendCutSend templates)

-- Standard Mounting Plate (Original Default Template - Benchmark)
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Standard Mounting Plate', 'standard-mounting-plate', 'Rectangular plate with rounded corners and 4 mounting holes at each corner. The original benchmark template.', 'Rectangles', true,
'const w = params.width || 200;
const h = params.height || 150;
const r = Math.min(params.cornerRadius || 15, w/2, h/2);
if (r === 0) return `M 0,0 H ${w} V ${h} H 0 Z`;
return `M ${r},0 H ${w-r} A ${r},${r} 0 0 1 ${w},${r} V ${h-r} A ${r},${r} 0 0 1 ${w-r},${h} H ${r} A ${r},${r} 0 0 1 0,${h-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;',
'area * material_cost + perimeter * cut_cost',
0);

-- Rectangle with Corner Radius
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Rectangle', 'rectangle', 'Standard rectangle with optional corner radius and mounting holes', 'Rectangles', true,
'const w = params.width || 200;
const h = params.height || 150;
const r = Math.min(params.cornerRadius || 0, w/2, h/2);
if (r === 0) return `M 0,0 H ${w} V ${h} H 0 Z`;
return `M ${r},0 H ${w-r} A ${r},${r} 0 0 1 ${w},${r} V ${h-r} A ${r},${r} 0 0 1 ${w-r},${h} H ${r} A ${r},${r} 0 0 1 0,${h-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;',
'area * material_cost + perimeter * cut_cost',
1);

-- Circle
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Circle', 'circle', 'Simple circle with optional center hole', 'Circles', true,
'const r = (params.diameter || 100) / 2;
const cx = r; const cy = r;
return `M ${cx},${cy-r} A ${r},${r} 0 1 1 ${cx},${cy+r} A ${r},${r} 0 1 1 ${cx},${cy-r} Z`;',
'(Math.PI * (diameter/2)^2) * material_cost + (Math.PI * diameter) * cut_cost',
2);

-- Ring / Washer
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Ring', 'ring', 'Ring or washer shape with inner and outer diameter', 'Circles', true,
'const outer = (params.outerDiameter || 100) / 2;
const inner = (params.innerDiameter || 50) / 2;
const cx = outer; const cy = outer;
const outerPath = `M ${cx},${cy-outer} A ${outer},${outer} 0 1 1 ${cx},${cy+outer} A ${outer},${outer} 0 1 1 ${cx},${cy-outer}`;
const innerPath = `M ${cx},${cy-inner} A ${inner},${inner} 0 1 0 ${cx},${cy+inner} A ${inner},${inner} 0 1 0 ${cx},${cy-inner}`;
return outerPath + " " + innerPath;',
'(Math.PI * ((outerDiameter/2)^2 - (innerDiameter/2)^2)) * material_cost + (Math.PI * (outerDiameter + innerDiameter)) * cut_cost',
3);

-- L-Bracket
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('L-Bracket', 'l-bracket', 'L-shaped bracket with configurable arm lengths', 'Complex', true,
'const w = params.width || 150;
const h = params.height || 100;
const armW = params.armWidth || 30;
return `M 0,0 H ${w} V ${armW} H ${armW} V ${h} H 0 Z`;',
'area * material_cost + perimeter * cut_cost',
4);

-- U-Channel
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('U-Channel', 'u-channel', 'U-shaped channel or bracket', 'Complex', true,
'const w = params.width || 150;
const h = params.height || 100;
const flange = params.flangeWidth || 30;
const base = params.baseHeight || 25;
return `M 0,0 H ${flange} V ${h-base} H ${w-flange} V 0 H ${w} V ${h} H 0 Z`;',
'area * material_cost + perimeter * cut_cost',
5);

-- Triangle
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Triangle', 'triangle', 'Equilateral or custom triangle', 'Complex', true,
'const base = params.base || 150;
const h = params.height || 130;
return `M 0,${h} L ${base/2},0 L ${base},${h} Z`;',
'(base * height / 2) * material_cost + perimeter * cut_cost',
6);

-- Hexagon
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Hexagon', 'hexagon', 'Regular hexagon shape', 'Complex', true,
'const size = params.size || 100;
const r = size / 2;
const points = [];
for (let i = 0; i < 6; i++) {
  const angle = (Math.PI / 3) * i - Math.PI / 2;
  points.push(`${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`);
}
return `M ${points.join(" L ")} Z`;',
'(3 * Math.sqrt(3) / 2 * (size/2)^2) * material_cost + (6 * size) * cut_cost',
7);

-- Standard Mounting Plate Parameters (Benchmark template)
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 200, 50, 2000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'standard-mounting-plate';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 150, 50, 2000, 1, 'mm', true, 2 FROM shapes WHERE slug = 'standard-mounting-plate';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, help_text, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 15, 0, 100, 1, 'mm', false, 'Rounded corners reduce stress concentration', 3 FROM shapes WHERE slug = 'standard-mounting-plate';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, help_text, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 10, 0, 50, 0.5, 'mm', false, '4 mounting holes at each corner. Set to 0 for no holes.', 4 FROM shapes WHERE slug = 'standard-mounting-plate';

-- Rectangle Parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 200, 10, 2000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'rectangle';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 150, 10, 2000, 1, 'mm', true, 2 FROM shapes WHERE slug = 'rectangle';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 0, 0, 100, 1, 'mm', false, 3 FROM shapes WHERE slug = 'rectangle';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, help_text, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 0, 0, 50, 0.5, 'mm', false, 'Set to 0 for no holes', 4 FROM shapes WHERE slug = 'rectangle';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, help_text, display_order)
SELECT id, 'holeInset', 'number', 'Hole Inset', 20, 5, 200, 1, 'mm', false, 'Distance from edge to hole center', 5 FROM shapes WHERE slug = 'rectangle';

-- Circle Parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'diameter', 'number', 'Diameter', 100, 10, 1000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'circle';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, help_text, display_order)
SELECT id, 'centerHole', 'number', 'Center Hole', 0, 0, 500, 0.5, 'mm', false, 'Set to 0 for no center hole', 2 FROM shapes WHERE slug = 'circle';

-- Ring Parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'outerDiameter', 'number', 'Outer Diameter', 100, 20, 1000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'ring';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'innerDiameter', 'number', 'Inner Diameter', 50, 5, 900, 1, 'mm', true, 2 FROM shapes WHERE slug = 'ring';

-- L-Bracket Parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Total Width', 150, 20, 1000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'l-bracket';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Total Height', 100, 20, 1000, 1, 'mm', true, 2 FROM shapes WHERE slug = 'l-bracket';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'armWidth', 'number', 'Arm Width', 30, 10, 200, 1, 'mm', true, 3 FROM shapes WHERE slug = 'l-bracket';

-- U-Channel Parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Total Width', 150, 30, 1000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'u-channel';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Total Height', 100, 30, 1000, 1, 'mm', true, 2 FROM shapes WHERE slug = 'u-channel';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'flangeWidth', 'number', 'Flange Width', 30, 10, 200, 1, 'mm', true, 3 FROM shapes WHERE slug = 'u-channel';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'baseHeight', 'number', 'Base Height', 25, 10, 200, 1, 'mm', true, 4 FROM shapes WHERE slug = 'u-channel';

-- Triangle Parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'base', 'number', 'Base Width', 150, 10, 1000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'triangle';

INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 130, 10, 1000, 1, 'mm', true, 2 FROM shapes WHERE slug = 'triangle';

-- Hexagon Parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size (Width)', 100, 20, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'hexagon';

-- Map all shapes to all materials
INSERT INTO shape_materials (shape_id, material_id)
SELECT s.id, m.id FROM shapes s CROSS JOIN materials m;

-- Map all shapes to all thickness options
INSERT INTO shape_thickness (shape_id, thickness_id)
SELECT s.id, t.id FROM shapes s CROSS JOIN thickness_options t;

-- Map all shapes to cutting services
INSERT INTO shape_services (shape_id, service_id)
SELECT s.id, sv.id FROM shapes s CROSS JOIN services sv WHERE sv.service_type = 'cutting';

-- Map all shapes to all finishing options
INSERT INTO shape_finishing (shape_id, finishing_id)
SELECT s.id, f.id FROM shapes s CROSS JOIN finishing_options f;

