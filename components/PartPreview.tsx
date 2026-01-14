import React, { useMemo } from 'react';
import { PartDimensions } from '../types';

interface PartPreviewProps {
  dimensions: PartDimensions;
  materialColor: string;
}

const PartPreview: React.FC<PartPreviewProps> = ({ dimensions, materialColor }) => {
  const { width, height, cornerRadius, holeDiameter } = dimensions;

  // Calculate SVG ViewBox to center the part with some padding
  const padding = Math.max(width, height) * 0.2;
  const viewBoxWidth = width + padding * 2;
  const viewBoxHeight = height + padding * 2;

  // Generate Path Data
  const pathData = useMemo(() => {
    const w = width;
    const h = height;
    const r = Math.min(cornerRadius, w / 2, h / 2); // Clamp radius

    // Starting top-left after corner
    return `
      M ${r},0
      H ${w - r}
      A ${r},${r} 0 0 1 ${w},${r}
      V ${h - r}
      A ${r},${r} 0 0 1 ${w - r},${h}
      H ${r}
      A ${r},${r} 0 0 1 0,${h - r}
      V ${r}
      A ${r},${r} 0 0 1 ${r},0
      Z
    `;
  }, [width, height, cornerRadius]);

  const holeRadius = holeDiameter / 2;
  // Clamp hole position to be inside the corner radius area logically, or just offset by cornerRadius if large enough
  // For this template, holes are centered at (r, r) from each corner if r > holeRadius * 2, else simply inset
  const holeInset = Math.max(cornerRadius, holeRadius * 3); 
  
  const holes = [
    { x: holeInset, y: holeInset },
    { x: width - holeInset, y: holeInset },
    { x: width - holeInset, y: height - holeInset },
    { x: holeInset, y: height - holeInset },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg shadow-inner overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs text-slate-500 font-mono border border-slate-200">
        Preview Scale: 1:1 (Approx)
      </div>
      
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
        className="max-w-full max-h-[600px] drop-shadow-xl transition-all duration-300 ease-out"
      >
        {/* Measurement Lines (Simplified) */}
        {/* Top Width Dimension */}
        <line x1="0" y1="-15" x2={width} y2="-15" stroke="#94a3b8" strokeWidth="1" />
        <line x1="0" y1="-20" x2="0" y2="-10" stroke="#94a3b8" strokeWidth="1" />
        <line x1={width} y1="-20" x2={width} y2="-10" stroke="#94a3b8" strokeWidth="1" />
        <text x={width / 2} y="-25" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace">
          {width} mm
        </text>

        {/* Left Height Dimension */}
        <line x1="-15" y1="0" x2="-15" y2={height} stroke="#94a3b8" strokeWidth="1" />
        <line x1="-20" y1="0" x2="-10" y2="0" stroke="#94a3b8" strokeWidth="1" />
        <line x1="-20" y1={height} x2="-10" y2={height} stroke="#94a3b8" strokeWidth="1" />
        <text x="-25" y={height / 2} textAnchor="end" dominantBaseline="middle" fill="#64748b" fontSize="12" fontFamily="monospace">
          {height} mm
        </text>

        {/* The Part */}
        <mask id="holes-mask">
          <rect x={-padding} y={-padding} width={viewBoxWidth} height={viewBoxHeight} fill="white" />
          {holes.map((h, i) => (
             <circle key={i} cx={h.x} cy={h.y} r={holeRadius} fill="black" />
          ))}
        </mask>

        <path
          d={pathData}
          fill={materialColor}
          stroke="#334155"
          strokeWidth="1.5"
          mask="url(#holes-mask)"
          className="transition-colors duration-500"
        />
        
        {/* Technical crosshairs for holes */}
        {holes.map((h, i) => (
            <g key={`crosshair-${i}`} opacity="0.3">
                <line x1={h.x - holeRadius - 5} y1={h.y} x2={h.x + holeRadius + 5} y2={h.y} stroke="red" strokeWidth="0.5" strokeDasharray="2,1" />
                <line x1={h.x} y1={h.y - holeRadius - 5} x2={h.x} y2={h.y + holeRadius + 5} stroke="red" strokeWidth="0.5" strokeDasharray="2,1" />
            </g>
        ))}

      </svg>
    </div>
  );
};

export default PartPreview;
