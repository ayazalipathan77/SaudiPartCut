import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';

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
    try {
      const loggedUser = await api.login(email, password);
      if (loggedUser) {
        setUser(loggedUser);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // For prototype, signup immediately logs you in as a customer
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
