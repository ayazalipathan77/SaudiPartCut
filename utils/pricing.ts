import { PartDimensions, MaterialType, ServiceType, FinishingType, QuoteBreakdown, MaterialDef, ServiceDef, FinishingDef } from '../types';

export const calculateQuote = (
  dimensions: PartDimensions,
  materialId: MaterialType,
  serviceId: ServiceType,
  finishingId: FinishingType,
  // Inject definitions to support Admin updates
  materials: MaterialDef[],
  services: ServiceDef[],
  finishes: FinishingDef[],
  vatRate: number
): QuoteBreakdown => {
  const material = materials.find(m => m.id === materialId) || materials[0];
  const service = services.find(s => s.id === serviceId) || services[0];
  const finishing = finishes.find(f => f.id === finishingId) || finishes[0];

  // 1. Calculate Geometry
  const widthM = dimensions.width / 1000;
  const heightM = dimensions.height / 1000;
  const thicknessM = dimensions.thickness / 1000;

  // Volume
  const baseAreaMm2 = dimensions.width * dimensions.height;
  const cornerCutoutAreaMm2 = 4 * (dimensions.cornerRadius * dimensions.cornerRadius - (Math.PI * dimensions.cornerRadius * dimensions.cornerRadius) / 4);
  const holeAreaMm2 = 4 * (Math.PI * Math.pow(dimensions.holeDiameter / 2, 2));
  
  const trueAreaMm2 = baseAreaMm2 - cornerCutoutAreaMm2 - holeAreaMm2;
  const trueVolumeMm3 = trueAreaMm2 * dimensions.thickness;
  const trueVolumeCm3 = trueVolumeMm3 / 1000;

  // Weight
  const weightKg = (trueVolumeCm3 * material.density) / 1000;

  // Perimeter
  const outerPerimeterMm = 2 * (dimensions.width + dimensions.height) - 8 * dimensions.cornerRadius + (2 * Math.PI * dimensions.cornerRadius);
  const holesPerimeterMm = 4 * (Math.PI * dimensions.holeDiameter);
  const totalCutPathMm = outerPerimeterMm + holesPerimeterMm;
  const totalCutPathM = totalCutPathMm / 1000;

  // Surface Area
  const topBottomAreaMm2 = trueAreaMm2 * 2;
  const edgeAreaMm2 = totalCutPathMm * dimensions.thickness;
  const totalSurfaceAreaMm2 = topBottomAreaMm2 + edgeAreaMm2;
  const totalSurfaceAreaM2 = totalSurfaceAreaMm2 / 1000000;

  // 2. Calculate Costs
  const materialCost = (weightKg * material.basePricePerKg) * 1.2; 

  let serviceCost = (service.basePricePerPart || 0);
  if (service.pricePerMeterPath) {
    serviceCost += (service.pricePerMeterPath * totalCutPathM);
  }

  const finishingCost = (finishing.pricePerSqMeter || 0) * totalSurfaceAreaM2;

  const subtotal = materialCost + serviceCost + finishingCost;
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  return {
    materialCost,
    serviceCost,
    finishingCost,
    subtotal,
    vat,
    total,
    weightKg,
    perimeterMm: totalCutPathMm,
    surfaceAreaMm2: totalSurfaceAreaMm2
  };
};