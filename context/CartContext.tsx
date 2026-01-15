import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MaterialType, ServiceType, FinishingType, QuoteBreakdown } from '../types';
import { Shape } from '../services/apiClient';

export interface CartItem {
  id: string;
  shape: Shape;
  shapeParams: Record<string, number | string | boolean>;
  materialId: MaterialType;
  serviceId: ServiceType;
  finishingId: FinishingType;
  thickness: number;
  quantity: number;
  quote: QuoteBreakdown;
  // Denormalized for display
  materialName: string;
  serviceName: string;
  finishingName: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface BillingInfo {
  useShippingAddress: boolean;
  address?: ShippingAddress;
  poNumber?: string;
  notes?: string;
}

export type ShippingMethod = 'standard' | 'express' | 'pickup';

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  price: number;
  estimatedDays: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Checkout state
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  billingInfo: BillingInfo;
  setBillingInfo: (info: BillingInfo) => void;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;

  // Computed values
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', name: 'Standard Shipping', price: 50, estimatedDays: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 150, estimatedDays: '2-3 business days' },
  { id: 'pickup', name: 'Local Pickup', price: 0, estimatedDays: 'Ready in 24 hours' },
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    useShippingAddress: true,
    poNumber: '',
    notes: '',
  });
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setItems(prev => [...prev, { ...item, id }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Computed values
  const subtotal = items.reduce((sum, item) => sum + (item.quote.total * item.quantity), 0);
  const shippingCost = SHIPPING_OPTIONS.find(opt => opt.id === shippingMethod)?.price || 0;
  const total = subtotal + shippingCost;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      shippingAddress,
      setShippingAddress,
      billingInfo,
      setBillingInfo,
      shippingMethod,
      setShippingMethod,
      subtotal,
      shippingCost,
      total,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export { SHIPPING_OPTIONS };
