import React from 'react';
import { MaterialType, ServiceType, FinishingType, MaterialDef, ServiceDef, FinishingDef } from '../types';
import { THICKNESS_OPTIONS } from '../constants';

// --- Step 1: Template Selection ---
interface StepTemplateProps {
  onSelect: () => void;
}

export const StepTemplate: React.FC<StepTemplateProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Start a New Part</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Standard Template Card */}
        <div 
          onClick={onSelect}
          className="group relative bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 p-8 cursor-pointer transition-all hover:shadow-xl flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
               <circle cx="8" cy="8" r="1.5" fill="currentColor" />
               <circle cx="16" cy="8" r="1.5" fill="currentColor" />
               <circle cx="16" cy="16" r="1.5" fill="currentColor" />
               <circle cx="8" cy="16" r="1.5" fill="currentColor" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Standard Template</h3>
          <p className="text-slate-500 text-sm">Rectangular plate with corner mounting holes. Customizable dimensions and radii.</p>
          <div className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Select Template
          </div>
        </div>

        {/* Upload Placeholder */}
        <div className="relative bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center text-center opacity-60 grayscale">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
             <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Upload DXF / DWG</h3>
          <p className="text-slate-500 text-sm">Custom file upload coming soon for complex geometries.</p>
          <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">
            COMING SOON
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Step 3: Material Selection ---
interface StepMaterialProps {
  materials: MaterialDef[];
  selectedMaterial: MaterialType;
  onSelectMaterial: (m: MaterialType) => void;
  thickness: number;
  onSelectThickness: (t: number) => void;
  basePrice: number; // calculated base price of single unit
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const StepMaterial: React.FC<StepMaterialProps> = ({
  materials, selectedMaterial, onSelectMaterial, thickness, onSelectThickness, basePrice, quantity, onQuantityChange
}) => {
  // Helper to calculate bulk discount for display
  const getBulkPrice = (qty: number) => {
    let multiplier = 1;
    if (qty >= 100) multiplier = 0.7;
    else if (qty >= 50) multiplier = 0.8;
    else if (qty >= 10) multiplier = 0.9;
    return (basePrice * multiplier).toFixed(2);
  };

  const handleQuantityChange = (delta: number) => {
    onQuantityChange(Math.max(1, quantity + delta));
  };

  return (
    <div>
      {/* Horizontal Sections Container - Match Preview Height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Section 1: Material Family */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
            Material Family
          </h3>
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-2">
            {materials.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMaterial(m.id)}
                className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer transition-all ${
                  selectedMaterial === m.id
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`font-medium text-xs ${selectedMaterial === m.id ? 'text-blue-900' : 'text-slate-700'}`}>
                  {m.name}
                </span>
                {selectedMaterial === m.id && (
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Thickness */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
            Thickness
          </h3>
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-2">
            {THICKNESS_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                onClick={() => onSelectThickness(opt.value)}
                className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer transition-all ${
                  thickness === opt.value
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    thickness === opt.value ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {thickness === opt.value && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                  </div>
                  <span className={`text-xs font-medium ${thickness === opt.value ? 'text-slate-900' : 'text-slate-600'}`}>
                    {opt.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Quantity & Pricing */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">3</span>
            Quantity
          </h3>

          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
              </svg>
            </button>
            <div className="w-14 h-9 flex items-center justify-center bg-slate-50 rounded-md border border-slate-200">
              <span className="text-base font-bold text-slate-900">{quantity}</span>
            </div>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-9 h-9 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>

          {/* Price per unit */}
          <div className="text-center mb-3 pb-3 border-b border-slate-200">
            <span className="text-xs text-slate-500">Price per unit</span>
            <div className="text-xl font-bold text-slate-900">{basePrice.toFixed(2)} SAR</div>
          </div>

          {/* Bulk Pricing */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Bulk Pricing</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">10+</span>
                <span className="font-medium text-slate-900">{getBulkPrice(10)} SAR</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">50+</span>
                <span className="font-medium text-green-600">{getBulkPrice(50)} SAR</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">100+</span>
                <span className="font-bold text-green-700">{getBulkPrice(100)} SAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Step 4: Service Selection ---
interface StepServiceProps {
  services: ServiceDef[];
  finishes: FinishingDef[];
  selectedService: ServiceType;
  onSelectService: (s: ServiceType) => void;
  selectedFinish: FinishingType;
  onSelectFinish: (f: FinishingType) => void;
}

export const StepService: React.FC<StepServiceProps> = ({
  services, finishes, selectedService, onSelectService, selectedFinish, onSelectFinish
}) => {
  return (
    <div>
      {/* Horizontal Sections Container - Match Preview Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Section 1: Manufacturing Method */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
            Manufacturing Method
          </h3>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            {services.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectService(s.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedService === s.id
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${selectedService === s.id ? 'text-blue-900' : 'text-slate-900'}`}>
                      {s.name}
                    </h4>
                    {s.basePricePerPart && s.basePricePerPart > 0 && (
                      <span className="text-xs text-slate-500 mt-1 block">
                        Setup: {s.basePricePerPart} SAR
                      </span>
                    )}
                  </div>
                  {selectedService === s.id && (
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Surface Finishing */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
            Surface Finishing
          </h3>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            {finishes.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFinish(f.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedFinish === f.id
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  selectedFinish === f.id ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  {selectedFinish === f.id && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${selectedFinish === f.id ? 'text-blue-900' : 'text-slate-900'}`}>
                    {f.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {f.pricePerSqMeter > 0 ? `${f.pricePerSqMeter} SAR/m²` : 'Included'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};