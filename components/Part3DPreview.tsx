import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { PartDimensions, MaterialType } from '../types';

interface Part3DPreviewProps {
  dimensions: PartDimensions;
  materialId: MaterialType;
}

const MaterialConfig: Record<string, any> = {
  mild_steel: { color: '#5a5a5a', roughness: 0.7, metalness: 0.5 },
  stainless_304: { color: '#e0e0e0', roughness: 0.3, metalness: 0.9 },
  stainless_316: { color: '#f0f0f0', roughness: 0.2, metalness: 1.0 },
  aluminum: { color: '#d4d4d4', roughness: 0.5, metalness: 0.6 },
  brass: { color: '#d4af37', roughness: 0.3, metalness: 0.8 },
};

const PartMesh: React.FC<{ dimensions: PartDimensions; materialId: MaterialType }> = ({ dimensions, materialId }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
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

  const matProps = MaterialConfig[materialId] || MaterialConfig['mild_steel'];

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial {...matProps} envMapIntensity={1} />
    </mesh>
  );
};

// Camera Tracker - Updates parent component with camera rotation
const CameraTracker: React.FC<{ onRotationChange: (rotation: { x: number; y: number; z: number }) => void }> = ({ onRotationChange }) => {
  const { camera } = useThree();

  useFrame(() => {
    // Convert camera position to rotation angles
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
    onRotationChange({
      x: euler.x * (180 / Math.PI),
      y: euler.y * (180 / Math.PI),
      z: euler.z * (180 / Math.PI)
    });
  });

  return null;
};

// View Cube Component
const ViewCube: React.FC<{ rotation: { x: number; y: number; z: number } }> = ({ rotation }) => {
  return (
    <div className="absolute top-4 right-4 w-20 h-20 pointer-events-none">
      <div
        className="relative w-full h-full transform-gpu preserve-3d transition-transform duration-100"
        style={{
          transform: `rotateX(${-rotation.x}deg) rotateY(${-rotation.y}deg) rotateZ(${rotation.z}deg)`
        }}
      >
        {/* Cube faces */}
        <div className="absolute inset-0 bg-white/90 border border-slate-300 rounded-lg shadow-lg flex items-center justify-center text-xs font-bold text-slate-600">
          F
        </div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-white/70 border-l border-t border-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-500 transform origin-left -skew-y-12">
          T
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-20 bg-white/60 border-l border-b border-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-500 transform origin-left skew-y-12">
          R
        </div>
      </div>
    </div>
  );
};

const Part3DPreview: React.FC<Part3DPreviewProps> = ({ dimensions, materialId }) => {
  const [cameraRotation, setCameraRotation] = useState({ x: 20, y: -30, z: 0 });

  return (
    <div className="w-full h-full bg-slate-50 rounded-lg overflow-hidden relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 300]} fov={50} />
        <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
          <PartMesh dimensions={dimensions} materialId={materialId} />
        </Stage>
        <OrbitControls autoRotate autoRotateSpeed={2} makeDefault />
        <CameraTracker onRotationChange={setCameraRotation} />
      </Canvas>

      {/* View Cube */}
      <ViewCube rotation={cameraRotation} />

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-slate-400 text-xs font-medium pointer-events-none">
          Left Click: Rotate • Scroll: Zoom
      </div>
    </div>
  );
};

export default Part3DPreview;