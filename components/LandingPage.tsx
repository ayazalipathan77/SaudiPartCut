import React from 'react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onStart: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onAdminClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLoginClick, onSignupClick, onAdminClick }) => {
  const { user } = useAuth();

  return (
    <div className="bg-slate-50 flex flex-col font-sans">
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

      {/* Materials Showcase */}
      <section id="materials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">50+ Materials In Stock</h2>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">From aerospace-grade aluminum to industrial steel, we stock materials for every application.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                    { name: "Mild Steel", color: "bg-slate-400" },
                    { name: "Stainless 304", color: "bg-slate-300" },
                    { name: "Aluminum 6061", color: "bg-gray-200" },
                    { name: "Brass", color: "bg-yellow-400" },
                    { name: "Copper", color: "bg-orange-400" },
                    { name: "Carbon Fiber", color: "bg-slate-800" },
                    { name: "Acrylic", color: "bg-blue-200" },
                    { name: "Polycarbonate", color: "bg-transparent border-2 border-slate-300" },
                    { name: "G-10", color: "bg-green-300" },
                    { name: "Titanium", color: "bg-slate-500" },
                    { name: "Bronze", color: "bg-amber-600" },
                    { name: "Delrin", color: "bg-white border-2 border-slate-200" },
                ].map((mat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow border border-slate-100">
                        <div className={`w-12 h-12 ${mat.color} rounded-lg mx-auto mb-3`}></div>
                        <span className="text-sm font-medium text-slate-700">{mat.name}</span>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto">
                    View All Materials
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Get your custom parts in 4 simple steps</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { step: 1, title: "Design", desc: "Upload your CAD file or use our shape configurator", icon: "📐" },
                    { step: 2, title: "Configure", desc: "Choose material, thickness, and finishing options", icon: "⚙️" },
                    { step: 3, title: "Quote", desc: "Get instant pricing with bulk discounts", icon: "💰" },
                    { step: 4, title: "Deliver", desc: "Receive precision parts at your door", icon: "📦" },
                ].map((item, i) => (
                    <div key={i} className="text-center relative">
                        {i < 3 && (
                            <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-slate-200"></div>
                        )}
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 relative z-10">
                            {item.icon}
                        </div>
                        <div className="text-sm font-bold text-blue-600 mb-2">Step {item.step}</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                    { value: "50+", label: "Materials" },
                    { value: "10K+", label: "Parts Manufactured" },
                    { value: "500+", label: "Happy Customers" },
                    { value: "99.5%", label: "On-Time Delivery" },
                ].map((stat, i) => (
                    <div key={i}>
                        <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.value}</div>
                        <div className="text-slate-400">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
                Join hundreds of businesses across Saudi Arabia who trust KSAPartCut for their manufacturing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onStart}
                    className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                >
                    Get Instant Quote
                </button>
                <button className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors border border-blue-400">
                    Contact Sales
                </button>
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
                <button onClick={onAdminClick || onLoginClick} className="hover:text-white text-slate-600 flex items-center gap-1">
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
