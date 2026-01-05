import { MaterialDef, ServiceDef, FinishingDef } from './types';

export const VAT_RATE = 0.15; // 15% KSA VAT

export const MATERIALS: MaterialDef[] = [
  { id: 'mild_steel', name: 'Mild Steel (CR4)', nameAr: 'حديد طري', density: 7.85, basePricePerKg: 12.5 },
  { id: 'stainless_304', name: 'Stainless Steel 304', nameAr: 'ستانلس ستيل 304', density: 8.00, basePricePerKg: 45.0 },
  { id: 'stainless_316', name: 'Stainless Steel 316', nameAr: 'ستانلس ستيل 316', density: 8.00, basePricePerKg: 65.0 },
  { id: 'aluminum', name: 'Aluminum 5052', nameAr: 'ألمنيوم', density: 2.70, basePricePerKg: 38.0 },
  { id: 'brass', name: 'Brass C260', nameAr: 'نحاس أصفر', density: 8.53, basePricePerKg: 85.0 },
];

export const SERVICES: ServiceDef[] = [
  { id: 'laser_cut', name: 'Laser Cutting', nameAr: 'قص ليزر', pricePerMeterPath: 15, basePricePerPart: 50 },
  { id: 'plasma_cut', name: 'CNC Plasma Cutting', nameAr: 'قص بلازما', pricePerMeterPath: 10, basePricePerPart: 40 },
  { id: 'water_jet', name: 'Water Jet Cutting', nameAr: 'قص مائي', pricePerMeterPath: 35, basePricePerPart: 80 },
  { id: 'bending', name: 'Bending', nameAr: 'ثني', basePricePerPart: 25 },
  { id: 'drilling', name: 'Drilling', nameAr: 'تخريم', basePricePerPart: 15 },
];

export const FINISHES: FinishingDef[] = [
  { id: 'none', name: 'Raw Finish (Deburred)', nameAr: 'بدون تشطيب', pricePerSqMeter: 0 },
  { id: 'powder_coat', name: 'Powder Coating', nameAr: 'طلاء بودرة', pricePerSqMeter: 120 },
  { id: 'galvanizing', name: 'Galvanizing', nameAr: 'جلفنة', pricePerSqMeter: 85 },
  { id: 'polishing', name: 'Polishing', nameAr: 'تلميع', pricePerSqMeter: 150 },
  { id: 'anodizing', name: 'Anodizing (Alu Only)', nameAr: 'أكسدة (ألمنيوم فقط)', pricePerSqMeter: 200 },
];

export const THICKNESS_OPTIONS = [
  { value: 1, label: '1 mm' },
  { value: 2, label: '2 mm' },
  { value: 3, label: '3 mm' },
  { value: 4, label: '4 mm' },
  { value: 6, label: '6 mm' },
  { value: 8, label: '8 mm' },
  { value: 10, label: '10 mm' },
  { value: 12, label: '12 mm' },
];
