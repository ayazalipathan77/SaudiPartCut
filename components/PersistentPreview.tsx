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
      <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button 
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-sm ${viewMode === '2d' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
              2D View
          </button>
          <button 
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-sm ${viewMode === '3d' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
              3D Render
          </button>
      </div>

      <div className="flex-1 bg-slate-100 relative">
          {viewMode === '2d' ? (
              <div className="w-full h-full p-4">
                  <PartPreview dimensions={dimensions} materialColor={previewColor} />
              </div>
          ) : (
              <div className="w-full h-full">
                  <Part3DPreview dimensions={dimensions} materialId={materialId} />
              </div>
          )}
      </div>
      
      <div className="bg-white p-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <span>{dimensions.width}mm x {dimensions.height}mm</span>
          <span>Thickness: {dimensions.thickness}mm</span>
      </div>
    </div>
  );
};

export default PersistentPreview;