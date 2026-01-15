// API Client for KSAPartCut Backend

const API_BASE = '/api';

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// API Request Helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Types
export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'user';
}

export interface ShapeParameter {
  id?: number;
  parameter_name: string;
  parameter_type: 'number' | 'range' | 'select' | 'boolean';
  label: string;
  default_value?: string;
  min_value?: number;
  max_value?: number;
  step_value?: number;
  unit?: string;
  options?: { label: string; value: string }[];
  help_text?: string;
  placeholder?: string;
  display_order?: number;
  is_required?: boolean;
  validation_formula?: string;
  depends_on?: string;
}

export interface Shape {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  svg_path_generator?: string;
  threejs_shape_generator?: string;
  preview_image_url?: string;
  cost_formula?: string;
  is_active: boolean;
  display_order: number;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  parameter_count?: number;
  parameters?: ShapeParameter[];
  materials?: any[];
  thickness_options?: any[];
  services?: any[];
  finishing_options?: any[];
}

export interface Material {
  id: number;
  name: string;
  material_type: string;
  density?: number;
  color_hex?: string;
  roughness?: number;
  metalness?: number;
  cost_per_kg?: number;
  cost_per_sqm?: number;
  is_active: boolean;
  display_order: number;
  description?: string;
}

export interface ThicknessOption {
  id: number;
  thickness_value: number;
  unit: string;
  cost_multiplier: number;
  is_active: boolean;
}

export interface Service {
  id: number;
  service_name: string;
  service_type: string;
  description?: string;
  base_cost: number;
  cost_formula?: string;
  is_active: boolean;
}

export interface FinishingOption {
  id: number;
  finish_name: string;
  finish_type: string;
  description?: string;
  cost_multiplier: number;
  cost_per_sqm?: number;
  is_active: boolean;
}

// API Client
export const apiClient = {
  // Auth
  auth: {
    login: async (email: string, password: string): Promise<{ user: AdminUser; token: string }> => {
      const response = await apiRequest<{ success: boolean; user: AdminUser; token: string }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );
      if (response.token) {
        setToken(response.token);
      }
      return response;
    },

    verify: async (): Promise<AdminUser | null> => {
      try {
        const response = await apiRequest<{ success: boolean; user: AdminUser }>('/auth/verify', {
          method: 'POST',
        });
        return response.user;
      } catch {
        removeToken();
        return null;
      }
    },

    logout: (): void => {
      removeToken();
    },

    isAuthenticated: (): boolean => {
      return !!getToken();
    },
  },

  // Shapes
  shapes: {
    getAll: async (): Promise<Shape[]> => {
      const response = await apiRequest<{ success: boolean; shapes: Shape[] }>('/shapes');
      return response.shapes;
    },

    getById: async (id: number): Promise<Shape> => {
      const response = await apiRequest<{ success: boolean; shape: Shape }>(`/shapes/${id}`);
      return response.shape;
    },

    create: async (shape: Partial<Shape> & {
      parameters?: ShapeParameter[];
      materials?: number[];
      thickness_options?: number[];
      services?: number[];
      finishing_options?: number[];
    }): Promise<Shape> => {
      const response = await apiRequest<{ success: boolean; shape: Shape }>('/shapes', {
        method: 'POST',
        body: JSON.stringify(shape),
      });
      return response.shape;
    },

    update: async (id: number, shape: Partial<Shape> & {
      parameters?: ShapeParameter[];
      materials?: number[];
      thickness_options?: number[];
      services?: number[];
      finishing_options?: number[];
    }): Promise<Shape> => {
      const response = await apiRequest<{ success: boolean; shape: Shape }>(`/shapes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(shape),
      });
      return response.shape;
    },

    activate: async (id: number, isActive: boolean): Promise<Shape> => {
      const response = await apiRequest<{ success: boolean; shape: Shape }>(`/shapes/${id}/activate`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: isActive }),
      });
      return response.shape;
    },

    delete: async (id: number): Promise<void> => {
      await apiRequest(`/shapes/${id}`, { method: 'DELETE' });
    },
  },

  // Materials
  materials: {
    getAll: async (): Promise<Material[]> => {
      const response = await apiRequest<{ success: boolean; materials: Material[] }>('/materials');
      return response.materials;
    },
  },

  // Options
  options: {
    getAll: async (): Promise<{
      materials: Material[];
      thickness_options: ThicknessOption[];
      services: Service[];
      finishing_options: FinishingOption[];
    }> => {
      const response = await apiRequest<{
        success: boolean;
        materials: Material[];
        thickness_options: ThicknessOption[];
        services: Service[];
        finishing_options: FinishingOption[];
      }>('/options/all');
      return {
        materials: response.materials,
        thickness_options: response.thickness_options,
        services: response.services,
        finishing_options: response.finishing_options,
      };
    },
  },
};

export default apiClient;
