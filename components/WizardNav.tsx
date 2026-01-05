import React from 'react';

interface WizardNavProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const WizardNav: React.FC<WizardNavProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-4 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative flex items-center justify-between">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-100 -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>

          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={index} className="flex flex-col items-center gap-2 bg-white px-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                    ${isActive 
                      ? 'border-blue-600 bg-blue-600 text-white scale-110 shadow-md' 
                      : isCompleted 
                        ? 'border-blue-600 bg-white text-blue-600' 
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={`text-xs font-medium uppercase tracking-wide ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WizardNav;