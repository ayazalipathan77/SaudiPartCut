import React, { useState, useMemo, useEffect } from 'react';
import WizardNav from './components/WizardNav';
import { StepTemplate, StepMaterial, StepService } from './components/WizardSteps';
import DesignConfigurator from './components/DesignConfigurator';
import PersistentPreview from './components/PersistentPreview';
import OrderSummary, { MiniQuoteTicker } from './components/OrderSummary';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PartDimensions, MaterialType, ServiceType, FinishingType, MaterialDef, ServiceDef, FinishingDef } from './types';
import { calculateQuote } from './utils/pricing';
import { api } from './services/api';

type AppMode = 'landing' | 'wizard' | 'admin';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState<AppMode>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth Modal State
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // Effect to handle role-based redirection
  useEffect(() => {
    if (user?.role === 'admin') {
      setMode('admin');
    } else if (user && mode === 'admin') {
      setMode('landing');
    }
  }, [user, mode]);

  // Data State (Fetched from API)
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
          api.getVatRate()
        ]);
        setMaterials(mats);
        setServices(servs);
        setFinishes(fins);
        setVatRate(vat);
      } catch (error) {
        console.error("Failed to load application data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // State for Part Configuration
  const [dimensions, setDimensions] = useState<PartDimensions>({
    width: 200,
    height: 150,
    thickness: 4,
    cornerRadius: 15,
    holeDiameter: 10,
  });

  const [materialId, setMaterialId] = useState<MaterialType>('mild_steel');
  const [serviceId, setServiceId] = useState<ServiceType>('laser_cut');
  const [finishingId, setFinishingId] = useState<FinishingType>('none');
  const [quantity, setQuantity] = useState(1);

  const steps = ['Template', 'Design', 'Material', 'Service', 'Review'];
  const totalSteps = steps.length;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(step, totalSteps)));

  // Real-time pricing calculation
  const quote = useMemo(() => {
    if (materials.length === 0) return null;
    return calculateQuote(dimensions, materialId, serviceId, finishingId, materials, services, finishes, vatRate);
  }, [dimensions, materialId, serviceId, finishingId, materials, services, finishes, vatRate]);

  // Helper to get names for summary
  const getSummaryNames = () => {
      return {
          materialName: materials.find(m => m.id === materialId)?.name || '',
          serviceName: services.find(s => s.id === serviceId)?.name || '',
          finishName: finishes.find(f => f.id === finishingId)?.name || '',
          thickness: dimensions.thickness
      }
  }
  
  const getMaterialColor = (id: MaterialType) => {
    switch (id) {
      case 'mild_steel': return '#94a3b8'; 
      case 'stainless_304': return '#e2e8f0'; 
      case 'stainless_316': return '#f1f5f9'; 
      case 'aluminum': return '#cbd5e1'; 
      case 'brass': return '#fcd34d'; 
      default: return '#cbd5e1';
    }
  };

  const handleOrder = () => {
    alert(`Order Confirmed! \nReference: KSA-${Math.floor(Math.random() * 10000)}\nTotal: SAR ${quote?.total.toFixed(2)}`);
  };

  const handleStartQuote = () => {
    if (user) {
      setMode('wizard');
    } else {
      setAuthView('signup');
      setAuthModalOpen(true);
    }
  };

  const openLogin = () => {
    setAuthView('login');
    setAuthModalOpen(true);
  };
  
  const openSignup = () => {
    setAuthView('signup');
    setAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Manufacturing Data...</p>
        </div>
      </div>
    );
  }

  // Admin View - Strictly protected
  if (mode === 'admin') {
     if (user?.role !== 'admin') {
         return <div className="p-10 text-center">Unauthorized Access</div>;
     }
     return (
          <AdminDashboard 
            materials={materials} setMaterials={setMaterials}
            services={services} setServices={setServices}
            finishes={finishes} setFinishes={setFinishes}
            vatRate={vatRate} setVatRate={setVatRate}
            onExit={() => logout()}
          />
      );
  }

  // Landing View
  if (mode === 'landing') {
      return (
        <>
          <LandingPage 
            onStart={handleStartQuote} 
            onLoginClick={openLogin}
            onSignupClick={openSignup}
          />
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
            initialView={authView} 
          />
        </>
      );
  }

  // Wizard Mode
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* App Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMode('landing')}>
                <div className="bg-blue-600 text-white p-1 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">SaudiPart<span className="text-blue-600">Config</span></span>
           </div>
           
           <div className="flex items-center gap-4">
               {user && (
                 <span className="text-sm font-medium text-slate-600 hidden md:block">
                   Draft by {user.name}
                 </span>
               )}
               <button onClick={() => setMode('landing')} className="text-sm font-medium text-slate-400 hover:text-red-500">
                   Exit
               </button>
           </div>
        </div>
      </header>

      {/* Progress Bar */}
      <WizardNav currentStep={currentStep} totalSteps={totalSteps} steps={steps} onStepClick={goToStep} />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 w-full pb-32">
        <div className="w-full">
            {currentStep === 1 && (
                <StepTemplate onSelect={nextStep} />
            )}
            
            {/* Split Grid for Steps 2, 3, 4 */}
            {(currentStep >= 2 && currentStep <= 4) && (
              <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Column: Persistent Preview */}
                  <div className="lg:w-1/3 order-1 lg:order-1">
                      <PersistentPreview 
                        dimensions={dimensions} 
                        materialId={materialId} 
                        previewColor={getMaterialColor(materialId)} 
                      />
                  </div>

                  {/* Right Column: Dynamic Content */}
                  <div className="lg:w-2/3 order-2 lg:order-2">
                     {currentStep === 2 && (
                        <DesignConfigurator 
                            dimensions={dimensions} 
                            setDimensions={setDimensions} 
                        />
                     )}

                     {currentStep === 3 && (
                        <StepMaterial
                            materials={materials}
                            selectedMaterial={materialId}
                            onSelectMaterial={setMaterialId}
                            thickness={dimensions.thickness}
                            onSelectThickness={(t) => setDimensions(prev => ({...prev, thickness: t}))}
                            basePrice={quote ? quote.total : 0}
                            quantity={quantity}
                            onQuantityChange={setQuantity}
                        />
                     )}

                     {currentStep === 4 && (
                        <StepService 
                            services={services}
                            finishes={finishes}
                            selectedService={serviceId}
                            onSelectService={setServiceId}
                            selectedFinish={finishingId}
                            onSelectFinish={setFinishingId}
                        />
                     )}
                  </div>
              </div>
            )}

            {currentStep === 5 && quote && (
                <OrderSummary 
                    quote={quote} 
                    onOrder={handleOrder} 
                    onBack={prevStep}
                    specSummary={getSummaryNames()}
                />
            )}
        </div>
      </main>

      {/* Footer Controls (Steps 1-4) */}
      {currentStep < 5 && quote && (
          <MiniQuoteTicker
            total={quote.total * quantity}
            onNext={nextStep}
            onBack={currentStep > 1 ? prevStep : undefined}
            showBack={currentStep > 1}
            nextLabel={currentStep === 1 ? "START CONFIGURATION" : "NEXT"}
            materialInfo={currentStep >= 3 ? `${quantity} × ${materials.find(m => m.id === materialId)?.name || ''} @ ${dimensions.thickness}mm` : undefined}
          />
      )}
      
      {/* Auth Modal (if triggered during flow) */}
       <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
            initialView={authView} 
       />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
