import React, { useState } from 'react';
import { MaterialDef, ServiceDef, FinishingDef } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  materials: MaterialDef[];
  setMaterials: React.Dispatch<React.SetStateAction<MaterialDef[]>>;
  services: ServiceDef[];
  setServices: React.Dispatch<React.SetStateAction<ServiceDef[]>>;
  finishes: FinishingDef[];
  setFinishes: React.Dispatch<React.SetStateAction<FinishingDef[]>>;
  vatRate: number;
  setVatRate: (rate: number) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  materials, setMaterials,
  services, setServices,
  finishes, setFinishes,
  vatRate, setVatRate,
  onExit
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'services' | 'finishes' | 'settings'>('materials');
  const [saving, setSaving] = useState(false);

  // Wrappers to handle API saving
  const handleMaterialUpdate = async (id: string, field: keyof MaterialDef, value: any) => {
    const updatedList = materials.map(m => m.id === id ? { ...m, [field]: value } : m);
    setMaterials(updatedList); // Optimistic update
    
    setSaving(true);
    const item = updatedList.find(m => m.id === id);
    if (item) await api.updateMaterial(item);
    setSaving(false);
  };

  const handleServiceUpdate = async (id: string, field: keyof ServiceDef, value: any) => {
    const updatedList = services.map(s => s.id === id ? { ...s, [field]: value } : s);
    setServices(updatedList);
    
    setSaving(true);
    const item = updatedList.find(s => s.id === id);
    if (item) await api.updateService(item);
    setSaving(false);
  };

  const handleVatUpdate = async (rate: number) => {
    setVatRate(rate);
    setSaving(true);
    await api.updateVatRate(rate);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white px-6 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
            <h1 className="font-bold text-xl flex items-center gap-2">
                <span className="bg-red-600 text-xs px-2 py-1 rounded">ADMIN</span>
                Configuration Dashboard
            </h1>
            {saving && <span className="text-xs text-yellow-400 animate-pulse">Saving changes...</span>}
        </div>
        <button 
          onClick={onExit} 
          className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Log Out
        </button>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6">
        
        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 mb-6 w-fit">
            {['materials', 'services', 'finishes', 'settings'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                        activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Materials Table */}
            {activeTab === 'materials' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Name (EN)</th>
                                <th className="px-6 py-4">Name (AR)</th>
                                <th className="px-6 py-4">Price (SAR/kg)</th>
                                <th className="px-6 py-4">Density</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {materials.map(m => (
                                <tr key={m.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-mono text-slate-400">{m.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                                    <td className="px-6 py-4">{m.nameAr}</td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="number" 
                                            value={m.basePricePerKg}
                                            onChange={(e) => handleMaterialUpdate(m.id, 'basePricePerKg', parseFloat(e.target.value))}
                                            className="w-24 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{m.density}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Services Table */}
            {activeTab === 'services' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Service Name</th>
                                <th className="px-6 py-4">Base Setup Cost (SAR)</th>
                                <th className="px-6 py-4">Path Cost (SAR/m)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {services.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {s.name} <br/> <span className="text-slate-400 font-normal text-xs">{s.nameAr}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="number" 
                                            value={s.basePricePerPart || 0}
                                            onChange={(e) => handleServiceUpdate(s.id, 'basePricePerPart', parseFloat(e.target.value))}
                                            className="w-24 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {s.pricePerMeterPath !== undefined ? (
                                            <input 
                                                type="number" 
                                                value={s.pricePerMeterPath}
                                                onChange={(e) => handleServiceUpdate(s.id, 'pricePerMeterPath', parseFloat(e.target.value))}
                                                className="w-24 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        ) : (
                                            <span className="text-slate-300 italic">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
             {/* Finishes Table (Simple view) */}
             {activeTab === 'finishes' && (
                <div className="p-8 text-center text-slate-500">
                    Finishing configuration available in Pro version.
                </div>
            )}

            {/* General Settings */}
            {activeTab === 'settings' && (
                <div className="p-6">
                    <div className="max-w-2xl">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">General Configuration</h2>
                        
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">VAT Rate (Decimal)</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        value={vatRate}
                                        onChange={(e) => handleVatUpdate(parseFloat(e.target.value))}
                                        className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <div className="text-slate-600 font-medium bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                                        {(vatRate * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Set the Value Added Tax rate applied to all quotes. Standard KSA rate is 0.15 (15%).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
