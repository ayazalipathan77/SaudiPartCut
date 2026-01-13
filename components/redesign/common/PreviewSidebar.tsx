import React, { useState } from 'react';
import PartPreview from '../../PartPreview';
import Part3DPreview from '../../Part3DPreview';
import { PartDimensions } from '../../../types';

interface PreviewSidebarProps {
  dimensions: PartDimensions;
  materialColor?: string;
}

type ViewMode = '3D' | '2D' | 'Tools';

const PreviewSidebar: React.FC<PreviewSidebarProps> = ({
  dimensions,
  materialColor = '#9CA3AF',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('3D');

  const tools = [
    { icon: '🏠', label: 'Home', action: () => {} },
    { icon: '📐', label: 'Measure', action: () => {} },
    { icon: '📋', label: 'Info', action: () => {} },
    { icon: '🏗️', label: 'Tools', action: () => {} },
  ];

  return (
    <div className="flex h-full">
      {/* Dark Toolbar */}
      <div className="w-14 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.action}
            className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl transition-colors"
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-900 flex flex-col">
        {/* Preview Content */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === '3D' ? (
            <div className="w-full h-full bg-gray-900">
              <Part3DPreview dimensions={dimensions} materialColor={materialColor} />
            </div>
          ) : viewMode === '2D' ? (
            <div className="w-full h-full flex items-center justify-center p-6 bg-gray-900">
              <PartPreview dimensions={dimensions} materialColor={materialColor} />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🛠️</div>
                <div className="text-sm">Tools Panel</div>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center justify-center gap-2 p-4 bg-gray-800">
          <button
            onClick={() => setViewMode('3D')}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                viewMode === '3D'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            3D
          </button>
          <button
            onClick={() => setViewMode('2D')}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                viewMode === '2D'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            2D
          </button>
          <button
            onClick={() => setViewMode('Tools')}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                viewMode === 'Tools'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            Tools
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewSidebar;
