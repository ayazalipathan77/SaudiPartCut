import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'admin' | 'customer' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Hardcoded Admin Credentials
    if (email === 'admin@saudipart.com' && password === 'admin') {
      setUser({ id: '1', name: 'System Admin', email, role: 'admin' });
      return true;
    }
    
    // Regular User Login (Simulated)
    if (email && password) {
      setUser({ id: '2', name: email.split('@')[0], email, role: 'customer' });
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({ id: Math.random().toString(), name, email, role: 'customer' });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const continueAsGuest = () => {
    setUser({ id: 'guest', name: 'Guest User', email: '', role: 'guest' });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login, 
      signup, 
      logout,
      continueAsGuest 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
