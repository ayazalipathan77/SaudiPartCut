import React from 'react';

export interface MaterialCardProps {
  name: string;
  description: string;
  imageUrl?: string;
  hasInfo?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  name,
  description,
  imageUrl,
  hasInfo = false,
  onClick,
  selected = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all
        hover:border-gray-400 hover:shadow-md text-left
        ${
          selected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white'
        }
      `}
    >
      {/* Material Image/Thumbnail */}
      {imageUrl ? (
        <div className="w-16 h-16 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-16 h-16 flex-shrink-0 rounded bg-gradient-to-br from-gray-200 to-gray-300" />
      )}

      {/* Material Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>

      {/* Info Icon */}
      {hasInfo && (
        <div className="flex-shrink-0">
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

export default MaterialCard;
