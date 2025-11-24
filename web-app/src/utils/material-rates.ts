/**
 * Material Rates & Cost Management
 * Extracted & enhanced from GitHub repo
 * Standard Indian rates for bridge construction (2024)
 */

export interface MaterialRate {
  itemNo: string;
  description: string;
  unit: string;
  rate: number; // In Rs/unit
  category: 'concrete' | 'steel' | 'formwork' | 'excavation' | 'backfill' | 'misc';
}

// Standard material rates based on Indian market (2024)
export const MATERIAL_RATES: MaterialRate[] = [
  // Concrete rates
  { itemNo: 'C-M20', description: 'Concrete M20', unit: 'm³', rate: 5000, category: 'concrete' },
  { itemNo: 'C-M25', description: 'Concrete M25', unit: 'm³', rate: 5500, category: 'concrete' },
  { itemNo: 'C-M30', description: 'Concrete M30 (RCC)', unit: 'm³', rate: 6000, category: 'concrete' },
  { itemNo: 'C-M35', description: 'Concrete M35', unit: 'm³', rate: 6500, category: 'concrete' },
  { itemNo: 'C-M40', description: 'Concrete M40', unit: 'm³', rate: 7000, category: 'concrete' },
  
  // Steel rates (Fe415, Fe500)
  { itemNo: 'S-FE415', description: 'Steel Fe415', unit: 'kg', rate: 65, category: 'steel' },
  { itemNo: 'S-FE500', description: 'Steel Fe500', unit: 'kg', rate: 70, category: 'steel' },
  
  // Formwork & Shuttering
  { itemNo: 'F-FORMWORK', description: 'Formwork (Timber/Plywood)', unit: 'm²', rate: 350, category: 'formwork' },
  
  // Excavation
  { itemNo: 'E-ORDINARY', description: 'Excavation (Ordinary)', unit: 'm³', rate: 250, category: 'excavation' },
  { itemNo: 'E-ROCK', description: 'Excavation (Rock)', unit: 'm³', rate: 800, category: 'excavation' },
  
  // Backfill
  { itemNo: 'B-BACKFILL', description: 'Backfill Material', unit: 'm³', rate: 150, category: 'backfill' },
];

// Quick lookup map
const rateLookupByDescription = new Map<string, number>(
  MATERIAL_RATES.map(r => [r.description.toLowerCase(), r.rate])
);

const rateLookupByItemNo = new Map<string, number>(
  MATERIAL_RATES.map(r => [r.itemNo, r.rate])
);

/**
 * Get rate by description (case-insensitive)
 */
export function getRateByDescription(description: string): number | undefined {
  return rateLookupByDescription.get(description.toLowerCase());
}

/**
 * Get rate by item number
 */
export function getRateByItemNo(itemNo: string): number | undefined {
  return rateLookupByItemNo.get(itemNo);
}

/**
 * Get rate by concrete grade
 */
export function getConcreteRate(grade: 'M20' | 'M25' | 'M30' | 'M35' | 'M40'): number {
  const rateMap: Record<string, number> = {
    M20: 5000,
    M25: 5500,
    M30: 6000,
    M35: 6500,
    M40: 7000,
  };
  return rateMap[grade] || 6000; // Default M30
}

/**
 * Get rate by steel grade
 */
export function getSteelRate(grade: 'Fe415' | 'Fe500' = 'Fe500'): number {
  return grade === 'Fe415' ? 65 : 70;
}

/**
 * Calculate material cost
 */
export function calculateMaterialCost(
  quantity: number,
  ratePerUnit: number
): number {
  return quantity * ratePerUnit;
}

/**
 * Get all materials in a category
 */
export function getMaterialsByCategory(
  category: MaterialRate['category']
): MaterialRate[] {
  return MATERIAL_RATES.filter(r => r.category === category);
}

/**
 * Cost breakup helper
 */
export function getCostBreakup(quantities: {
  concrete?: number; // m³
  concreteGrade?: 'M20' | 'M25' | 'M30' | 'M35' | 'M40';
  steel?: number; // kg
  steelGrade?: 'Fe415' | 'Fe500';
  formwork?: number; // m²
  excavation?: number; // m³
  backfill?: number; // m³
}): {
  concreteCost: number;
  steelCost: number;
  formworkCost: number;
  excavationCost: number;
  backfillCost: number;
  totalCost: number;
} {
  const concreteGrade = quantities.concreteGrade || 'M30';
  const steelGrade = quantities.steelGrade || 'Fe500';
  
  const concreteCost = (quantities.concrete || 0) * getConcreteRate(concreteGrade);
  const steelCost = (quantities.steel || 0) * getSteelRate(steelGrade);
  const formworkCost = (quantities.formwork || 0) * 350;
  const excavationCost = (quantities.excavation || 0) * 250;
  const backfillCost = (quantities.backfill || 0) * 150;
  
  return {
    concreteCost,
    steelCost,
    formworkCost,
    excavationCost,
    backfillCost,
    totalCost:
      concreteCost + steelCost + formworkCost + excavationCost + backfillCost,
  };
}
