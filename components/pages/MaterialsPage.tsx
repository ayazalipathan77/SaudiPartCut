import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MaterialDef } from '../../types';

interface MaterialsPageProps {
  onStartQuote: () => void;
}

const MATERIAL_CATEGORIES = [
  { id: 'all', name: 'All Materials', icon: '🔩' },
  { id: 'metal', name: 'Metals', icon: '🔧' },
  { id: 'composite', name: 'Composites', icon: '🧱' },
  { id: 'plastic', name: 'Plastics', icon: '🧪' },
  { id: 'rubber', name: 'Rubber & Gasket', icon: '⚫' },
  { id: 'wood', name: 'Wood & Board', icon: '🪵' },
];

const CUTTING_METHODS = [
  { id: 'all', name: 'All Methods' },
  { id: 'laser', name: 'Laser Cutting' },
  { id: 'waterjet', name: 'Waterjet' },
  { id: 'plasma', name: 'Plasma' },
  { id: 'cnc', name: 'CNC Routing' },
];

// Extended materials with categories
const EXTENDED_MATERIALS = [
  { id: 'mild_steel', name: 'Mild Steel', category: 'metal', description: 'General purpose steel for structural applications', thicknesses: [1, 2, 3, 4, 5, 6, 8, 10, 12], cuttingMethods: ['laser', 'plasma', 'waterjet'] },
  { id: 'stainless_304', name: 'Stainless Steel 304', category: 'metal', description: 'Corrosion resistant, food-grade stainless', thicknesses: [1, 1.5, 2, 3, 4, 5, 6], cuttingMethods: ['laser', 'waterjet'] },
  { id: 'stainless_316', name: 'Stainless Steel 316', category: 'metal', description: 'Marine-grade stainless steel', thicknesses: [1, 1.5, 2, 3, 4, 5], cuttingMethods: ['laser', 'waterjet'] },
  { id: 'aluminum', name: 'Aluminum 6061', category: 'metal', description: 'Versatile aluminum alloy for general use', thicknesses: [1, 2, 3, 4, 5, 6, 8, 10], cuttingMethods: ['laser', 'waterjet', 'cnc'] },
  { id: 'aluminum_5052', name: 'Aluminum 5052', category: 'metal', description: 'Marine-grade aluminum with excellent corrosion resistance', thicknesses: [1, 2, 3, 4, 5, 6], cuttingMethods: ['laser', 'waterjet'] },
  { id: 'brass', name: 'Brass', category: 'metal', description: 'Decorative brass for ornamental applications', thicknesses: [1, 1.5, 2, 3], cuttingMethods: ['laser', 'waterjet'] },
  { id: 'copper', name: 'Copper', category: 'metal', description: 'Pure copper for electrical and decorative use', thicknesses: [1, 1.5, 2, 3], cuttingMethods: ['laser', 'waterjet'] },
  { id: 'titanium', name: 'Titanium Grade 2', category: 'metal', description: 'Lightweight, high-strength titanium', thicknesses: [1, 2, 3, 4], cuttingMethods: ['waterjet'] },
  { id: 'carbon_fiber', name: 'Carbon Fiber', category: 'composite', description: '2x2 twill weave, aerospace-grade', thicknesses: [1, 2, 3, 4, 5], cuttingMethods: ['waterjet', 'cnc'] },
  { id: 'g10', name: 'G-10/FR-4', category: 'composite', description: 'Glass fiber reinforced laminate', thicknesses: [1.5, 3, 6], cuttingMethods: ['waterjet', 'cnc'] },
  { id: 'acm', name: 'ACM Panel', category: 'composite', description: 'Aluminum composite material for signage', thicknesses: [3, 4], cuttingMethods: ['cnc'] },
  { id: 'acrylic_clear', name: 'Acrylic (Clear)', category: 'plastic', description: 'Crystal clear cast acrylic', thicknesses: [2, 3, 4, 5, 6, 8, 10], cuttingMethods: ['laser', 'cnc'] },
  { id: 'acrylic_color', name: 'Acrylic (Colored)', category: 'plastic', description: 'Cast acrylic in various colors', thicknesses: [3, 5, 6], cuttingMethods: ['laser', 'cnc'] },
  { id: 'polycarbonate', name: 'Polycarbonate (Lexan)', category: 'plastic', description: 'Impact-resistant clear plastic', thicknesses: [2, 3, 4.5, 6, 8], cuttingMethods: ['laser', 'cnc'] },
  { id: 'delrin', name: 'Delrin/Acetal', category: 'plastic', description: 'Engineering plastic for precision parts', thicknesses: [3, 6, 10, 12], cuttingMethods: ['cnc'] },
  { id: 'hdpe', name: 'HDPE', category: 'plastic', description: 'Chemical resistant polyethylene', thicknesses: [3, 6, 10, 12], cuttingMethods: ['cnc'] },
  { id: 'neoprene', name: 'Neoprene Rubber', category: 'rubber', description: 'General purpose gasket material', thicknesses: [1.5, 3, 6], cuttingMethods: ['waterjet'] },
  { id: 'silicone', name: 'Silicone Rubber', category: 'rubber', description: 'High-temperature rubber', thicknesses: [1.5, 3, 6], cuttingMethods: ['waterjet'] },
  { id: 'plywood', name: 'Baltic Birch Plywood', category: 'wood', description: 'Premium plywood for laser cutting', thicknesses: [3, 6, 9, 12], cuttingMethods: ['laser', 'cnc'] },
  { id: 'mdf', name: 'MDF', category: 'wood', description: 'Medium density fiberboard', thicknesses: [3, 6, 9, 12, 18], cuttingMethods: ['laser', 'cnc'] },
];

const MaterialsPage: React.FC<MaterialsPageProps> = ({ onStartQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);

  const filteredMaterials = EXTENDED_MATERIALS.filter(material => {
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesMethod = selectedMethod === 'all' || material.cuttingMethods.includes(selectedMethod);
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesMethod && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'metal': return 'bg-slate-100 text-slate-700';
      case 'composite': return 'bg-blue-100 text-blue-700';
      case 'plastic': return 'bg-purple-100 text-purple-700';
      case 'rubber': return 'bg-gray-100 text-gray-700';
      case 'wood': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Materials Library</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Explore our extensive collection of materials. From metals to plastics, we have the right material for your project.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-blue-400">{EXTENDED_MATERIALS.length}+</span>
            <span className="text-slate-300">Materials Available</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Materials</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MATERIAL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Cutting Method Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cutting Method</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CUTTING_METHODS.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
            {MATERIAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="mr-1">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredMaterials.length}</span> materials
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Material Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{material.name}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(material.category)}`}>
                      {MATERIAL_CATEGORIES.find(c => c.id === material.category)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setExpandedMaterial(expandedMaterial === material.id ? null : material.id)}
                    className="p-1 text-slate-400 hover:text-blue-600"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-slate-600 mb-4">{material.description}</p>

                {/* Cutting Methods */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {material.cuttingMethods.map(method => (
                    <span key={method} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                      {CUTTING_METHODS.find(m => m.id === method)?.name}
                    </span>
                  ))}
                </div>

                {/* Thicknesses */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Available Thicknesses</p>
                  <div className="flex flex-wrap gap-1">
                    {material.thicknesses.map(t => (
                      <span key={t} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                        {t}mm
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedMaterial === material.id && (
                <div className="px-6 pb-6 pt-0 border-t border-slate-100">
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">Instant online quoting</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">In stock, ready to cut</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">Bulk pricing available</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={onStartQuote}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No materials found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedMethod('all'); }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Suggest Material CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Don't see what you're looking for?</h3>
          <p className="text-blue-100 mb-6">We're always expanding our materials library. Let us know what you need.</p>
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Suggest a Material
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
