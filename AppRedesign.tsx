import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import WizardLayout from './components/redesign/wizard/WizardLayout';
import StepMaterialSelection from './components/redesign/wizard/StepMaterialSelection';
import QuantitySelector from './components/redesign/common/QuantitySelector';
import ServiceCard from './components/redesign/common/ServiceCard';
import { PartDimensions, MaterialDef, ServiceDef, FinishingDef } from './types';
import { api } from './services/api';
import { calculateQuote } from './utils/pricing';

const AppRedesignContent: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(3); // Start at material selection for demo
  const [isLoading, setIsLoading] = useState(true);

  // Configuration State
  const [dimensions, setDimensions] = useState<PartDimensions>({
    width: 200,
    height: 150,
    thickness: 4,
    cornerRadius: 15,
    holeDiameter: 10,
  });

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDef | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFinish, setSelectedFinish] = useState<string>('none');
  const [quantity, setQuantity] = useState(1);

  // Data State
  const [materials, setMaterials] = useState<MaterialDef[]>([]);
  const [services, setServices] = useState<ServiceDef[]>([]);
  const [finishes, setFinishes] = useState<FinishingDef[]>([]);
  const [vatRate, setVatRate] = useState<number>(0.15);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mats, servs, fins, vat] = await Promise.all([
          api.getMaterials(),
          api.getServices(),
          api.getFinishes(),
          api.getVatRate(),
        ]);
        setMaterials(mats);
        setServices(servs);
        setFinishes(fins);
        setVatRate(vat);

        // Set default material
        if (mats.length > 0) {
          setSelectedMaterial(mats[0]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStepChange = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  const handleMaterialSelect = (material: MaterialDef) => {
    setSelectedMaterial(material);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Calculate current price
  const currentQuote = selectedMaterial && services.length > 0 && finishes.length > 0
    ? calculateQuote(
        dimensions,
        selectedMaterial.id,
        'laser_cut',
        selectedFinish,
        materials,
        services,
        finishes,
        vatRate
      )
    : null;

  const bulkPricing = currentQuote
    ? [
        { quantity: 2, pricePerUnit: currentQuote.total * 0.95 },
        { quantity: 10, pricePerUnit: currentQuote.total * 0.9 },
        { quantity: 50, pricePerUnit: currentQuote.total * 0.85 },
        { quantity: 100, pricePerUnit: currentQuote.total * 0.8 },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KSAPartCut...</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Step 1: Size Selection</h2>
            <p className="text-gray-600">Configure your part dimensions</p>
            {/* Add dimension configurator here */}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Step 2: Sheet Cutting</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Design</h3>
              <p className="text-gray-600 mb-4">Drag and drop DXF, DWG, or SVG files</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Browse Files
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <StepMaterialSelection
              materials={materials}
              onMaterialSelect={handleMaterialSelect}
            />

            {selectedMaterial && currentQuote && (
              <div className="border-t border-gray-200 pt-6">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  pricePerUnit={currentQuote.total}
                  bulkPricing={bulkPricing}
                  currency="SAR"
                />

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      SAR {currentQuote.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">VAT ({(vatRate * 100).toFixed(0)}%)</span>
                    <span className="font-semibold text-gray-900">
                      SAR {currentQuote.vat.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-red-600">
                      SAR {currentQuote.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Arrives as soon as: <span className="font-medium">Jan 10</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Services</h2>
              <p className="text-gray-600 text-sm">
                Choose below or click a feature on your drawing to add services
              </p>
            </div>

            <div className="space-y-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  description={service.nameAr}
                  price={service.basePricePerPart}
                  selected={selectedServices.includes(service.id)}
                  onClick={() => toggleService(service.id)}
                />
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Finishing</h2>
              <p className="text-gray-600 text-sm">
                Select a surface finish option
              </p>
            </div>

            <div className="space-y-3">
              {finishes.map((finish) => (
                <ServiceCard
                  key={finish.id}
                  name={finish.name}
                  description={finish.nameAr}
                  price={finish.pricePerSqMeter}
                  selected={selectedFinish === finish.id}
                  onClick={() => setSelectedFinish(finish.id)}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const materialColor = selectedMaterial
    ? selectedMaterial.id === 'brass'
      ? '#FBBF24'
      : selectedMaterial.id === 'aluminum'
      ? '#E5E7EB'
      : selectedMaterial.id.includes('stainless')
      ? '#D1D5DB'
      : '#9CA3AF'
    : '#9CA3AF';

  return (
    <WizardLayout
      currentStep={currentStep}
      onStepChange={handleStepChange}
      dimensions={dimensions}
      materialColor={materialColor}
    >
      {renderStepContent()}
    </WizardLayout>
  );
};

const AppRedesign: React.FC = () => {
  return (
    <AuthProvider>
      <AppRedesignContent />
    </AuthProvider>
  );
};

export default AppRedesign;
