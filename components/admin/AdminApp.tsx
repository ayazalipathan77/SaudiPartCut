import React, { useState } from 'react';
import { apiClient, Shape } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import ShapeList from './ShapeList';
import ShapeForm from './ShapeForm';

type AdminTab = 'shapes' | 'materials' | 'thickness' | 'services' | 'finishing' | 'mappings' | 'settings';
type ShapeView = 'list' | 'create' | 'edit';

const AdminApp: React.FC = () => {
  // Use shared auth context instead of separate admin auth
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('shapes');

  // Shape management state
  const [shapeView, setShapeView] = useState<ShapeView>('list');
  const [editingShape, setEditingShape] = useState<Shape | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleCreateShape = () => {
    setEditingShape(null);
    setShapeView('create');
  };

  const handleEditShape = async (shape: Shape) => {
    // Fetch full shape details with parameters and mappings
    try {
      const fullShape = await apiClient.shapes.getById(shape.id);
      setEditingShape(fullShape);
      setShapeView('edit');
    } catch (err) {
      console.error('Failed to load shape details', err);
    }
  };

  const handleShapeSaved = () => {
    setShapeView('list');
    setEditingShape(null);
  };

  const handleCancelEdit = () => {
    setShapeView('list');
    setEditingShape(null);
  };

  // Check if user has admin privileges (user should already be set from AuthContext)
  if (!user || (user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-4">You don't have permission to access the admin panel.</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'shapes':
        if (shapeView === 'list') {
          return <ShapeList onCreateNew={handleCreateShape} onEdit={handleEditShape} />;
        }
        return (
          <ShapeForm
            shape={editingShape}
            onSave={handleShapeSaved}
            onCancel={handleCancelEdit}
          />
        );

      case 'materials':
        return (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Materials Management</h3>
            <p className="text-slate-500">Materials are pre-seeded in the database. CRUD operations coming in Phase 2.</p>
          </div>
        );

      case 'thickness':
        return (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Thickness Options</h3>
            <p className="text-slate-500">Thickness options are pre-seeded. CRUD operations coming in Phase 2.</p>
          </div>
        );

      case 'services':
        return (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Services Management</h3>
            <p className="text-slate-500">Services are pre-seeded. CRUD operations coming in Phase 2.</p>
          </div>
        );

      case 'finishing':
        return (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Finishing Options</h3>
            <p className="text-slate-500">Finishing options are pre-seeded. CRUD operations coming in Phase 2.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminApp;
