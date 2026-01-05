import React from 'react';
import { PartDimensions } from '../types';

interface DesignConfiguratorProps {
  dimensions: PartDimensions;
  setDimensions: React.Dispatch<React.SetStateAction<PartDimensions>>;
}

const DesignConfigurator: React.FC<DesignConfiguratorProps> = ({ dimensions, setDimensions }) => {
  
  const handleChange = (key: keyof PartDimensions, value: number) => {
    let newVal = value;
    // Limits
    if (key === 'width' || key === 'height') newVal = Math.max(50, Math.min(2000, value));
    if (key === 'cornerRadius') newVal = Math.max(0, Math.min(Math.min(dimensions.width, dimensions.height) / 2, value));
    if (key === 'holeDiameter') newVal = Math.max(0, Math.min(50, value));

    setDimensions(prev => ({ ...prev, [key]: newVal }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Configure Dimensions</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Width</label>
            <span className="text-xs text-slate-400 font-mono">{dimensions.width} mm</span>
          </div>
          <input 
            type="range" min="50" max="1000" step="1" 
            value={dimensions.width}
            onChange={(e) => handleChange('width', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input 
            type="number" 
            value={dimensions.width}
            onChange={(e) => handleChange('width', Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Height</label>
            <span className="text-xs text-slate-400 font-mono">{dimensions.height} mm</span>
          </div>
          <input 
            type="range" min="50" max="1000" step="1" 
            value={dimensions.height}
            onChange={(e) => handleChange('height', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input 
            type="number" 
            value={dimensions.height}
            onChange={(e) => handleChange('height', Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Corner Radius</label>
            <input 
              type="number" 
              value={dimensions.cornerRadius}
              onChange={(e) => handleChange('cornerRadius', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hole Diameter</label>
            <input 
              type="number" 
              value={dimensions.holeDiameter}
              onChange={(e) => handleChange('holeDiameter', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              All dimensions are in millimeters (mm). <br/>
              Tolerance: +/- 0.5mm for Laser/Waterjet.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;