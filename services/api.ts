import { MaterialDef, ServiceDef, FinishingDef } from '../types';
import { MATERIALS, SERVICES, FINISHES, VAT_RATE } from '../constants';
import { User } from '../context/AuthContext';

// Keys for local persistence (simulating DB tables)
const DB_KEYS = {
  MATERIALS: 'db_materials',
  SERVICES: 'db_services',
  FINISHES: 'db_finishes',
  CONFIG: 'db_config',
  USERS: 'db_users'
};

// Initialize "DB" if empty (Simulating seed.sql execution)
const initializeDB = () => {
  if (!localStorage.getItem(DB_KEYS.MATERIALS)) {
    localStorage.setItem(DB_KEYS.MATERIALS, JSON.stringify(MATERIALS));
  }
  if (!localStorage.getItem(DB_KEYS.SERVICES)) {
    localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(SERVICES));
  }
  if (!localStorage.getItem(DB_KEYS.FINISHES)) {
    localStorage.setItem(DB_KEYS.FINISHES, JSON.stringify(FINISHES));
  }
  if (!localStorage.getItem(DB_KEYS.CONFIG)) {
    localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify({ vatRate: VAT_RATE }));
  }
};

initializeDB();

// --- API Methods ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Materials
  getMaterials: async (): Promise<MaterialDef[]> => {
    await delay(300); // Simulate network latency
    const data = localStorage.getItem(DB_KEYS.MATERIALS);
    return data ? JSON.parse(data) : [];
  },

  updateMaterial: async (material: MaterialDef): Promise<void> => {
    await delay(300);
    const materials: MaterialDef[] = JSON.parse(localStorage.getItem(DB_KEYS.MATERIALS) || '[]');
    const index = materials.findIndex(m => m.id === material.id);
    if (index !== -1) {
      materials[index] = material;
      localStorage.setItem(DB_KEYS.MATERIALS, JSON.stringify(materials));
    }
  },

  // Services
  getServices: async (): Promise<ServiceDef[]> => {
    await delay(300);
    const data = localStorage.getItem(DB_KEYS.SERVICES);
    return data ? JSON.parse(data) : [];
  },

  updateService: async (service: ServiceDef): Promise<void> => {
    await delay(300);
    const services: ServiceDef[] = JSON.parse(localStorage.getItem(DB_KEYS.SERVICES) || '[]');
    const index = services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      services[index] = service;
      localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
    }
  },

  // Finishes
  getFinishes: async (): Promise<FinishingDef[]> => {
    await delay(300);
    const data = localStorage.getItem(DB_KEYS.FINISHES);
    return data ? JSON.parse(data) : [];
  },

  // Configuration (VAT)
  getVatRate: async (): Promise<number> => {
    await delay(200);
    const config = JSON.parse(localStorage.getItem(DB_KEYS.CONFIG) || '{}');
    return config.vatRate ?? 0.15;
  },

  updateVatRate: async (rate: number): Promise<void> => {
    await delay(300);
    const config = JSON.parse(localStorage.getItem(DB_KEYS.CONFIG) || '{}');
    config.vatRate = rate;
    localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(config));
  },

  // Auth (Simulating User Table check)
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(500);
    
    // Simulate DB query against the seed data logic
    if (email === 'admin@saudipart.com' && password === 'admin') {
      return { id: 'uuid-admin', name: 'System Admin', email, role: 'admin' };
    }
    
    // Allow any other user for demo purposes, but in real DB we would check 'users' table
    if (email && password) {
      return { id: `uuid-${Date.now()}`, name: email.split('@')[0], email, role: 'customer' };
    }

    return null;
  }
};
