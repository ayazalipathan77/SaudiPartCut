import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { PartDimensions, MaterialType } from '../types';

interface Part3DPreviewProps {
  dimensions: PartDimensions;
  materialId: MaterialType;
}

// Professional CAD material configurations
const MaterialConfig: Record<string, any> = {
  mild_steel: { color: '#8b9196', roughness: 0.6, metalness: 0.3 },
  stainless_304: { color: '#c0c5ca', roughness: 0.5, metalness: 0.25 },
  stainless_316: { color: '#d0d5da', roughness: 0.5, metalness: 0.25 },
  aluminum: { color: '#b8bec3', roughness: 0.55, metalness: 0.28 },
  brass: { color: '#c9a961', roughness: 0.5, metalness: 0.3 },
};

const PartMesh: React.FC<{ dimensions: PartDimensions; materialId: MaterialType }> = ({ dimensions, materialId }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  // Create Geometry
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = dimensions.width;
    const h = dimensions.height;
    const r = Math.min(dimensions.cornerRadius, w / 2, h / 2);

    // Draw rounded rect
    s.moveTo(0, r);
    s.lineTo(0, h - r);
    s.quadraticCurveTo(0, h, r, h);
    s.lineTo(w - r, h);
    s.quadraticCurveTo(w, h, w, h - r);
    s.lineTo(w, r);
    s.quadraticCurveTo(w, 0, w - r, 0);
    s.lineTo(r, 0);
    s.quadraticCurveTo(0, 0, 0, r);

    // Create holes
    const holeRadius = dimensions.holeDiameter / 2;
    const holeInset = Math.max(dimensions.cornerRadius, holeRadius * 3);

    const holePositions = [
        [holeInset, holeInset],
        [w - holeInset, holeInset],
        [w - holeInset, h - holeInset],
        [holeInset, h - holeInset]
    ];

    holePositions.forEach(([x, y]) => {
        const holePath = new THREE.Path();
        holePath.absarc(x, y, holeRadius, 0, Math.PI * 2, true);
        s.holes.push(holePath);
    });

    return s;
  }, [dimensions]);

  const extrudeSettings = useMemo(() => ({
    depth: dimensions.thickness,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelSegments: 3
  }), [dimensions.thickness]);

  // Create edges geometry for silhouette enhancement
  const edgesGeometry = useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return new THREE.EdgesGeometry(geom, 15); // 15 degree threshold for edge detection
  }, [shape, extrudeSettings]);

  const matProps = MaterialConfig[materialId] || MaterialConfig['mild_steel'];

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Main mesh with professional material */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          {...matProps}
          side={THREE.DoubleSide}
          flatShading={false}
          toneMapped={true}
        />
      </mesh>

      {/* Edge enhancement for crisp silhouette */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#2d3748" linewidth={1} transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
};

// Auto-framing component - calculates optimal camera zoom for orthographic view (only on mount)
const AutoFrameCamera: React.FC<{ dimensions: PartDimensions }> = ({ dimensions }) => {
  const { camera, size } = useThree();
  const hasFramed = React.useRef(false);

  useEffect(() => {
    // Only auto-frame once on initial mount
    if (hasFramed.current) return;

    const w = dimensions.width;
    const h = dimensions.height;
    const t = dimensions.thickness;

    // For orthographic camera, calculate zoom based on viewport and object size
    const maxDimension = Math.max(w, h);
    const aspect = size.width / size.height;
    const frustumSize = maxDimension * 2; // Add padding around the object

    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -frustumSize * aspect / 2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.position.set(0, 0, 1000); // Fixed distance for orthographic
      camera.lookAt(w / 2, h / 2, t / 2);
      camera.updateProjectionMatrix();
    }

    hasFramed.current = true;
  }, []); // Empty deps - only run on mount

  return null;
};

// Professional CAD lighting rig
const StudioLighting: React.FC = () => {
  return (
    <>
      {/* Primary key light - front top right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light - rear left, softer */}
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />

      {/* Ambient base lighting */}
      <ambientLight intensity={0.3} />

      {/* Subtle hemisphere light for natural feel */}
      <hemisphereLight args={['#ffffff', '#444444', 0.3]} />
    </>
  );
};

// Camera rotation tracker - runs inside Canvas and updates parent state
const CameraRotationTracker: React.FC<{ onRotationUpdate: (rotation: { x: number; y: number; z: number }) => void }> = ({ onRotationUpdate }) => {
  const { camera } = useThree();

  useEffect(() => {
    const updateRotation = () => {
      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
      onRotationUpdate({
        x: euler.x * (180 / Math.PI),
        y: euler.y * (180 / Math.PI),
        z: euler.z * (180 / Math.PI),
      });
    };

    updateRotation();
    const interval = setInterval(updateRotation, 50);
    return () => clearInterval(interval);
  }, [camera, onRotationUpdate]);

  return null;
};

// Orientation cube widget - displays camera orientation (outside Canvas)
const OrientationCubeWidget: React.FC<{ rotation: { x: number; y: number; z: number } }> = ({ rotation }) => {
  return (
    <div className="absolute top-4 right-4 w-16 h-16 pointer-events-none">
      <div
        className="relative w-full h-full"
        style={{
          transform: `rotateX(${-rotation.x}deg) rotateY(${-rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 bg-blue-500/80 border border-blue-600 rounded flex items-center justify-center text-white text-xs font-bold"
          style={{ transform: 'translateZ(32px)' }}
        >
          F
        </div>
        {/* Back face */}
        <div
          className="absolute inset-0 bg-slate-400/80 border border-slate-500 rounded flex items-center justify-center text-white text-xs font-bold"
          style={{ transform: 'translateZ(-32px) rotateY(180deg)' }}
        >
          B
        </div>
        {/* Right face */}
        <div
          className="absolute inset-0 bg-green-500/80 border border-green-600 rounded flex items-center justify-center text-white text-xs font-bold"
          style={{ transform: 'rotateY(90deg) translateZ(32px)' }}
        >
          R
        </div>
        {/* Left face */}
        <div
          className="absolute inset-0 bg-red-500/80 border border-red-600 rounded flex items-center justify-center text-white text-xs font-bold"
          style={{ transform: 'rotateY(-90deg) translateZ(32px)' }}
        >
          L
        </div>
        {/* Top face */}
        <div
          className="absolute inset-0 bg-yellow-500/80 border border-yellow-600 rounded flex items-center justify-center text-white text-xs font-bold"
          style={{ transform: 'rotateX(90deg) translateZ(32px)' }}
        >
          T
        </div>
      </div>
    </div>
  );
};

const Part3DPreview: React.FC<Part3DPreviewProps> = ({ dimensions, materialId }) => {
  const [cameraRotation, setCameraRotation] = React.useState({ x: 0, y: 0, z: 0 });

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden relative shadow-inner">
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputEncoding: THREE.sRGBEncoding,
        }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 1000]} zoom={1} />

        {/* Professional studio lighting */}
        <StudioLighting />

        {/* Auto-frame camera for optimal view */}
        <AutoFrameCamera dimensions={dimensions} />

        {/* Rendered part with edge enhancement */}
        <PartMesh dimensions={dimensions} materialId={materialId} />

        {/* Camera rotation tracker */}
        <CameraRotationTracker onRotationUpdate={setCameraRotation} />

        {/* Optimized CAD-style controls - rotation only */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          enableZoom={false}
          enablePan={false}
          target={[dimensions.width / 2, dimensions.height / 2, dimensions.thickness / 2]}
        />
      </Canvas>

      {/* Orientation widget */}
      <OrientationCubeWidget rotation={cameraRotation} />

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-slate-200">
        <p className="text-slate-600 text-xs font-medium">
          🖱️ Drag to Rotate
        </p>
      </div>
    </div>
  );
};

export default Part3DPreview;