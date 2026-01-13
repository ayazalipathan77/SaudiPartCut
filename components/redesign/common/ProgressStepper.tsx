import React from 'react';

export interface Step {
  number: number;
  label: string;
  status: 'completed' | 'active' | 'upcoming';
}

interface ProgressStepperProps {
  steps: Step[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                    transition-all duration-200
                    ${
                      step.status === 'completed'
                        ? 'bg-gray-400 text-white'
                        : step.status === 'active'
                        ? 'bg-red-600 text-white ring-4 ring-red-100'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {step.status === 'completed' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium whitespace-nowrap
                    ${
                      step.status === 'active'
                        ? 'text-gray-900'
                        : step.status === 'completed'
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 relative">
                  <div className="absolute inset-0 bg-gray-200" />
                  <div
                    className={`absolute inset-0 bg-red-600 transition-all duration-300 ${
                      step.status === 'completed' ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;
