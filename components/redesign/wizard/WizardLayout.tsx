import React, { useState } from 'react';
import ProgressStepper, { Step } from '../common/ProgressStepper';
import PreviewSidebar from '../common/PreviewSidebar';
import { PartDimensions } from '../../../types';

interface WizardLayoutProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
  dimensions: PartDimensions;
  materialColor?: string;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  onStepChange,
  children,
  dimensions,
  materialColor,
}) => {
  const steps: Step[] = [
    {
      number: 1,
      label: `${dimensions.width}" x ${dimensions.height}"`,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'upcoming',
    },
    {
      number: 2,
      label: 'Sheet Cutting',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'upcoming',
    },
    {
      number: 3,
      label: 'Select Material',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'upcoming',
    },
    {
      number: 4,
      label: 'Add Services',
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'upcoming',
    },
    {
      number: 5,
      label: 'Add Finishing',
      status: currentStep === 5 ? 'active' : currentStep > 5 ? 'completed' : 'upcoming',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Stepper */}
      <ProgressStepper steps={steps} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Preview */}
        <div className="w-1/3 border-r border-gray-200">
          <PreviewSidebar dimensions={dimensions} materialColor={materialColor} />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              {children}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
              <button
                onClick={() => onStepChange(currentStep - 1)}
                disabled={currentStep === 1}
                className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← BACK
              </button>

              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                CLOSE
              </button>

              <button
                onClick={() => onStepChange(currentStep + 1)}
                disabled={currentStep === 5}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              >
                {currentStep === 5 ? 'ADD TO CART' : 'NEXT →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
