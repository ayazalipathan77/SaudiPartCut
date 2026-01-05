import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const { login, signup, continueAsGuest } = useAuth();
  
  const [email, setEmail] = useState('admin@saudipart.com');
  const [password, setPassword] = useState('admin');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (view === 'login') {
        success = await login(email, password);
      } else {
        success = await signup(name, email, password);
      }

      if (success) {
        onClose();
      } else {
        setError('Invalid credentials. Default: admin@saudipart.com / admin');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h2 className="text-2xl font-bold text-slate-900">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {view === 'login' ? 'Access your saved quotes and orders' : 'Join KSAPartCut for free'}
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ali Al-Saud"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              {view === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {view === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or</span></div>
          </div>

          <button 
            onClick={handleGuest}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg transition-colors border border-slate-200"
          >
            Continue as Guest
          </button>

          {/* Helper for demo */}
          {view === 'login' && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
               <strong>Demo Access:</strong><br/>
               Admin: admin@saudipart.com / admin<br/>
               User: Any email / Any password
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
