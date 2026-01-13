import React from 'react';

interface ServiceCardProps {
  name: string;
  description?: string;
  price?: number;
  selected?: boolean;
  disabled?: boolean;
  hasInfo?: boolean;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  price,
  selected = false,
  disabled = false,
  hasInfo = true,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left
        ${
          disabled
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
            : selected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-md'
        }
      `}
    >
      <div className="flex-1">
        <h3 className={`text-base font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
        {price !== undefined && (
          <p className="text-sm font-semibold text-gray-900 mt-2">
            + SAR {price.toFixed(2)}
          </p>
        )}
      </div>

      {hasInfo && !disabled && (
        <div className="flex-shrink-0 ml-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
};

export default ServiceCard;
