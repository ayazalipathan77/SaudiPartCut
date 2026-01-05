export type MaterialType = 'mild_steel' | 'stainless_304' | 'stainless_316' | 'aluminum' | 'brass';

export type ServiceType = 'laser_cut' | 'plasma_cut' | 'water_jet' | 'bending' | 'drilling';

export type FinishingType = 'none' | 'powder_coat' | 'galvanizing' | 'polishing' | 'anodizing';

export interface PartDimensions {
  width: number;
  height: number;
  thickness: number;
  cornerRadius: number;
  holeDiameter: number;
}

export interface MaterialDef {
  id: MaterialType;
  name: string;
  nameAr: string;
  density: number; // g/cm3
  basePricePerKg: number; // SAR
}

export interface ServiceDef {
  id: ServiceType;
  name: string;
  nameAr: string;
  pricePerMeterPath?: number; // Cost based on cutting perimeter
  basePricePerPart?: number; // Fixed setup cost
}

export interface FinishingDef {
  id: FinishingType;
  name: string;
  nameAr: string;
  pricePerSqMeter: number; // Cost based on surface area
}

export interface QuoteBreakdown {
  materialCost: number;
  serviceCost: number;
  finishingCost: number;
  subtotal: number;
  vat: number;
  total: number;
  weightKg: number;
  perimeterMm: number;
  surfaceAreaMm2: number;
}
