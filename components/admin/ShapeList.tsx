import React, { useState, useEffect } from 'react';
import { apiClient, Shape } from '../../services/apiClient';

interface ShapeListProps {
  onCreateNew: () => void;
  onEdit: (shape: Shape) => void;
}

const ShapeList: React.FC<ShapeListProps> = ({ onCreateNew, onEdit }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchShapes = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.shapes.getAll();
      setShapes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load shapes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShapes();
  }, []);

  const handleToggleActive = async (shape: Shape) => {
    try {
      const updated = await apiClient.shapes.activate(shape.id, !shape.is_active);
      setShapes(shapes.map(s => s.id === shape.id ? { ...s, is_active: updated.is_active } : s));
    } catch (err: any) {
      setError(err.message || 'Failed to update shape');
    }
  };

  const handleDelete = async (shape: Shape) => {
    if (!confirm(`Are you sure you want to delete "${shape.name}"?`)) return;

    try {
      await apiClient.shapes.delete(shape.id);
      setShapes(shapes.filter(s => s.id !== shape.id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete shape');
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Rectangles': 'bg-blue-100 text-blue-700',
      'Circles': 'bg-green-100 text-green-700',
      'Complex': 'bg-purple-100 text-purple-700',
      'Imported': 'bg-orange-100 text-orange-700',
    };
    return colors[category || ''] || 'bg-slate-100 text-slate-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-slate-600">{shapes.length} templates</p>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Shape
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-4">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {shapes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No shapes yet</h3>
          <p className="text-slate-500 mb-4">Create your first shape template to get started</p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Shape
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shapes.map((shape) => (
            <div
              key={shape.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Preview Area */}
              <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative">
                {shape.preview_image_url ? (
                  <img src={shape.preview_image_url} alt={shape.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-slate-300">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  shape.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {shape.is_active ? 'Active' : 'Draft'}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{shape.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(shape.category)}`}>
                    {shape.category || 'Uncategorized'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {shape.description || 'No description'}
                </p>
                <div className="text-xs text-slate-400 mb-4">
                  {shape.parameter_count || 0} parameters
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(shape)}
                    className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(shape)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      shape.is_active
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    {shape.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(shape)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Parameters</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shapes.map((shape) => (
                <tr key={shape.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{shape.name}</div>
                    <div className="text-sm text-slate-500">{shape.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(shape.category)}`}>
                      {shape.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{shape.parameter_count || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      shape.is_active ? 'text-green-600' : 'text-slate-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${shape.is_active ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                      {shape.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(shape)}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(shape)}
                        className={`px-3 py-1.5 text-sm rounded transition-colors ${
                          shape.is_active
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {shape.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(shape)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShapeList;
