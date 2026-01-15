import React, { useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

interface DynamicShapePreviewProps {
  svgGenerator?: string;
  threejsGenerator?: string;
  parameters: Record<string, number | string | boolean>;
  materialColor?: string;
  thickness?: number;
}

// Safe function executor for DSL
const executeDSL = (code: string, params: Record<string, any>): string | null => {
  try {
    // Remove 'function' wrapper if present
    let cleanCode = code.trim();
    if (cleanCode.startsWith('function')) {
      // Extract function body
      const bodyStart = cleanCode.indexOf('{') + 1;
      const bodyEnd = cleanCode.lastIndexOf('}');
      cleanCode = cleanCode.substring(bodyStart, bodyEnd);
    }

    // Create a safe function
    const fn = new Function('params', `
      const { ${Object.keys(params).join(', ')} } = params;
      ${cleanCode}
    `);

    return fn(params);
  } catch (error) {
    console.error('DSL execution error:', error);
    return null;
  }
};

// Generate SVG path for common shapes
const generateDefaultPath = (params: Record<string, any>): string => {
  const width = Number(params.width) || 200;
  const height = Number(params.height) || 150;
  const cornerRadius = Number(params.cornerRadius) || 0;
  const r = Math.min(cornerRadius, width / 2, height / 2);

  if (r === 0) {
    return `M 0,0 H ${width} V ${height} H 0 Z`;
  }

  return `
    M ${r},0
    H ${width - r}
    A ${r},${r} 0 0 1 ${width},${r}
    V ${height - r}
    A ${r},${r} 0 0 1 ${width - r},${height}
    H ${r}
    A ${r},${r} 0 0 1 0,${height - r}
    V ${r}
    A ${r},${r} 0 0 1 ${r},0
    Z
  `;
};

// 3D Shape Component
const Shape3D: React.FC<{
  parameters: Record<string, any>;
  color: string;
  thickness: number;
}> = ({ parameters, color, thickness }) => {
  const geometry = useMemo(() => {
    const width = Number(parameters.width) || 200;
    const height = Number(parameters.height) || 150;
    const cornerRadius = Number(parameters.cornerRadius) || 0;
    const r = Math.min(cornerRadius, width / 2, height / 2);

    const shape = new THREE.Shape();

    if (r === 0) {
      shape.moveTo(0, 0);
      shape.lineTo(width, 0);
      shape.lineTo(width, height);
      shape.lineTo(0, height);
      shape.lineTo(0, 0);
    } else {
      shape.moveTo(r, 0);
      shape.lineTo(width - r, 0);
      shape.quadraticCurveTo(width, 0, width, r);
      shape.lineTo(width, height - r);
      shape.quadraticCurveTo(width, height, width - r, height);
      shape.lineTo(r, height);
      shape.quadraticCurveTo(0, height, 0, height - r);
      shape.lineTo(0, r);
      shape.quadraticCurveTo(0, 0, r, 0);
    }

    // Add holes if parameters specify
    const holeDiameter = Number(parameters.holeDiameter) || 0;
    const holeInset = Number(parameters.holeInset) || Math.max(cornerRadius, (holeDiameter / 2) * 3);

    if (holeDiameter > 0) {
      const holeRadius = holeDiameter / 2;
      const holes = [
        { x: holeInset, y: holeInset },
        { x: width - holeInset, y: holeInset },
        { x: width - holeInset, y: height - holeInset },
        { x: holeInset, y: height - holeInset },
      ];

      holes.forEach(pos => {
        const holePath = new THREE.Path();
        holePath.absarc(pos.x, pos.y, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(holePath);
      });
    }

    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [parameters, thickness]);

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 15), [geometry]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#1e293b" linewidth={1} />
      </lineSegments>
    </group>
  );
};

// Auto-frame camera
const AutoFrameCamera: React.FC<{ parameters: Record<string, any> }> = ({ parameters }) => {
  const { camera, size } = useThree();

  React.useEffect(() => {
    const width = Number(parameters.width) || 200;
    const height = Number(parameters.height) || 150;
    const thickness = Number(parameters.thickness) || 4;

    const maxDimension = Math.max(width, height);
    const aspect = size.width / size.height;
    const frustumSize = maxDimension * 2;

    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -frustumSize * aspect / 2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.position.set(0, 0, 1000);
      camera.lookAt(width / 2, height / 2, thickness / 2);
      camera.updateProjectionMatrix();
    }
  }, [parameters, camera, size]);

  return null;
};

// Lighting
const StudioLighting: React.FC = () => (
  <>
    <directionalLight position={[0, 0, 5]} intensity={0.8} />
    <directionalLight position={[0, 0, -5]} intensity={0.8} />
    <directionalLight position={[0, 5, 0]} intensity={0.6} />
    <directionalLight position={[0, -5, 0]} intensity={0.6} />
    <directionalLight position={[-5, 0, 0]} intensity={0.6} />
    <directionalLight position={[5, 0, 0]} intensity={0.6} />
    <ambientLight intensity={0.6} />
  </>
);

const DynamicShapePreview: React.FC<DynamicShapePreviewProps> = ({
  svgGenerator,
  threejsGenerator,
  parameters,
  materialColor = '#94a3b8',
  thickness = 4,
}) => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  // Calculate viewBox dimensions
  const width = Number(parameters.width) || 200;
  const height = Number(parameters.height) || 150;
  const padding = Math.max(width, height) * 0.2;
  const leftPadding = Math.max(padding, 80);
  const topPadding = Math.max(padding, 50);
  const viewBoxWidth = width + leftPadding + leftPadding;
  const viewBoxHeight = height + topPadding + topPadding;

  // Generate SVG path
  const svgPath = useMemo(() => {
    if (svgGenerator) {
      const result = executeDSL(svgGenerator, parameters);
      if (result) return result;
    }
    return generateDefaultPath(parameters);
  }, [svgGenerator, parameters]);

  // Generate holes for 2D preview
  const holeDiameter = Number(parameters.holeDiameter) || 0;
  const holeInset = Number(parameters.holeInset) || Math.max(Number(parameters.cornerRadius) || 0, (holeDiameter / 2) * 3);
  const holes = holeDiameter > 0 ? [
    { x: holeInset, y: holeInset },
    { x: width - holeInset, y: holeInset },
    { x: width - holeInset, y: height - holeInset },
    { x: holeInset, y: height - holeInset },
  ] : [];
  const holeRadius = holeDiameter / 2;

  return (
    <div className="relative bg-slate-50 border border-slate-200 rounded-lg overflow-hidden h-[500px]">
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-4 z-10 flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setViewMode('2d')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === '2d'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === '3d'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          3D
        </button>
      </div>

      {/* Dimensions Label */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-slate-200">
        <p className="text-slate-600 text-xs font-mono">
          {width} × {height} × {thickness} mm
        </p>
      </div>

      {viewMode === '2d' ? (
        /* 2D SVG Preview */
        <div className="w-full h-full flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox={`${-leftPadding} ${-topPadding} ${viewBoxWidth} ${viewBoxHeight}`}
            className="max-w-full max-h-full"
          >
            {/* Grid Background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              </pattern>
              <mask id="holes-mask">
                <rect x={-padding} y={-padding} width={viewBoxWidth} height={viewBoxHeight} fill="white" />
                {holes.map((h, i) => (
                  <circle key={i} cx={h.x} cy={h.y} r={holeRadius} fill="black" />
                ))}
              </mask>
            </defs>

            <rect x={-leftPadding} y={-topPadding} width={viewBoxWidth} height={viewBoxHeight} fill="url(#grid)" />

            {/* Dimension Lines */}
            <g stroke="#94a3b8" strokeWidth="1" fill="none">
              {/* Width */}
              <line x1="0" y1="-15" x2={width} y2="-15" />
              <line x1="0" y1="-20" x2="0" y2="-10" />
              <line x1={width} y1="-20" x2={width} y2="-10" />
              {/* Height */}
              <line x1="-15" y1="0" x2="-15" y2={height} />
              <line x1="-20" y1="0" x2="-10" y2="0" />
              <line x1="-20" y1={height} x2="-10" y2={height} />
            </g>
            <text x={width / 2} y="-25" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace">
              {width} mm
            </text>
            <text x="-25" y={height / 2} textAnchor="end" dominantBaseline="middle" fill="#64748b" fontSize="12" fontFamily="monospace">
              {height} mm
            </text>

            {/* Shape */}
            <path
              d={svgPath}
              fill={materialColor}
              stroke="#334155"
              strokeWidth="1.5"
              mask={holes.length > 0 ? "url(#holes-mask)" : undefined}
            />

            {/* Hole crosshairs */}
            {holes.map((h, i) => (
              <g key={`crosshair-${i}`} opacity="0.3">
                <line x1={h.x - holeRadius - 5} y1={h.y} x2={h.x + holeRadius + 5} y2={h.y} stroke="red" strokeWidth="0.5" strokeDasharray="2,1" />
                <line x1={h.x} y1={h.y - holeRadius - 5} x2={h.x} y2={h.y + holeRadius + 5} stroke="red" strokeWidth="0.5" strokeDasharray="2,1" />
              </g>
            ))}
          </svg>
        </div>
      ) : (
        /* 3D Three.js Preview */
        <Canvas>
          <OrthographicCamera makeDefault position={[0, 0, 1000]} zoom={1} />
          <StudioLighting />
          <AutoFrameCamera parameters={{ ...parameters, thickness }} />
          <Shape3D
            parameters={parameters}
            color={materialColor}
            thickness={thickness}
          />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            enableZoom={false}
            enablePan={false}
            target={[width / 2, height / 2, thickness / 2]}
          />
        </Canvas>
      )}

      {/* 3D Controls Hint */}
      {viewMode === '3d' && (
        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-slate-200">
          <p className="text-slate-600 text-xs font-medium">
            Drag to Rotate
          </p>
        </div>
      )}
    </div>
  );
};

export default DynamicShapePreview;
