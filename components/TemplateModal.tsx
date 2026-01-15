import React, { useState, useEffect } from 'react';
import { apiClient, Shape } from '../services/apiClient';
import ShapeThumbnail from './ShapeThumbnail';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (shape: Shape) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchShapes();
    }
  }, [isOpen]);

  const fetchShapes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.shapes.getAll();
      setShapes(data.filter(s => s.is_active));
    } catch (err: any) {
      setError(err.message || 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
          </svg>
        );
      case 'Circles':
        return (
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
          </svg>
        );
      case 'Complex':
        return (
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 6v12l8-6 8 6V6" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      default: return 'bg-slate-50 text-slate-600 group-hover:bg-slate-100';
    }
  };

  const handleSelect = async (shape: Shape) => {
    try {
      // Fetch full shape with parameters
      const fullShape = await apiClient.shapes.getById(shape.id);
      onSelect(fullShape);
      onClose();
    } catch (err) {
      console.error('Failed to fetch shape details:', err);
      // Fallback to basic shape if fetch fails
      onSelect(shape);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Choose a Template</h2>
              <p className="text-sm text-slate-500 mt-0.5">Select a shape to start configuring your part</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
            {/* Category Filter */}
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2 mb-6">
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

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500">Loading templates...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={fetchShapes}
                  className="text-sm text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            ) : filteredShapes.length === 0 ? (
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredShapes.map((shape) => (
                  <div
                    key={shape.id}
                    onClick={() => handleSelect(shape)}
                    className="group relative bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
                  >
                    {/* Preview Area - Shape Thumbnail */}
                    <div className="h-32 bg-slate-50 flex items-center justify-center p-3">
                      <ShapeThumbnail
                        svgGenerator={shape.svg_path_generator}
                        className="w-full h-full"
                        fillColor="#94a3b8"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3 border-t border-slate-100">
                      <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {shape.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-400">
                          {shape.parameter_count || 0} params
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {shape.category || 'Other'}
                        </span>
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
