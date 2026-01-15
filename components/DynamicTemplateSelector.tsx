import React, { useState, useEffect } from 'react';
import { apiClient, Shape } from '../services/apiClient';

interface DynamicTemplateSelectorProps {
  onSelect: (shape: Shape) => void;
}

const DynamicTemplateSelector: React.FC<DynamicTemplateSelectorProps> = ({ onSelect }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchShapes = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.shapes.getAll();
        // Only get active shapes for public view
        setShapes(data.filter(s => s.is_active));
      } catch (err: any) {
        setError(err.message || 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };
    fetchShapes();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(shapes.map(s => s.category || 'Other').filter(Boolean))];

  // Filter shapes by category
  const filteredShapes = selectedCategory === 'all'
    ? shapes
    : shapes.filter(s => (s.category || 'Other') === selectedCategory);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Rectangles':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
          </svg>
        );
      case 'Circles':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
          </svg>
        );
      case 'Complex':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 6v12l8-6 8 6V6" />
          </svg>
        );
      case 'Imported':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Rectangles': return 'bg-blue-50 text-blue-600 group-hover:bg-blue-100';
      case 'Circles': return 'bg-green-50 text-green-600 group-hover:bg-green-100';
      case 'Complex': return 'bg-purple-50 text-purple-600 group-hover:bg-purple-100';
      case 'Imported': return 'bg-orange-50 text-orange-600 group-hover:bg-orange-100';
      default: return 'bg-slate-50 text-slate-600 group-hover:bg-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Select a Template</h2>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Select a Template</h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a Template</h2>
        <p className="text-slate-500">Choose a starting shape for your custom part</p>
      </div>

      {/* Category Filter */}
      {categories.length > 2 && (
        <div className="flex justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Templates' : cat}
            </button>
          ))}
        </div>
      )}

      {filteredShapes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates available</h3>
          <p className="text-slate-500">Templates are coming soon. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShapes.map((shape) => (
            <div
              key={shape.id}
              onClick={() => onSelect(shape)}
              className="group relative bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 overflow-hidden cursor-pointer transition-all hover:shadow-xl"
            >
              {/* Preview Area */}
              <div className={`h-36 flex items-center justify-center transition-colors ${getCategoryColor(shape.category)}`}>
                {shape.preview_image_url ? (
                  <img
                    src={shape.preview_image_url}
                    alt={shape.name}
                    className="max-h-28 max-w-full object-contain"
                  />
                ) : (
                  getCategoryIcon(shape.category)
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {shape.name}
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {shape.category || 'Other'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                  {shape.description || 'Customizable template with configurable parameters'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {shape.parameter_count || 0} parameters
                  </span>
                  <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Select
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}

          {/* Upload DXF Card (Coming Soon) */}
          <div className="relative bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden opacity-60">
            <div className="h-36 flex items-center justify-center bg-slate-100">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-700 mb-2">Upload DXF / DWG</h3>
              <p className="text-sm text-slate-500">Import your custom CAD files</p>
            </div>
            <div className="absolute top-3 right-3 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">
              COMING SOON
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTemplateSelector;
