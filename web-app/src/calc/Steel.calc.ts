/**
 * Steel Reinforcement Design Module
 * IRC:6-2016 Compliant
 */

import { DesignInput, SteelDesign } from '../types/design';
import { SPACING_REQUIREMENTS, CONCRETE_COVER } from '../utils/constants';

/**
 * Calculate main reinforcement area
 * Using simplified flexure formula: As = Mu / (fy × jd)
 * where jd = 0.875×d (approximate)
 */
export function calculateMainReinforcementArea(
  bendingMoment: number,
  effectiveDepth: number,
  fy: number
): number {
  
  const jd = 0.875 * effectiveDepth;
  const As = bendingMoment / (fy * jd); // cm²
  
  return As;
}

/**
 * Calculate number of bars required
 */
export function calculateNumberOfBars(
  requiredArea: number,
  barDiameter: number
): number {
  
  const barArea = (Math.PI * Math.pow(barDiameter, 2)) / 4; // mm²
  const numberOfBars = Math.ceil(requiredArea / barArea);
  
  return numberOfBars;
}

/**
 * Calculate bar spacing
 */
export function calculateBarSpacing(
  width: number,
  numberOfBars: number,
  barDiameter: number
): number {
  
  const clearCover = CONCRETE_COVER.MAIN_REINFORCEMENT;
  const availableWidth = width - (2 * clearCover);
  const spacing = availableWidth / (numberOfBars - 1);
  
  return Math.max(spacing, SPACING_REQUIREMENTS.MIN_BAR_SPACING);
}

/**
 * Calculate shear reinforcement (stirrups)
 * Vs = (Asv × fy × d) / (s × b)
 * where Asv: area of stirrup legs, s: spacing, b: width
 */
export function calculateShearReinforcement(
  shearForce: number,
  effectiveDepth: number,
  width: number,
  fy: number
): { diameter: number; spacing: number; quantity: number } {
  
  // Stirrup diameter typically 8-10mm
  const stirrupDiameter = 8;
  const stirrupArea = (Math.PI * Math.pow(stirrupDiameter, 2)) / 4;
  
  // For 2-legged stirrups
  const twoLegArea = 2 * stirrupArea;
  
  // Design for shear: V = (Asv × fy × d) / s
  // Rearranging: s = (Asv × fy × d) / V
  const spacing = (twoLegArea * fy * effectiveDepth) / (shearForce * 1.15);
  
  // Limit to maximum spacing
  const maxSpacing = Math.min(
    SPACING_REQUIREMENTS.MAX_STIRRUP_SPACING,
    effectiveDepth / 2
  );
  
  const finalSpacing = Math.min(spacing, maxSpacing);
  
  // Calculate quantity
  const numberOfStirrupsPerMeter = 1000 / finalSpacing;
  const stirrupWeight = (2 * stirrupArea / 100) * 7850 / 1000; // kg per stirrup
  const quantity = numberOfStirrupsPerMeter * stirrupWeight;
  
  return {
    diameter: stirrupDiameter,
    spacing: Math.round(finalSpacing),
    quantity: Math.round(quantity * 100) / 100
  };
}

/**
 * Calculate development length
 * Ld = (fy × diameter) / (2 × τbd)
 * where τbd = bond stress
 */
export function calculateDevelopmentLength(
  fy: number,
  barDiameter: number,
  bondStress: number = 1.6 // N/mm² for M30 concrete
): number {
  
  const ld = (fy * barDiameter) / (2 * bondStress);
  
  return ld;
}

/**
 * Calculate lap length (1.3 × Ld for splice)
 */
export function calculateLapLength(developmentLength: number): number {
  return 1.3 * developmentLength;
}

/**
 * Calculate total steel quantity
 */
export function calculateTotalSteelQuantity(
  numberOfBars: number,
  barDiameter: number,
  barLength: number,
  stirrupQuantity: number
): number {
  
  const barArea = (Math.PI * Math.pow(barDiameter, 2)) / 4; // mm²
  const barVolumePerMeter = (barArea * barLength) / 1000000; // m³
  const barWeight = barVolumePerMeter * 7850; // kg/m³
  
  const totalBars = numberOfBars * barWeight;
  const totalStirrup = stirrupQuantity * barLength / 1000; // Simplified
  
  return totalBars + totalStirrup;
}

/**
 * Main steel design orchestrator
 */
export function calculateSteelDesign(
  inputs: DesignInput,
  pierNumber: number = 1,
  bendingMoment: number = 100,
  shearForce: number = 50
): SteelDesign {
  
  const effectiveDepth = 800; // mm - typical for pier
  const width = 1500; // mm - typical pier width
  
  // Main reinforcement
  const mainArea = calculateMainReinforcementArea(bendingMoment, effectiveDepth, inputs.fy);
  const mainNumberOfBars = calculateNumberOfBars(mainArea, 20); // 20mm bars
  const mainSpacing = calculateBarSpacing(width, mainNumberOfBars, 20);
  const mainQuantity = calculateTotalSteelQuantity(mainNumberOfBars, 20, 3000, 0);
  
  // Shear reinforcement
  const shear = calculateShearReinforcement(shearForce, effectiveDepth, width, inputs.fy);
  
  return {
    pierId: pierNumber,
    steelGrade: inputs.fy,
    mainBars: {
      diameter: 20,
      spacing: Math.round(mainSpacing),
      count: mainNumberOfBars,
      quantity: mainQuantity
    },
    stirrups: {
      diameter: shear.diameter,
      spacing: shear.spacing,
      quantity: shear.quantity
    },
    totalQuantity: mainQuantity + shear.quantity,
    totalCost: (mainQuantity + shear.quantity) * 60 // Rs/kg
  };
}
