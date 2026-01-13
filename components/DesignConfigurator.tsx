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
    <div>
      {/* Horizontal Sections Container - Match Preview Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Section 1: Main Dimensions */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
            Main Dimensions
          </h3>
          <div className="space-y-6 overflow-y-auto flex-1 pr-2">
            {/* Width */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">Width</label>
                <span className="text-xs text-slate-500 font-mono">{dimensions.width} mm</span>
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
                className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">Height</label>
                <span className="text-xs text-slate-500 font-mono">{dimensions.height} mm</span>
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
                className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Info */}
            <div className="pt-4 mt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 leading-relaxed">
                All dimensions in millimeters (mm).<br/>
                Tolerance: ±0.5mm for Laser/Waterjet.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Details */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
            Details
          </h3>
          <div className="space-y-6 overflow-y-auto flex-1 pr-2">
            {/* Corner Radius */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">Corner Radius</label>
                <span className="text-xs text-slate-500 font-mono">{dimensions.cornerRadius} mm</span>
              </div>
              <input
                type="number"
                value={dimensions.cornerRadius}
                onChange={(e) => handleChange('cornerRadius', Number(e.target.value))}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0 - sharp corners"
              />
              <p className="text-xs text-slate-400">
                Rounded corners reduce stress concentration
              </p>
            </div>

            {/* Hole Diameter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">Hole Diameter</label>
                <span className="text-xs text-slate-500 font-mono">{dimensions.holeDiameter} mm</span>
              </div>
              <input
                type="number"
                value={dimensions.holeDiameter}
                onChange={(e) => handleChange('holeDiameter', Number(e.target.value))}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Mounting hole size"
              />
              <p className="text-xs text-slate-400">
                4 holes at each corner for mounting
              </p>
            </div>

            {/* Visual Guide */}
            <div className="pt-4 mt-4 border-t border-slate-200">
              <div className="bg-slate-50 rounded-md p-3 text-center">
                <svg className="w-full h-24 text-slate-300" viewBox="0 0 200 120" fill="none" stroke="currentColor">
                  <rect x="20" y="20" width="160" height="80" rx="8" strokeWidth="2" />
                  <circle cx="30" cy="30" r="4" fill="currentColor" />
                  <circle cx="170" cy="30" r="4" fill="currentColor" />
                  <circle cx="170" cy="90" r="4" fill="currentColor" />
                  <circle cx="30" cy="90" r="4" fill="currentColor" />
                </svg>
                <p className="text-xs text-slate-400 mt-2">Standard template with corner holes</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DesignConfigurator;