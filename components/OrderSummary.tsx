import React from 'react';
import { QuoteBreakdown } from '../types';

// --- Final Full Screen Review ---
interface OrderSummaryProps {
  quote: QuoteBreakdown;
  onOrder: () => void;
  onBack: () => void;
  onAddToCart?: () => void;
  specSummary: {
      materialName: string;
      serviceName: string;
      finishName: string;
      thickness: number;
  }
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ quote, onOrder, onBack, onAddToCart, specSummary }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Quote Summary</h2>
        <p className="text-slate-400">Review your specifications before checkout</p>
      </div>

      <div className="p-8">
        
        {/* Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-slate-100">
            <div>
                <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Material</span>
                <span className="font-semibold text-slate-800">{specSummary.materialName}</span>
            </div>
            <div>
                <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Thickness</span>
                <span className="font-semibold text-slate-800">{specSummary.thickness} mm</span>
            </div>
            <div>
                <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Service</span>
                <span className="font-semibold text-slate-800">{specSummary.serviceName}</span>
            </div>
             <div>
                <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Finish</span>
                <span className="font-semibold text-slate-800">{specSummary.finishName}</span>
            </div>
        </div>

        {/* Technical Data */}
        <div className="bg-slate-50 rounded-lg p-4 mb-8 grid grid-cols-3 gap-4 text-center">
             <div>
                <span className="block text-xs text-slate-500">Total Weight</span>
                <span className="font-mono font-medium text-slate-900">{quote.weightKg.toFixed(2)} kg</span>
             </div>
             <div>
                <span className="block text-xs text-slate-500">Cut Path</span>
                <span className="font-mono font-medium text-slate-900">{quote.perimeterMm.toFixed(0)} mm</span>
             </div>
             <div>
                <span className="block text-xs text-slate-500">Surface Area</span>
                <span className="font-mono font-medium text-slate-900">{(quote.surfaceAreaMm2 / 100).toFixed(0)} cm²</span>
             </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-3 max-w-sm mx-auto">
            <div className="flex justify-between text-slate-600">
                <span>Material Cost</span>
                <span>{formatCurrency(quote.materialCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
                <span>Service Cost</span>
                <span>{formatCurrency(quote.serviceCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
                <span>Finishing Cost</span>
                <span>{formatCurrency(quote.finishingCost)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm py-2">
                <span>VAT (15%)</span>
                <span>{formatCurrency(quote.vat)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-xl font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-blue-600">{formatCurrency(quote.total)}</span>
            </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col md:flex-row gap-4">
            <button onClick={onBack} className="flex-1 py-3 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-50">
                Edit Configuration
            </button>
            {onAddToCart && (
              <button onClick={onAddToCart} className="flex-1 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
            )}
            <button onClick={onOrder} className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                Secure Checkout <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
        </div>
        
      </div>
    </div>
  );
};

// --- Mini Footer Ticker for Steps 1-4 ---
export const MiniQuoteTicker: React.FC<{
  total: number;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  materialInfo?: string;
}> = ({ total, onNext, onBack, nextLabel = "NEXT", showBack = true, materialInfo }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                {/* Left: Back Button */}
                <div className="flex-shrink-0">
                    {showBack && onBack && (
                        <button
                            onClick={onBack}
                            className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            BACK
                        </button>
                    )}
                </div>

                {/* Center: Material Info & Price Display */}
                <div className="flex items-center gap-6 flex-1 justify-center">
                    {materialInfo && (
                        <>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                <span className="font-medium">{materialInfo}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-300"></div>
                        </>
                    )}
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 font-medium uppercase">Estimated Total</span>
                        <span className="text-2xl font-bold text-slate-900">
                            {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(total)}
                        </span>
                    </div>
                </div>

                {/* Right: Next Button */}
                <div className="flex-shrink-0">
                    <button
                        onClick={onNext}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 uppercase text-sm tracking-wide"
                    >
                        {nextLabel}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary;