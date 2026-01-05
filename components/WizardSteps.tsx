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
}

export const StepMaterial: React.FC<StepMaterialProps> = ({ 
  materials, selectedMaterial, onSelectMaterial, thickness, onSelectThickness, basePrice
}) => {
  
  // Helper to calculate bulk discount for display
  const getBulkPrice = (qty: number) => {
    // Simple mock discount logic: 10% for 10+, 20% for 50+, 30% for 100+
    let multiplier = 1;
    if (qty >= 100) multiplier = 0.7;
    else if (qty >= 50) multiplier = 0.8;
    else if (qty >= 10) multiplier = 0.9;
    
    return (basePrice * multiplier).toFixed(2);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Material List */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. Choose Material Family</h2>
          <div className="space-y-3">
            {materials.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMaterial(m.id)}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMaterial === m.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className={`font-semibold text-sm block ${selectedMaterial === m.id ? 'text-blue-900' : 'text-slate-800'}`}>
                    {m.name}
                  </span>
                  <span className="text-xs text-slate-500">{m.nameAr}</span>
                </div>
                {selectedMaterial === m.id && (
                  <div className="text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Thickness & Pricing Panel (Sidebar Style) */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
         {/* Thickness Selector */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">2. Select Thickness</h3>
            <div className="space-y-2">
              {THICKNESS_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => onSelectThickness(opt.value)}
                  className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all group ${
                    thickness === opt.value
                      ? 'border-blue-500 bg-blue-50 shadow-inner'
                      : 'border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                       thickness === opt.value ? 'border-blue-600' : 'border-slate-300'
                     }`}>
                        {thickness === opt.value && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                     </div>
                     <span className={`text-sm font-medium ${thickness === opt.value ? 'text-slate-900' : 'text-slate-600'}`}>
                        {opt.label}
                     </span>
                  </div>
                  <div className="text-blue-600">
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                  </div>
                </div>
              ))}
            </div>
         </div>

         {/* Real-time Pricing Widget */}
         <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
               <span className="text-xs font-semibold text-slate-500 uppercase">Qty</span>
               <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden h-8">
                  <span className="px-3 text-sm font-bold text-slate-800">1</span>
               </div>
               <span className="text-sm font-bold text-slate-900">{basePrice.toFixed(2)} SAR/ea</span>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                   <span>2+</span>
                   <span className="font-medium">{getBulkPrice(2)}/ea</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                   <span>10+</span>
                   <span className="font-medium">{getBulkPrice(10)}/ea</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                   <span>50+</span>
                   <span className="font-medium text-green-600">{getBulkPrice(50)}/ea</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                   <span>100+</span>
                   <span className="font-medium text-green-700 font-bold">{getBulkPrice(100)}/ea</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                 <span className="text-xs text-slate-400">Arrives by Jan 8</span>
                 <span className="text-lg font-bold text-slate-900">{basePrice.toFixed(2)} SAR</span>
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
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Cutting Service */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Manufacturing Method</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectService(s.id)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedService === s.id
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <h3 className="font-bold text-slate-900">{s.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{s.nameAr}</p>
              {s.basePricePerPart && s.basePricePerPart > 0 && (
                <span className="mt-3 inline-block text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  Setup: {s.basePricePerPart} SAR
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Finishing */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Surface Finishing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {finishes.map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectFinish(f.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedFinish === f.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                selectedFinish === f.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
              }`}>
                {selectedFinish === f.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{f.name}</h3>
                <p className="text-sm text-slate-500">{f.nameAr}</p>
              </div>
              <div className="ml-auto text-xs text-slate-400 font-mono">
                 {f.pricePerSqMeter > 0 ? `${f.pricePerSqMeter} SAR/m²` : 'Free'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};