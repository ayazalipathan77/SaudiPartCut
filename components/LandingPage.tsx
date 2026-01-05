import React from 'react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onStart: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLoginClick, onSignupClick }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">SaudiPart<span className="text-blue-600">Config</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Capabilities</a>
            <a href="#materials" className="hover:text-blue-600 transition-colors">Materials</a>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                 <div className="flex flex-col text-right">
                    <span className="text-xs text-slate-400 font-normal">Welcome,</span>
                    <span className="text-slate-900 font-bold">{user.name}</span>
                 </div>
                 {user.role === 'admin' ? (
                   <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">ADMIN</span>
                 ) : (
                   <button onClick={logout} className="text-slate-400 hover:text-red-500">Sign Out</button>
                 )}
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                 <button onClick={onLoginClick} className="hover:text-blue-600">Log In</button>
                 <button 
                   onClick={onSignupClick}
                   className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors"
                 >
                   Sign Up
                 </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 z-0">
             {/* Abstract Mechanical Background */}
             <svg className="absolute right-0 top-0 h-full w-1/2 opacity-10 text-white" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L100 0 L100 100 L50 100 L0 50 Z" fill="currentColor"/>
             </svg>
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-8">
                <div className="inline-block bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                    KSA's #1 Manufacturing Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                    Custom Parts, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Manufactured Fast.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                    Upload your CAD or configure online. Get instant quotes, free shipping across Saudi Arabia, and ISO-certified precision.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={onStart}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-900/50 flex items-center justify-center gap-2"
                    >
                        {user ? 'Resume Configuration' : 'Start Your Quote'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>
                    <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700">
                        View Sample Gallery
                    </button>
                </div>
            </div>
            
            {/* Visual Element */}
            <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center perspective-1000">
                 <div className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl rotate-y-12 rotate-x-6 shadow-2xl flex items-center justify-center border-4 border-white/10 backdrop-blur-sm">
                    <div className="text-white text-center p-8">
                        <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        <div className="text-3xl font-bold">InstaQuote™</div>
                        <div className="text-blue-200 mt-2">Real-time pricing engine</div>
                        <div className="mt-8 flex justify-between text-xs font-mono opacity-60">
                            <span>LSR-CUT</span>
                            <span>CNC-PLSM</span>
                            <span>WTR-JET</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">Industrial Manufacturing Services</h2>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">From rapid prototyping to full-scale production runs, we handle it all with precision equipment.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Laser Cutting", desc: "High precision fiber laser cutting for steel, aluminum, and brass up to 20mm.", icon: "⚡" },
                    { title: "Water Jet", desc: "Cold cutting process for thick materials and complex composites without heat distortion.", icon: "💧" },
                    { title: "CNC Bending", desc: "Precision press brakes for accurate folding and forming of sheet metal parts.", icon: "📐" },
                    { title: "Finishing", desc: "Powder coating, anodizing, and galvanizing to protect and beautify your parts.", icon: "✨" },
                    { title: "Drilling & Tapping", desc: "Automated post-processing for countersinks, tapping, and reaming.", icon: "🔩" },
                    { title: "Next Day Shipping", desc: "Fast logistics partner network ensuring delivery across Riyadh, Jeddah, and Dammam.", icon: "🚚" }
                ].map((s, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl border border-slate-100 transition-all group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{s.icon}</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm">
                © 2024 SaudiPartConfig. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <button onClick={onLoginClick} className="hover:text-white text-slate-600 flex items-center gap-1">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   Admin Access
                </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
