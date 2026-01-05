import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
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

const Part3DPreview: React.FC<Part3DPreviewProps> = ({ dimensions, materialId }) => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 300]} fov={50} />
        <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
          <PartMesh dimensions={dimensions} materialId={materialId} />
        </Stage>
        <OrbitControls autoRotate autoRotateSpeed={2} makeDefault />
      </Canvas>
      <div className="absolute bottom-4 left-4 text-white/50 text-xs font-mono pointer-events-none">
          Left Click: Rotate • Scroll: Zoom
      </div>
    </div>
  );
};

export default Part3DPreview;