-- Additional Shapes based on SendCutSend-style templates
-- Run this after the initial seed.sql

-- 1. Rectangle with Center Hole (Mounting Plate with Center Cutout)
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Center Hole Plate', 'center-hole-plate', 'Rectangular plate with a large center hole and corner mounting holes', 'Rectangles', true,
'const w = params.width || 200;
const h = params.height || 150;
const r = Math.min(params.cornerRadius || 10, w/2, h/2);
const holeR = (params.centerHoleDiameter || 60) / 2;
const cx = w / 2;
const cy = h / 2;
let path = r === 0
  ? `M 0,0 H ${w} V ${h} H 0 Z`
  : `M ${r},0 H ${w-r} A ${r},${r} 0 0 1 ${w},${r} V ${h-r} A ${r},${r} 0 0 1 ${w-r},${h} H ${r} A ${r},${r} 0 0 1 0,${h-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
path += ` M ${cx},${cy-holeR} A ${holeR},${holeR} 0 1 0 ${cx},${cy+holeR} A ${holeR},${holeR} 0 1 0 ${cx},${cy-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
10);

-- 2. Perforated Panel (Grid of holes)
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Perforated Panel', 'perforated-panel', 'Rectangular panel with grid pattern of holes', 'Rectangles', true,
'const w = params.width || 250;
const h = params.height || 180;
const r = Math.min(params.cornerRadius || 8, w/2, h/2);
const holeR = (params.holeDiameter || 8) / 2;
const spacing = params.holeSpacing || 20;
const margin = params.edgeMargin || 15;
let path = r === 0
  ? `M 0,0 H ${w} V ${h} H 0 Z`
  : `M ${r},0 H ${w-r} A ${r},${r} 0 0 1 ${w},${r} V ${h-r} A ${r},${r} 0 0 1 ${w-r},${h} H ${r} A ${r},${r} 0 0 1 0,${h-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
for (let x = margin; x <= w - margin; x += spacing) {
  for (let y = margin; y <= h - margin; y += spacing) {
    path += ` M ${x},${y-holeR} A ${holeR},${holeR} 0 1 0 ${x},${y+holeR} A ${holeR},${holeR} 0 1 0 ${x},${y-holeR}`;
  }
}
return path;',
'area * material_cost + (perimeter + hole_count * Math.PI * hole_diameter) * cut_cost',
11);

-- 3. Circle Flange (Circle with bolt hole pattern)
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Circle Flange', 'circle-flange', 'Circular flange with center hole and bolt pattern', 'Circles', true,
'const od = params.outerDiameter || 120;
const id = params.innerDiameter || 40;
const boltCircle = params.boltCircleDiameter || 90;
const boltHoleD = params.boltHoleDiameter || 8;
const boltCount = params.boltHoleCount || 8;
const outerR = od / 2;
const innerR = id / 2;
const boltR = boltCircle / 2;
const holeR = boltHoleD / 2;
const cx = outerR;
const cy = outerR;
let path = `M ${cx},${cy-outerR} A ${outerR},${outerR} 0 1 1 ${cx},${cy+outerR} A ${outerR},${outerR} 0 1 1 ${cx},${cy-outerR}`;
path += ` M ${cx},${cy-innerR} A ${innerR},${innerR} 0 1 0 ${cx},${cy+innerR} A ${innerR},${innerR} 0 1 0 ${cx},${cy-innerR}`;
for (let i = 0; i < boltCount; i++) {
  const angle = (2 * Math.PI / boltCount) * i - Math.PI / 2;
  const hx = cx + boltR * Math.cos(angle);
  const hy = cy + boltR * Math.sin(angle);
  path += ` M ${hx},${hy-holeR} A ${holeR},${holeR} 0 1 0 ${hx},${hy+holeR} A ${holeR},${holeR} 0 1 0 ${hx},${hy-holeR}`;
}
return path;',
'area * material_cost + perimeter * cut_cost',
12);

-- 4. Oval Flange
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Oval Flange', 'oval-flange', 'Oval/stadium shaped flange with center cutout and bolt holes', 'Complex', true,
'const w = params.width || 180;
const h = params.height || 100;
const wallThickness = params.wallThickness || 20;
const boltHoleD = params.boltHoleDiameter || 8;
const outerR = h / 2;
const innerR = (h - wallThickness * 2) / 2;
const straightLen = w - h;
const holeR = boltHoleD / 2;
let path = `M ${outerR},0 H ${w-outerR} A ${outerR},${outerR} 0 0 1 ${w-outerR},${h} H ${outerR} A ${outerR},${outerR} 0 0 1 ${outerR},0 Z`;
const innerY = wallThickness;
path += ` M ${outerR},${innerY} H ${w-outerR} A ${innerR},${innerR} 0 0 1 ${w-outerR},${h-innerY} H ${outerR} A ${innerR},${innerR} 0 0 1 ${outerR},${innerY}`;
const holePositions = [[outerR, h/2], [w-outerR, h/2], [w/2, wallThickness/2], [w/2, h-wallThickness/2]];
holePositions.forEach(([hx, hy]) => {
  path += ` M ${hx},${hy-holeR} A ${holeR},${holeR} 0 1 0 ${hx},${hy+holeR} A ${holeR},${holeR} 0 1 0 ${hx},${hy-holeR}`;
});
return path;',
'area * material_cost + perimeter * cut_cost',
13);

-- 5. Link Bar (Connecting rod with holes at ends)
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Link Bar', 'link-bar', 'Connecting link bar with rounded ends and mounting holes', 'Complex', true,
'const length = params.length || 200;
const barWidth = params.barWidth || 40;
const holeDiameter = params.holeDiameter || 20;
const r = barWidth / 2;
const holeR = holeDiameter / 2;
let path = `M ${r},0 H ${length-r} A ${r},${r} 0 0 1 ${length-r},${barWidth} H ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
path += ` M ${r},${r-holeR} A ${holeR},${holeR} 0 1 0 ${r},${r+holeR} A ${holeR},${holeR} 0 1 0 ${r},${r-holeR}`;
path += ` M ${length-r},${r-holeR} A ${holeR},${holeR} 0 1 0 ${length-r},${r+holeR} A ${holeR},${holeR} 0 1 0 ${length-r},${r-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
14);

-- 6. Square Flange
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Square Flange', 'square-flange', 'Square plate with center hole and corner bolt holes', 'Rectangles', true,
'const size = params.size || 150;
const r = Math.min(params.cornerRadius || 15, size/2);
const centerHoleD = params.centerHoleDiameter || 50;
const boltHoleD = params.boltHoleDiameter || 8;
const boltInset = params.boltInset || 25;
const centerR = centerHoleD / 2;
const boltR = boltHoleD / 2;
const cx = size / 2;
let path = r === 0
  ? `M 0,0 H ${size} V ${size} H 0 Z`
  : `M ${r},0 H ${size-r} A ${r},${r} 0 0 1 ${size},${r} V ${size-r} A ${r},${r} 0 0 1 ${size-r},${size} H ${r} A ${r},${r} 0 0 1 0,${size-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
path += ` M ${cx},${cx-centerR} A ${centerR},${centerR} 0 1 0 ${cx},${cx+centerR} A ${centerR},${centerR} 0 1 0 ${cx},${cx-centerR}`;
const boltPositions = [[boltInset, boltInset], [size-boltInset, boltInset], [size-boltInset, size-boltInset], [boltInset, size-boltInset]];
boltPositions.forEach(([bx, by]) => {
  path += ` M ${bx},${by-boltR} A ${boltR},${boltR} 0 1 0 ${bx},${by+boltR} A ${boltR},${boltR} 0 1 0 ${bx},${by-boltR}`;
});
return path;',
'area * material_cost + perimeter * cut_cost',
15);

-- 7. Square with Cutout
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Square with Cutout', 'square-cutout', 'Square plate with rectangular center cutout', 'Rectangles', true,
'const size = params.size || 150;
const r = Math.min(params.cornerRadius || 10, size/2);
const cutoutW = params.cutoutWidth || 80;
const cutoutH = params.cutoutHeight || 80;
const cutoutR = Math.min(params.cutoutRadius || 5, cutoutW/2, cutoutH/2);
const cx = (size - cutoutW) / 2;
const cy = (size - cutoutH) / 2;
let path = r === 0
  ? `M 0,0 H ${size} V ${size} H 0 Z`
  : `M ${r},0 H ${size-r} A ${r},${r} 0 0 1 ${size},${r} V ${size-r} A ${r},${r} 0 0 1 ${size-r},${size} H ${r} A ${r},${r} 0 0 1 0,${size-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
path += cutoutR === 0
  ? ` M ${cx},${cy} H ${cx+cutoutW} V ${cy+cutoutH} H ${cx} Z`
  : ` M ${cx+cutoutR},${cy} H ${cx+cutoutW-cutoutR} A ${cutoutR},${cutoutR} 0 0 1 ${cx+cutoutW},${cy+cutoutR} V ${cy+cutoutH-cutoutR} A ${cutoutR},${cutoutR} 0 0 1 ${cx+cutoutW-cutoutR},${cy+cutoutH} H ${cx+cutoutR} A ${cutoutR},${cutoutR} 0 0 1 ${cx},${cy+cutoutH-cutoutR} V ${cy+cutoutR} A ${cutoutR},${cutoutR} 0 0 1 ${cx+cutoutR},${cy} Z`;
return path;',
'area * material_cost + perimeter * cut_cost',
16);

-- 8. Hanging Tab
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Hanging Tab', 'hanging-tab', 'Rounded tab with hanging hole', 'Complex', true,
'const w = params.width || 60;
const h = params.height || 100;
const holeD = params.holeDiameter || 20;
const r = w / 2;
const holeR = holeD / 2;
const holeY = r + 10;
let path = `M 0,${r} V ${h} H ${w} V ${r} A ${r},${r} 0 0 0 0,${r} Z`;
path += ` M ${r},${holeY-holeR} A ${holeR},${holeR} 0 1 0 ${r},${holeY+holeR} A ${holeR},${holeR} 0 1 0 ${r},${holeY-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
17);

-- 9. Corner Bracket (Right angle bracket)
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Corner Bracket', 'corner-bracket', 'Right angle corner bracket with mounting hole', 'Complex', true,
'const legA = params.legA || 100;
const legB = params.legB || 80;
const thickness = params.legThickness || 25;
const holeD = params.holeDiameter || 10;
const holeR = holeD / 2;
const holeInset = thickness / 2;
let path = `M 0,0 H ${legA} V ${thickness} H ${thickness} V ${legB} H 0 Z`;
path += ` M ${holeInset},${holeInset-holeR} A ${holeR},${holeR} 0 1 0 ${holeInset},${holeInset+holeR} A ${holeR},${holeR} 0 1 0 ${holeInset},${holeInset-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
18);

-- 10. Diamond Plate
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Diamond Plate', 'diamond-plate', 'Diamond/rhombus shaped mounting plate with corner holes', 'Complex', true,
'const size = params.size || 120;
const holeD = params.holeDiameter || 10;
const holeR = holeD / 2;
const cx = size / 2;
const cy = size / 2;
let path = `M ${cx},0 L ${size},${cy} L ${cx},${size} L 0,${cy} Z`;
const holeInset = size * 0.25;
const holePositions = [[cx, holeInset], [size-holeInset, cy], [cx, size-holeInset], [holeInset, cy]];
holePositions.forEach(([hx, hy]) => {
  path += ` M ${hx},${hy-holeR} A ${holeR},${holeR} 0 1 0 ${hx},${hy+holeR} A ${holeR},${holeR} 0 1 0 ${hx},${hy-holeR}`;
});
return path;',
'area * material_cost + perimeter * cut_cost',
19);

-- 11. Star Shape
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Star', 'star', 'Multi-pointed star shape', 'Complex', true,
'const size = params.size || 150;
const points = params.points || 8;
const innerRatio = params.innerRatio || 0.4;
const outerR = size / 2;
const innerR = outerR * innerRatio;
const cx = outerR;
const cy = outerR;
const pathPoints = [];
for (let i = 0; i < points * 2; i++) {
  const angle = (Math.PI / points) * i - Math.PI / 2;
  const r = i % 2 === 0 ? outerR : innerR;
  pathPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
}
return `M ${pathPoints.join(" L ")} Z`;',
'area * material_cost + perimeter * cut_cost',
20);

-- 12. Octagon
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Octagon', 'octagon', 'Regular octagon shape', 'Complex', true,
'const size = params.size || 120;
const r = size / 2;
const cx = r;
const cy = r;
const points = [];
for (let i = 0; i < 8; i++) {
  const angle = (Math.PI / 4) * i - Math.PI / 8;
  points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
}
return `M ${points.join(" L ")} Z`;',
'area * material_cost + perimeter * cut_cost',
21);

-- 13. Hexagon with Center Hole
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Hex Nut', 'hex-nut', 'Hexagon shape with center hole (nut-like)', 'Complex', true,
'const size = params.size || 100;
const holeD = params.holeDiameter || 40;
const r = size / 2;
const holeR = holeD / 2;
const cx = r;
const cy = r;
const points = [];
for (let i = 0; i < 6; i++) {
  const angle = (Math.PI / 3) * i - Math.PI / 2;
  points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
}
let path = `M ${points.join(" L ")} Z`;
path += ` M ${cx},${cy-holeR} A ${holeR},${holeR} 0 1 0 ${cx},${cy+holeR} A ${holeR},${holeR} 0 1 0 ${cx},${cy-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
22);

-- 14. Arch Shape
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Arch', 'arch', 'Arch or dome shaped plate', 'Complex', true,
'const w = params.width || 100;
const h = params.height || 150;
const r = w / 2;
return `M 0,${h} V ${r} A ${r},${r} 0 0 1 ${w},${r} V ${h} Z`;',
'area * material_cost + perimeter * cut_cost',
23);

-- 15. Pill/Capsule Shape
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Pill', 'pill', 'Pill or capsule shaped plate', 'Complex', true,
'const w = params.width || 200;
const h = params.height || 80;
const r = h / 2;
return `M ${r},0 H ${w-r} A ${r},${r} 0 0 1 ${w-r},${h} H ${r} A ${r},${r} 0 0 1 ${r},0 Z`;',
'area * material_cost + perimeter * cut_cost',
24);

-- 16. Ellipse
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Ellipse', 'ellipse', 'Elliptical/oval shaped plate', 'Circles', true,
'const w = params.width || 200;
const h = params.height || 120;
const rx = w / 2;
const ry = h / 2;
return `M ${rx},0 A ${rx},${ry} 0 1 1 ${rx},${h} A ${rx},${ry} 0 1 1 ${rx},0 Z`;',
'area * material_cost + perimeter * cut_cost',
25);

-- 17. Trapezoid
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Trapezoid', 'trapezoid', 'Trapezoid shaped plate', 'Complex', true,
'const topW = params.topWidth || 120;
const bottomW = params.bottomWidth || 180;
const h = params.height || 100;
const offset = (bottomW - topW) / 2;
return `M ${offset},0 H ${offset + topW} L ${bottomW},${h} H 0 Z`;',
'area * material_cost + perimeter * cut_cost',
26);

-- 18. Hourglass/Bowtie
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Hourglass', 'hourglass', 'Hourglass or bowtie shaped plate', 'Complex', true,
'const w = params.width || 180;
const h = params.height || 80;
const neckW = params.neckWidth || 30;
const neckOffset = (h - neckW) / 2;
return `M 0,0 Q ${w/2},${neckOffset} ${w},0 V ${h} Q ${w/2},${h-neckOffset} 0,${h} Z`;',
'area * material_cost + perimeter * cut_cost',
27);

-- 19. Curved Tab
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Curved Tab', 'curved-tab', 'Curved mounting tab', 'Complex', true,
'const w = params.width || 60;
const h = params.height || 100;
const r = w / 2;
return `M 0,${h} V ${r} A ${r},${r} 0 0 1 ${w},${r} V ${h} Q ${w/2},${h-20} 0,${h} Z`;',
'area * material_cost + perimeter * cut_cost',
28);

-- 20. Spoked Wheel
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Spoked Wheel', 'spoked-wheel', 'Circular wheel with spokes', 'Circles', true,
'const od = params.outerDiameter || 150;
const id = params.innerDiameter || 40;
const spokeCount = params.spokeCount || 5;
const spokeWidth = params.spokeWidth || 15;
const outerR = od / 2;
const innerR = id / 2;
const cx = outerR;
const cy = outerR;
let path = `M ${cx},${cy-outerR} A ${outerR},${outerR} 0 1 1 ${cx},${cy+outerR} A ${outerR},${outerR} 0 1 1 ${cx},${cy-outerR}`;
path += ` M ${cx},${cy-innerR} A ${innerR},${innerR} 0 1 0 ${cx},${cy+innerR} A ${innerR},${innerR} 0 1 0 ${cx},${cy-innerR}`;
const midR = (outerR + innerR) / 2;
const cutoutR = (outerR - innerR) / 2 - spokeWidth / 2;
for (let i = 0; i < spokeCount; i++) {
  const angle = (2 * Math.PI / spokeCount) * i + Math.PI / spokeCount;
  const cutX = cx + midR * Math.cos(angle);
  const cutY = cy + midR * Math.sin(angle);
  path += ` M ${cutX},${cutY-cutoutR} A ${cutoutR},${cutoutR} 0 1 0 ${cutX},${cutY+cutoutR} A ${cutoutR},${cutoutR} 0 1 0 ${cutX},${cutY-cutoutR}`;
}
return path;',
'area * material_cost + perimeter * cut_cost',
29);

-- 21. Gear/Sprocket
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Gear', 'gear', 'Gear or sprocket with teeth', 'Complex', true,
'const od = params.outerDiameter || 150;
const teethCount = params.teethCount || 20;
const toothDepth = params.toothDepth || 10;
const centerHoleD = params.centerHoleDiameter || 20;
const outerR = od / 2;
const innerR = outerR - toothDepth;
const holeR = centerHoleD / 2;
const cx = outerR;
const cy = outerR;
const pathPoints = [];
for (let i = 0; i < teethCount; i++) {
  const angle1 = (2 * Math.PI / teethCount) * i;
  const angle2 = angle1 + (Math.PI / teethCount) * 0.3;
  const angle3 = angle1 + (Math.PI / teethCount) * 0.7;
  const angle4 = angle1 + (Math.PI / teethCount);
  pathPoints.push(`${cx + innerR * Math.cos(angle1)},${cy + innerR * Math.sin(angle1)}`);
  pathPoints.push(`${cx + outerR * Math.cos(angle2)},${cy + outerR * Math.sin(angle2)}`);
  pathPoints.push(`${cx + outerR * Math.cos(angle3)},${cy + outerR * Math.sin(angle3)}`);
  pathPoints.push(`${cx + innerR * Math.cos(angle4)},${cy + innerR * Math.sin(angle4)}`);
}
let path = `M ${pathPoints.join(" L ")} Z`;
path += ` M ${cx},${cy-holeR} A ${holeR},${holeR} 0 1 0 ${cx},${cy+holeR} A ${holeR},${holeR} 0 1 0 ${cx},${cy-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
30);

-- 22. Radial Mounting Plate
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Radial Mounting Plate', 'radial-mounting-plate', 'Square plate with radial bolt pattern and center hole', 'Rectangles', true,
'const size = params.size || 150;
const r = Math.min(params.cornerRadius || 20, size/2);
const centerHoleD = params.centerHoleDiameter || 40;
const boltCircleD = params.boltCircleDiameter || 100;
const boltHoleD = params.boltHoleDiameter || 8;
const boltCount = params.boltHoleCount || 8;
const centerR = centerHoleD / 2;
const boltCircleR = boltCircleD / 2;
const boltR = boltHoleD / 2;
const cx = size / 2;
let path = r === 0
  ? `M 0,0 H ${size} V ${size} H 0 Z`
  : `M ${r},0 H ${size-r} A ${r},${r} 0 0 1 ${size},${r} V ${size-r} A ${r},${r} 0 0 1 ${size-r},${size} H ${r} A ${r},${r} 0 0 1 0,${size-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
path += ` M ${cx},${cx-centerR} A ${centerR},${centerR} 0 1 0 ${cx},${cx+centerR} A ${centerR},${centerR} 0 1 0 ${cx},${cx-centerR}`;
for (let i = 0; i < boltCount; i++) {
  const angle = (2 * Math.PI / boltCount) * i - Math.PI / 2;
  const bx = cx + boltCircleR * Math.cos(angle);
  const by = cx + boltCircleR * Math.sin(angle);
  path += ` M ${bx},${by-boltR} A ${boltR},${boltR} 0 1 0 ${bx},${by+boltR} A ${boltR},${boltR} 0 1 0 ${bx},${by-boltR}`;
}
return path;',
'area * material_cost + perimeter * cut_cost',
31);

-- 23. Connecting Bar (Two holes)
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Connecting Bar', 'connecting-bar', 'Rectangular bar with two mounting holes', 'Rectangles', true,
'const w = params.width || 180;
const h = params.height || 50;
const r = Math.min(params.cornerRadius || 10, h/2);
const holeD = params.holeDiameter || 20;
const holeR = holeD / 2;
const holeInset = h / 2 + 10;
let path = r === 0
  ? `M 0,0 H ${w} V ${h} H 0 Z`
  : `M ${r},0 H ${w-r} A ${r},${r} 0 0 1 ${w},${r} V ${h-r} A ${r},${r} 0 0 1 ${w-r},${h} H ${r} A ${r},${r} 0 0 1 0,${h-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
path += ` M ${holeInset},${h/2-holeR} A ${holeR},${holeR} 0 1 0 ${holeInset},${h/2+holeR} A ${holeR},${holeR} 0 1 0 ${holeInset},${h/2-holeR}`;
path += ` M ${w-holeInset},${h/2-holeR} A ${holeR},${holeR} 0 1 0 ${w-holeInset},${h/2+holeR} A ${holeR},${holeR} 0 1 0 ${w-holeInset},${h/2-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
32);

-- 24. Curved Mounting Tab
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Curved Mounting Tab', 'curved-mounting-tab', 'Tab with curved top and mounting hole', 'Complex', true,
'const w = params.width || 80;
const h = params.height || 120;
const holeD = params.holeDiameter || 25;
const curveHeight = params.curveHeight || 30;
const holeR = holeD / 2;
const holeY = curveHeight + 25;
let path = `M 0,${h} V ${curveHeight} Q ${w/2},0 ${w},${curveHeight} V ${h} Z`;
path += ` M ${w/2},${holeY-holeR} A ${holeR},${holeR} 0 1 0 ${w/2},${holeY+holeR} A ${holeR},${holeR} 0 1 0 ${w/2},${holeY-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
33);

-- 25. Rectangular Tab
INSERT INTO shapes (name, slug, description, category, is_active, svg_path_generator, cost_formula, display_order) VALUES
('Rectangular Tab', 'rectangular-tab', 'Simple rectangular tab with mounting hole', 'Rectangles', true,
'const w = params.width || 60;
const h = params.height || 100;
const r = Math.min(params.cornerRadius || 5, w/2, h/2);
const holeD = params.holeDiameter || 20;
const holeR = holeD / 2;
const holeY = 30;
let path = r === 0
  ? `M 0,0 H ${w} V ${h} H 0 Z`
  : `M ${r},0 H ${w-r} A ${r},${r} 0 0 1 ${w},${r} V ${h-r} A ${r},${r} 0 0 1 ${w-r},${h} H ${r} A ${r},${r} 0 0 1 0,${h-r} V ${r} A ${r},${r} 0 0 1 ${r},0 Z`;
path += ` M ${w/2},${holeY-holeR} A ${holeR},${holeR} 0 1 0 ${w/2},${holeY+holeR} A ${holeR},${holeR} 0 1 0 ${w/2},${holeY-holeR}`;
return path;',
'area * material_cost + perimeter * cut_cost',
34);

-- Add parameters for new shapes

-- Center Hole Plate parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 200, 50, 1000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'center-hole-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 150, 50, 1000, 1, 'mm', true, 2 FROM shapes WHERE slug = 'center-hole-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 10, 0, 50, 1, 'mm', false, 3 FROM shapes WHERE slug = 'center-hole-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'centerHoleDiameter', 'number', 'Center Hole Diameter', 60, 10, 200, 1, 'mm', true, 4 FROM shapes WHERE slug = 'center-hole-plate';

-- Perforated Panel parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 250, 50, 1000, 1, 'mm', true, 1 FROM shapes WHERE slug = 'perforated-panel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 180, 50, 1000, 1, 'mm', true, 2 FROM shapes WHERE slug = 'perforated-panel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 8, 0, 30, 1, 'mm', false, 3 FROM shapes WHERE slug = 'perforated-panel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 8, 2, 20, 0.5, 'mm', true, 4 FROM shapes WHERE slug = 'perforated-panel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeSpacing', 'number', 'Hole Spacing', 20, 10, 50, 1, 'mm', true, 5 FROM shapes WHERE slug = 'perforated-panel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'edgeMargin', 'number', 'Edge Margin', 15, 5, 50, 1, 'mm', true, 6 FROM shapes WHERE slug = 'perforated-panel';

-- Circle Flange parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'outerDiameter', 'number', 'Outer Diameter', 120, 40, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'circle-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'innerDiameter', 'number', 'Inner Diameter', 40, 10, 200, 1, 'mm', true, 2 FROM shapes WHERE slug = 'circle-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltCircleDiameter', 'number', 'Bolt Circle Diameter', 90, 30, 400, 1, 'mm', true, 3 FROM shapes WHERE slug = 'circle-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltHoleDiameter', 'number', 'Bolt Hole Diameter', 8, 3, 20, 0.5, 'mm', true, 4 FROM shapes WHERE slug = 'circle-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltHoleCount', 'number', 'Bolt Hole Count', 8, 3, 16, 1, '', true, 5 FROM shapes WHERE slug = 'circle-flange';

-- Oval Flange parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 180, 60, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'oval-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 100, 40, 300, 1, 'mm', true, 2 FROM shapes WHERE slug = 'oval-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'wallThickness', 'number', 'Wall Thickness', 20, 10, 50, 1, 'mm', true, 3 FROM shapes WHERE slug = 'oval-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltHoleDiameter', 'number', 'Bolt Hole Diameter', 8, 3, 15, 0.5, 'mm', true, 4 FROM shapes WHERE slug = 'oval-flange';

-- Link Bar parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'length', 'number', 'Length', 200, 60, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'link-bar';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'barWidth', 'number', 'Bar Width', 40, 20, 100, 1, 'mm', true, 2 FROM shapes WHERE slug = 'link-bar';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 20, 5, 50, 1, 'mm', true, 3 FROM shapes WHERE slug = 'link-bar';

-- Square Flange parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size', 150, 50, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'square-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 15, 0, 50, 1, 'mm', false, 2 FROM shapes WHERE slug = 'square-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'centerHoleDiameter', 'number', 'Center Hole Diameter', 50, 10, 150, 1, 'mm', true, 3 FROM shapes WHERE slug = 'square-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltHoleDiameter', 'number', 'Bolt Hole Diameter', 8, 3, 20, 0.5, 'mm', true, 4 FROM shapes WHERE slug = 'square-flange';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltInset', 'number', 'Bolt Inset', 25, 10, 100, 1, 'mm', true, 5 FROM shapes WHERE slug = 'square-flange';

-- Square with Cutout parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size', 150, 50, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'square-cutout';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 10, 0, 50, 1, 'mm', false, 2 FROM shapes WHERE slug = 'square-cutout';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cutoutWidth', 'number', 'Cutout Width', 80, 20, 200, 1, 'mm', true, 3 FROM shapes WHERE slug = 'square-cutout';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cutoutHeight', 'number', 'Cutout Height', 80, 20, 200, 1, 'mm', true, 4 FROM shapes WHERE slug = 'square-cutout';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cutoutRadius', 'range', 'Cutout Radius', 5, 0, 30, 1, 'mm', false, 5 FROM shapes WHERE slug = 'square-cutout';

-- Hanging Tab parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 60, 30, 150, 1, 'mm', true, 1 FROM shapes WHERE slug = 'hanging-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 100, 50, 200, 1, 'mm', true, 2 FROM shapes WHERE slug = 'hanging-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 20, 5, 50, 1, 'mm', true, 3 FROM shapes WHERE slug = 'hanging-tab';

-- Corner Bracket parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'legA', 'number', 'Leg A Length', 100, 30, 300, 1, 'mm', true, 1 FROM shapes WHERE slug = 'corner-bracket';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'legB', 'number', 'Leg B Length', 80, 30, 300, 1, 'mm', true, 2 FROM shapes WHERE slug = 'corner-bracket';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'legThickness', 'number', 'Leg Thickness', 25, 10, 80, 1, 'mm', true, 3 FROM shapes WHERE slug = 'corner-bracket';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 10, 3, 25, 0.5, 'mm', false, 4 FROM shapes WHERE slug = 'corner-bracket';

-- Diamond Plate parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size', 120, 50, 300, 1, 'mm', true, 1 FROM shapes WHERE slug = 'diamond-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 10, 3, 25, 0.5, 'mm', false, 2 FROM shapes WHERE slug = 'diamond-plate';

-- Star parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size', 150, 50, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'star';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'points', 'number', 'Number of Points', 8, 4, 12, 1, '', true, 2 FROM shapes WHERE slug = 'star';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'innerRatio', 'range', 'Inner Ratio', 0.4, 0.2, 0.6, 0.05, '', false, 3 FROM shapes WHERE slug = 'star';

-- Octagon parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size', 120, 40, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'octagon';

-- Hex Nut parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size', 100, 30, 300, 1, 'mm', true, 1 FROM shapes WHERE slug = 'hex-nut';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 40, 10, 150, 1, 'mm', true, 2 FROM shapes WHERE slug = 'hex-nut';

-- Arch parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 100, 30, 300, 1, 'mm', true, 1 FROM shapes WHERE slug = 'arch';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 150, 50, 400, 1, 'mm', true, 2 FROM shapes WHERE slug = 'arch';

-- Pill parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 200, 50, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'pill';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 80, 30, 200, 1, 'mm', true, 2 FROM shapes WHERE slug = 'pill';

-- Ellipse parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 200, 50, 500, 1, 'mm', true, 1 FROM shapes WHERE slug = 'ellipse';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 120, 30, 300, 1, 'mm', true, 2 FROM shapes WHERE slug = 'ellipse';

-- Trapezoid parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'topWidth', 'number', 'Top Width', 120, 30, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'trapezoid';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'bottomWidth', 'number', 'Bottom Width', 180, 50, 500, 1, 'mm', true, 2 FROM shapes WHERE slug = 'trapezoid';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 100, 30, 300, 1, 'mm', true, 3 FROM shapes WHERE slug = 'trapezoid';

-- Hourglass parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 180, 50, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'hourglass';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 80, 30, 200, 1, 'mm', true, 2 FROM shapes WHERE slug = 'hourglass';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'neckWidth', 'number', 'Neck Width', 30, 10, 80, 1, 'mm', true, 3 FROM shapes WHERE slug = 'hourglass';

-- Curved Tab parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 60, 30, 150, 1, 'mm', true, 1 FROM shapes WHERE slug = 'curved-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 100, 50, 200, 1, 'mm', true, 2 FROM shapes WHERE slug = 'curved-tab';

-- Spoked Wheel parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'outerDiameter', 'number', 'Outer Diameter', 150, 60, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'spoked-wheel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'innerDiameter', 'number', 'Hub Diameter', 40, 10, 100, 1, 'mm', true, 2 FROM shapes WHERE slug = 'spoked-wheel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'spokeCount', 'number', 'Spoke Count', 5, 3, 8, 1, '', true, 3 FROM shapes WHERE slug = 'spoked-wheel';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'spokeWidth', 'number', 'Spoke Width', 15, 5, 40, 1, 'mm', true, 4 FROM shapes WHERE slug = 'spoked-wheel';

-- Gear parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'outerDiameter', 'number', 'Outer Diameter', 150, 40, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'gear';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'teethCount', 'number', 'Number of Teeth', 20, 8, 60, 1, '', true, 2 FROM shapes WHERE slug = 'gear';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'toothDepth', 'number', 'Tooth Depth', 10, 3, 30, 1, 'mm', true, 3 FROM shapes WHERE slug = 'gear';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'centerHoleDiameter', 'number', 'Center Hole Diameter', 20, 5, 80, 1, 'mm', true, 4 FROM shapes WHERE slug = 'gear';

-- Radial Mounting Plate parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'size', 'number', 'Size', 150, 60, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'radial-mounting-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 20, 0, 50, 1, 'mm', false, 2 FROM shapes WHERE slug = 'radial-mounting-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'centerHoleDiameter', 'number', 'Center Hole Diameter', 40, 10, 100, 1, 'mm', true, 3 FROM shapes WHERE slug = 'radial-mounting-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltCircleDiameter', 'number', 'Bolt Circle Diameter', 100, 30, 300, 1, 'mm', true, 4 FROM shapes WHERE slug = 'radial-mounting-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltHoleDiameter', 'number', 'Bolt Hole Diameter', 8, 3, 20, 0.5, 'mm', true, 5 FROM shapes WHERE slug = 'radial-mounting-plate';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'boltHoleCount', 'number', 'Bolt Hole Count', 8, 4, 12, 1, '', true, 6 FROM shapes WHERE slug = 'radial-mounting-plate';

-- Connecting Bar parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 180, 60, 400, 1, 'mm', true, 1 FROM shapes WHERE slug = 'connecting-bar';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 50, 25, 100, 1, 'mm', true, 2 FROM shapes WHERE slug = 'connecting-bar';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 10, 0, 25, 1, 'mm', false, 3 FROM shapes WHERE slug = 'connecting-bar';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 20, 5, 40, 1, 'mm', true, 4 FROM shapes WHERE slug = 'connecting-bar';

-- Curved Mounting Tab parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 80, 40, 200, 1, 'mm', true, 1 FROM shapes WHERE slug = 'curved-mounting-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 120, 60, 250, 1, 'mm', true, 2 FROM shapes WHERE slug = 'curved-mounting-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 25, 8, 50, 1, 'mm', true, 3 FROM shapes WHERE slug = 'curved-mounting-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'curveHeight', 'number', 'Curve Height', 30, 10, 60, 1, 'mm', true, 4 FROM shapes WHERE slug = 'curved-mounting-tab';

-- Rectangular Tab parameters
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'width', 'number', 'Width', 60, 30, 150, 1, 'mm', true, 1 FROM shapes WHERE slug = 'rectangular-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'height', 'number', 'Height', 100, 50, 200, 1, 'mm', true, 2 FROM shapes WHERE slug = 'rectangular-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'cornerRadius', 'range', 'Corner Radius', 5, 0, 20, 1, 'mm', false, 3 FROM shapes WHERE slug = 'rectangular-tab';
INSERT INTO shape_parameters (shape_id, parameter_name, parameter_type, label, default_value, min_value, max_value, step_value, unit, is_required, display_order)
SELECT id, 'holeDiameter', 'number', 'Hole Diameter', 20, 5, 40, 1, 'mm', true, 4 FROM shapes WHERE slug = 'rectangular-tab';

-- Map new shapes to materials, thickness, services, and finishes
INSERT INTO shape_materials (shape_id, material_id)
SELECT s.id, m.id FROM shapes s CROSS JOIN materials m
WHERE s.slug IN ('center-hole-plate', 'perforated-panel', 'circle-flange', 'oval-flange', 'link-bar',
'square-flange', 'square-cutout', 'hanging-tab', 'corner-bracket', 'diamond-plate', 'star', 'octagon',
'hex-nut', 'arch', 'pill', 'ellipse', 'trapezoid', 'hourglass', 'curved-tab', 'spoked-wheel', 'gear',
'radial-mounting-plate', 'connecting-bar', 'curved-mounting-tab', 'rectangular-tab')
ON CONFLICT DO NOTHING;

INSERT INTO shape_thickness (shape_id, thickness_id)
SELECT s.id, t.id FROM shapes s CROSS JOIN thickness_options t
WHERE s.slug IN ('center-hole-plate', 'perforated-panel', 'circle-flange', 'oval-flange', 'link-bar',
'square-flange', 'square-cutout', 'hanging-tab', 'corner-bracket', 'diamond-plate', 'star', 'octagon',
'hex-nut', 'arch', 'pill', 'ellipse', 'trapezoid', 'hourglass', 'curved-tab', 'spoked-wheel', 'gear',
'radial-mounting-plate', 'connecting-bar', 'curved-mounting-tab', 'rectangular-tab')
ON CONFLICT DO NOTHING;

INSERT INTO shape_services (shape_id, service_id)
SELECT s.id, sv.id FROM shapes s CROSS JOIN services sv
WHERE s.slug IN ('center-hole-plate', 'perforated-panel', 'circle-flange', 'oval-flange', 'link-bar',
'square-flange', 'square-cutout', 'hanging-tab', 'corner-bracket', 'diamond-plate', 'star', 'octagon',
'hex-nut', 'arch', 'pill', 'ellipse', 'trapezoid', 'hourglass', 'curved-tab', 'spoked-wheel', 'gear',
'radial-mounting-plate', 'connecting-bar', 'curved-mounting-tab', 'rectangular-tab')
AND sv.service_type = 'cutting'
ON CONFLICT DO NOTHING;

INSERT INTO shape_finishing (shape_id, finishing_id)
SELECT s.id, f.id FROM shapes s CROSS JOIN finishing_options f
WHERE s.slug IN ('center-hole-plate', 'perforated-panel', 'circle-flange', 'oval-flange', 'link-bar',
'square-flange', 'square-cutout', 'hanging-tab', 'corner-bracket', 'diamond-plate', 'star', 'octagon',
'hex-nut', 'arch', 'pill', 'ellipse', 'trapezoid', 'hourglass', 'curved-tab', 'spoked-wheel', 'gear',
'radial-mounting-plate', 'connecting-bar', 'curved-mounting-tab', 'rectangular-tab')
ON CONFLICT DO NOTHING;
