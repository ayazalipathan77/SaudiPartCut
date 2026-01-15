import React from 'react';
import { ShapeParameter } from '../services/apiClient';

interface DynamicConfigFormProps {
  parameters: ShapeParameter[];
  values: Record<string, number | string | boolean>;
  onChange: (name: string, value: number | string | boolean) => void;
}

const DynamicConfigForm: React.FC<DynamicConfigFormProps> = ({ parameters, values, onChange }) => {
  const sortedParams = [...parameters].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const renderInput = (param: ShapeParameter) => {
    const value = values[param.parameter_name] ?? param.default_value ?? '';

    switch (param.parameter_type) {
      case 'number':
        return (
          <div key={param.parameter_name} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {param.label}
                {param.is_required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {param.unit && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {param.unit}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(param.parameter_name, parseFloat(e.target.value) || 0)}
                min={param.min_value ?? undefined}
                max={param.max_value ?? undefined}
                step={param.step_value ?? 1}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder={param.placeholder || `Enter ${param.label.toLowerCase()}`}
              />
            </div>
            {param.help_text && (
              <p className="text-xs text-slate-500 mt-2">{param.help_text}</p>
            )}
            {param.min_value !== null && param.max_value !== null && (
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Min: {param.min_value}</span>
                <span>Max: {param.max_value}</span>
              </div>
            )}
          </div>
        );

      case 'range':
        return (
          <div key={param.parameter_name} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {param.label}
                {param.is_required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <span className="text-sm font-bold text-blue-600">
                {value} {param.unit || ''}
              </span>
            </div>
            <input
              type="range"
              value={value}
              onChange={(e) => onChange(param.parameter_name, parseFloat(e.target.value))}
              min={param.min_value ?? 0}
              max={param.max_value ?? 100}
              step={param.step_value ?? 1}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{param.min_value ?? 0}</span>
              <span>{param.max_value ?? 100}</span>
            </div>
            {param.help_text && (
              <p className="text-xs text-slate-500 mt-2">{param.help_text}</p>
            )}
          </div>
        );

      case 'select':
        const options = typeof param.options === 'string'
          ? JSON.parse(param.options || '[]')
          : param.options || [];
        return (
          <div key={param.parameter_name} className="bg-white rounded-lg border border-slate-200 p-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              {param.label}
              {param.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value as string}
              onChange={(e) => onChange(param.parameter_name, e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            >
              <option value="">Select {param.label}</option>
              {options.map((opt: { label: string; value: string }) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {param.help_text && (
              <p className="text-xs text-slate-500 mt-2">{param.help_text}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={param.parameter_name} className="bg-white rounded-lg border border-slate-200 p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-slate-700">{param.label}</span>
                {param.help_text && (
                  <p className="text-xs text-slate-500 mt-1">{param.help_text}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={value === true || value === 'true'}
                  onChange={(e) => onChange(param.parameter_name, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-900">Dimensions & Parameters</h3>
        <span className="text-xs text-slate-500">{parameters.length} parameters</span>
      </div>

      {sortedParams.length === 0 ? (
        <div className="bg-slate-50 rounded-lg p-6 text-center">
          <p className="text-slate-500">No configurable parameters for this shape</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedParams.map(renderInput)}
        </div>
      )}
    </div>
  );
};

export default DynamicConfigForm;
