import React from 'react';

interface BulkPriceTier {
  quantity: number;
  pricePerUnit: number;
}

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  pricePerUnit: number;
  bulkPricing?: BulkPriceTier[];
  currency?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  pricePerUnit,
  bulkPricing = [],
  currency = 'SAR',
}) => {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value > 0) {
      onQuantityChange(value);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Qty</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              min="1"
              className="w-16 text-center text-base font-medium text-gray-900 border-0 focus:ring-0 focus:outline-none"
            />

            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatPrice(pricePerUnit)}
              <span className="text-sm font-normal text-gray-500"> /ea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Pricing Tiers */}
      {bulkPricing.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="text-xs font-medium text-gray-500 mb-2">Bulk Pricing:</div>
          <div className="space-y-1">
            {bulkPricing.map((tier) => (
              <div key={tier.quantity} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {tier.quantity}+ units
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(tier.pricePerUnit)}/ea
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;
