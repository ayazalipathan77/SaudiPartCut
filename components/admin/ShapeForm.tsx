import React, { useState, useEffect } from 'react';
import { apiClient, Shape, ShapeParameter, Material, ThicknessOption, Service, FinishingOption } from '../../services/apiClient';

// Predefined shape templates based on SendCutSend shapes
const SHAPE_TEMPLATES = [
  {
    name: 'Rectangle',
    slug: 'rectangle',
    category: 'Rectangles',
    description: 'Basic rectangular plate with optional corner radius',
    parameters: [
      { parameter_name: 'width', parameter_type: 'number', label: 'Width', default_value: '200', min_value: 10, max_value: 2000, unit: 'mm', is_required: true, display_order: 1 },
      { parameter_name: 'height', parameter_type: 'number', label: 'Height', default_value: '150', min_value: 10, max_value: 2000, unit: 'mm', is_required: true, display_order: 2 },
      { parameter_name: 'cornerRadius', parameter_type: 'number', label: 'Corner Radius', default_value: '0', min_value: 0, max_value: 100, unit: 'mm', is_required: false, display_order: 3 },
    ],
    svg_path_generator: `function(params) {
  const w = params.width, h = params.height, r = Math.min(params.cornerRadius || 0, w/2, h/2);
  if (r === 0) return \`M 0,0 H \${w} V \${h} H 0 Z\`;
  return \`M \${r},0 H \${w-r} A \${r},\${r} 0 0 1 \${w},\${r} V \${h-r} A \${r},\${r} 0 0 1 \${w-r},\${h} H \${r} A \${r},\${r} 0 0 1 0,\${h-r} V \${r} A \${r},\${r} 0 0 1 \${r},0 Z\`;
}`,
  },
  {
    name: 'Rectangle with Holes',
    slug: 'rectangle-with-holes',
    category: 'Rectangles',
    description: 'Rectangular plate with corner mounting holes',
    parameters: [
      { parameter_name: 'width', parameter_type: 'number', label: 'Width', default_value: '200', min_value: 50, max_value: 2000, unit: 'mm', is_required: true, display_order: 1 },
      { parameter_name: 'height', parameter_type: 'number', label: 'Height', default_value: '150', min_value: 50, max_value: 2000, unit: 'mm', is_required: true, display_order: 2 },
      { parameter_name: 'cornerRadius', parameter_type: 'number', label: 'Corner Radius', default_value: '15', min_value: 0, max_value: 100, unit: 'mm', is_required: false, display_order: 3 },
      { parameter_name: 'holeDiameter', parameter_type: 'number', label: 'Hole Diameter', default_value: '10', min_value: 2, max_value: 50, unit: 'mm', is_required: true, display_order: 4 },
      { parameter_name: 'holeInset', parameter_type: 'number', label: 'Hole Inset', default_value: '20', min_value: 5, max_value: 100, unit: 'mm', is_required: true, display_order: 5 },
    ],
  },
  {
    name: 'Circle',
    slug: 'circle',
    category: 'Circles',
    description: 'Circular disc plate',
    parameters: [
      { parameter_name: 'diameter', parameter_type: 'number', label: 'Diameter', default_value: '100', min_value: 10, max_value: 1000, unit: 'mm', is_required: true, display_order: 1 },
    ],
  },
  {
    name: 'Ring (Annulus)',
    slug: 'ring',
    category: 'Circles',
    description: 'Ring shape with inner and outer diameter',
    parameters: [
      { parameter_name: 'outerDiameter', parameter_type: 'number', label: 'Outer Diameter', default_value: '100', min_value: 20, max_value: 1000, unit: 'mm', is_required: true, display_order: 1 },
      { parameter_name: 'innerDiameter', parameter_type: 'number', label: 'Inner Diameter', default_value: '50', min_value: 5, max_value: 990, unit: 'mm', is_required: true, display_order: 2 },
    ],
  },
  {
    name: 'L-Bracket',
    slug: 'l-bracket',
    category: 'Complex',
    description: 'L-shaped bracket with configurable arms',
    parameters: [
      { parameter_name: 'armLength1', parameter_type: 'number', label: 'Arm 1 Length', default_value: '100', min_value: 20, max_value: 500, unit: 'mm', is_required: true, display_order: 1 },
      { parameter_name: 'armLength2', parameter_type: 'number', label: 'Arm 2 Length', default_value: '80', min_value: 20, max_value: 500, unit: 'mm', is_required: true, display_order: 2 },
      { parameter_name: 'armWidth', parameter_type: 'number', label: 'Arm Width', default_value: '30', min_value: 10, max_value: 100, unit: 'mm', is_required: true, display_order: 3 },
    ],
  },
  {
    name: 'U-Channel',
    slug: 'u-channel',
    category: 'Complex',
    description: 'U-shaped channel bracket',
    parameters: [
      { parameter_name: 'width', parameter_type: 'number', label: 'Total Width', default_value: '100', min_value: 30, max_value: 500, unit: 'mm', is_required: true, display_order: 1 },
      { parameter_name: 'height', parameter_type: 'number', label: 'Side Height', default_value: '50', min_value: 15, max_value: 300, unit: 'mm', is_required: true, display_order: 2 },
      { parameter_name: 'flange', parameter_type: 'number', label: 'Flange Width', default_value: '20', min_value: 5, max_value: 100, unit: 'mm', is_required: true, display_order: 3 },
    ],
  },
  {
    name: 'Triangle',
    slug: 'triangle',
    category: 'Complex',
    description: 'Equilateral or isoceles triangle',
    parameters: [
      { parameter_name: 'base', parameter_type: 'number', label: 'Base', default_value: '100', min_value: 20, max_value: 500, unit: 'mm', is_required: true, display_order: 1 },
      { parameter_name: 'height', parameter_type: 'number', label: 'Height', default_value: '86', min_value: 20, max_value: 500, unit: 'mm', is_required: true, display_order: 2 },
    ],
  },
  {
    name: 'Hexagon',
    slug: 'hexagon',
    category: 'Complex',
    description: 'Regular hexagonal shape',
    parameters: [
      { parameter_name: 'size', parameter_type: 'number', label: 'Size (flat-to-flat)', default_value: '100', min_value: 20, max_value: 500, unit: 'mm', is_required: true, display_order: 1 },
    ],
  },
];

interface ShapeFormProps {
  shape?: Shape | null;
  onSave: () => void;
  onCancel: () => void;
}

const ShapeForm: React.FC<ShapeFormProps> = ({ shape, onSave, onCancel }) => {
  const isEditing = !!shape;

  // Form state
  const [name, setName] = useState(shape?.name || '');
  const [slug, setSlug] = useState(shape?.slug || '');
  const [description, setDescription] = useState(shape?.description || '');
  const [category, setCategory] = useState(shape?.category || 'Rectangles');
  const [svgGenerator, setSvgGenerator] = useState(shape?.svg_path_generator || '');
  const [threejsGenerator, setThreejsGenerator] = useState(shape?.threejs_shape_generator || '');
  const [costFormula, setCostFormula] = useState(shape?.cost_formula || 'area * material_cost + perimeter * 0.1');
  const [parameters, setParameters] = useState<ShapeParameter[]>(shape?.parameters || []);

  // Mapping selections
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);
  const [selectedThickness, setSelectedThickness] = useState<number[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedFinishing, setSelectedFinishing] = useState<number[]>([]);

  // Options data
  const [materials, setMaterials] = useState<Material[]>([]);
  const [thicknessOptions, setThicknessOptions] = useState<ThicknessOption[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [finishingOptions, setFinishingOptions] = useState<FinishingOption[]>([]);

  // UI state
  const [activeSection, setActiveSection] = useState<'basic' | 'parameters' | 'mappings' | 'advanced'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTemplates, setShowTemplates] = useState(!isEditing);

  // Fetch options data
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await apiClient.options.getAll();
        setMaterials(data.materials);
        setThicknessOptions(data.thickness_options);
        setServices(data.services);
        setFinishingOptions(data.finishing_options);

        // If editing, set the selected mappings
        if (shape) {
          setSelectedMaterials(shape.materials?.map(m => m.material_id) || []);
          setSelectedThickness(shape.thickness_options?.map(t => t.thickness_id) || []);
          setSelectedServices(shape.services?.map(s => s.service_id) || []);
          setSelectedFinishing(shape.finishing_options?.map(f => f.finishing_id) || []);
        } else {
          // Default selections for new shapes
          setSelectedMaterials(data.materials.slice(0, 3).map(m => m.id));
          setSelectedThickness(data.thickness_options.map(t => t.id));
          setSelectedServices(data.services.slice(0, 2).map(s => s.id));
          setSelectedFinishing(data.finishing_options.slice(0, 2).map(f => f.id));
        }
      } catch (err) {
        console.error('Failed to load options', err);
      }
    };
    fetchOptions();
  }, [shape]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [name, isEditing]);

  const handleTemplateSelect = (template: typeof SHAPE_TEMPLATES[0]) => {
    setName(template.name);
    setSlug(template.slug);
    setDescription(template.description);
    setCategory(template.category);
    setParameters(template.parameters as ShapeParameter[]);
    if (template.svg_path_generator) {
      setSvgGenerator(template.svg_path_generator);
    }
    setShowTemplates(false);
    setActiveSection('parameters');
  };

  const handleAddParameter = () => {
    setParameters([
      ...parameters,
      {
        parameter_name: '',
        parameter_type: 'number',
        label: '',
        default_value: '0',
        min_value: 0,
        max_value: 1000,
        step_value: 1,
        unit: 'mm',
        is_required: true,
        display_order: parameters.length,
      },
    ]);
  };

  const handleUpdateParameter = (index: number, field: keyof ShapeParameter, value: any) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], [field]: value };
    setParameters(updated);
  };

  const handleRemoveParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = {
        name,
        slug,
        description,
        category,
        svg_path_generator: svgGenerator,
        threejs_shape_generator: threejsGenerator,
        cost_formula: costFormula,
        is_active: shape?.is_active || false,
        display_order: shape?.display_order || 0,
        parameters,
        materials: selectedMaterials,
        thickness_options: selectedThickness,
        services: selectedServices,
        finishing_options: selectedFinishing,
      };

      if (isEditing) {
        await apiClient.shapes.update(shape!.id, data);
      } else {
        await apiClient.shapes.create(data);
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save shape');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id: number, selected: number[], setSelected: React.Dispatch<React.SetStateAction<number[]>>) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Template selection screen
  if (showTemplates && !isEditing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Choose a Starting Template</h2>
          <button
            onClick={() => setShowTemplates(false)}
            className="text-sm text-blue-600 hover:underline"
          >
            Start from scratch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHAPE_TEMPLATES.map((template) => (
            <button
              key={template.slug}
              onClick={() => handleTemplateSelect(template)}
              className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="h-24 bg-slate-50 rounded-lg mb-3 flex items-center justify-center">
                <div className="w-12 h-12 bg-slate-200 rounded group-hover:bg-blue-100 transition-colors"></div>
              </div>
              <h3 className="font-medium text-slate-900 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{template.description}</p>
              <div className="flex gap-2">
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{template.category}</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{template.parameters.length} params</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {isEditing ? `Edit: ${shape?.name}` : 'Create New Shape'}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Shape' : 'Create Shape'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit">
        {(['basic', 'parameters', 'mappings', 'advanced'] as const).map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeSection === section ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Basic Info Section */}
      {activeSection === 'basic' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Shape Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., Rectangle with Holes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                placeholder="rectangle-with-holes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Rectangles">Rectangles</option>
                <option value="Circles">Circles</option>
                <option value="Complex">Complex</option>
                <option value="Imported">Imported</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Describe this shape template..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Parameters Section */}
      {activeSection === 'parameters' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">Shape Parameters</h3>
            <button
              type="button"
              onClick={handleAddParameter}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Parameter
            </button>
          </div>

          {parameters.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No parameters defined. Click "Add Parameter" to start.
            </div>
          ) : (
            <div className="space-y-4">
              {parameters.map((param, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500">Parameter {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParameter(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Name (code)</label>
                      <input
                        type="text"
                        value={param.parameter_name}
                        onChange={(e) => handleUpdateParameter(index, 'parameter_name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                        placeholder="width"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Label</label>
                      <input
                        type="text"
                        value={param.label}
                        onChange={(e) => handleUpdateParameter(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Type</label>
                      <select
                        value={param.parameter_type}
                        onChange={(e) => handleUpdateParameter(index, 'parameter_type', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                      >
                        <option value="number">Number</option>
                        <option value="range">Range</option>
                        <option value="select">Select</option>
                        <option value="boolean">Boolean</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Unit</label>
                      <input
                        type="text"
                        value={param.unit || ''}
                        onChange={(e) => handleUpdateParameter(index, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                        placeholder="mm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Default</label>
                      <input
                        type="text"
                        value={param.default_value || ''}
                        onChange={(e) => handleUpdateParameter(index, 'default_value', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Min</label>
                      <input
                        type="number"
                        value={param.min_value ?? ''}
                        onChange={(e) => handleUpdateParameter(index, 'min_value', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Max</label>
                      <input
                        type="number"
                        value={param.max_value ?? ''}
                        onChange={(e) => handleUpdateParameter(index, 'max_value', parseFloat(e.target.value) || 1000)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={param.is_required !== false}
                          onChange={(e) => handleUpdateParameter(index, 'is_required', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-slate-600">Required</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mappings Section */}
      {activeSection === 'mappings' && (
        <div className="space-y-6">
          {/* Materials */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">Available Materials</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {materials.map((material) => (
                <label
                  key={material.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedMaterials.includes(material.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material.id)}
                    onChange={() => toggleSelection(material.id, selectedMaterials, setSelectedMaterials)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div
                    className="w-6 h-6 rounded border border-slate-300"
                    style={{ backgroundColor: material.color_hex || '#ccc' }}
                  ></div>
                  <span className="text-sm text-slate-700">{material.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Thickness Options */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">Available Thickness Options</h3>
            <div className="flex flex-wrap gap-2">
              {thicknessOptions.map((thickness) => (
                <label
                  key={thickness.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedThickness.includes(thickness.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedThickness.includes(thickness.id)}
                    onChange={() => toggleSelection(thickness.id, selectedThickness, setSelectedThickness)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-slate-700">{thickness.thickness_value} {thickness.unit}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">Available Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedServices.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleSelection(service.id, selectedServices, setSelectedServices)}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{service.service_name}</div>
                    {service.description && (
                      <div className="text-xs text-slate-500">{service.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Finishing Options */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">Available Finishing Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {finishingOptions.map((finish) => (
                <label
                  key={finish.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedFinishing.includes(finish.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFinishing.includes(finish.id)}
                    onChange={() => toggleSelection(finish.id, selectedFinishing, setSelectedFinishing)}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{finish.finish_name}</div>
                    {finish.description && (
                      <div className="text-xs text-slate-500">{finish.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Section */}
      {activeSection === 'advanced' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">SVG Path Generator (DSL)</h3>
            <p className="text-sm text-slate-500 mb-3">
              Define a JavaScript function that generates the SVG path based on parameters.
              The function receives a <code className="bg-slate-100 px-1 rounded">params</code> object.
            </p>
            <textarea
              value={svgGenerator}
              onChange={(e) => setSvgGenerator(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder={`function(params) {
  const w = params.width, h = params.height;
  return \`M 0,0 H \${w} V \${h} H 0 Z\`;
}`}
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-medium text-slate-900 mb-4">Cost Formula (DSL)</h3>
            <p className="text-sm text-slate-500 mb-3">
              Define how the price is calculated. Available variables: <code className="bg-slate-100 px-1 rounded">area</code>,
              <code className="bg-slate-100 px-1 rounded">perimeter</code>, <code className="bg-slate-100 px-1 rounded">material_cost</code>,
              <code className="bg-slate-100 px-1 rounded">thickness</code>, <code className="bg-slate-100 px-1 rounded">hole_count</code>.
            </p>
            <input
              type="text"
              value={costFormula}
              onChange={(e) => setCostFormula(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="area * material_cost + perimeter * 0.1"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default ShapeForm;
