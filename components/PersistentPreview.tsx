import React, { useState } from 'react';
import PartPreview from './PartPreview';
import Part3DPreview from './Part3DPreview';
import { PartDimensions, MaterialType } from '../types';

interface PersistentPreviewProps {
  dimensions: PartDimensions;
  materialId: MaterialType;
  previewColor: string;
}

const PersistentPreview: React.FC<PersistentPreviewProps> = ({ dimensions, materialId, previewColor }) => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-24 h-[500px] flex flex-col">
      {/* View Mode Toggle Buttons - Left Side */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-sm ${viewMode === '2d' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}`}
          >
              2D
          </button>
          <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-sm ${viewMode === '3d' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}`}
          >
              3D
          </button>
      </div>

      <div className="flex-1 bg-slate-100 relative">
          {viewMode === '2d' ? (
              <div className="w-full h-full">
                  <PartPreview dimensions={dimensions} materialColor={previewColor} />
              </div>
          ) : (
              <div className="w-full h-full">
                  <Part3DPreview dimensions={dimensions} materialId={materialId} />
              </div>
          )}

          {/* Dimensions Label - Bottom Right */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-slate-200">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>{dimensions.width}mm × {dimensions.height}mm</span>
                  <span className="text-slate-300">|</span>
                  <span>Thickness: {dimensions.thickness}mm</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default PersistentPreview;