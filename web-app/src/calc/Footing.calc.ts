/**
 * Footing Design Calculations Module
 * IRC:6-2016 Compliant
 */

import { DesignInput, FootingDesign } from '../types/design';
import { FACTORS_OF_SAFETY, DEFLECTION_LIMITS } from '../utils/constants';

/**
 * Calculate footing dimensions
 */
export function calculateFootingDimensions(
  pierWeight: number,
  soilBearingCapacity: number
): { length: number; width: number; depth: number } {
  
  // Required area = Weight / Safe Bearing Capacity
  const requiredArea = (pierWeight * 1000) / (soilBearingCapacity * 0.8); // 0.8 safety factor
  
  // Assume square footing
  const sideLength = Math.sqrt(requiredArea);
  
  // Minimum depth: 1.5m below scour level
  const depth = 2.0;
  
  return {
    length: Math.ceil(sideLength),
    width: Math.ceil(sideLength),
    depth
  };
}

/**
 * Calculate applied bearing pressure
 */
export function calculateAppliedPressure(
  weight: number,
  length: number,
  width: number
): number {
  const area = length * width;
  if (area === 0) return 0;
  return (weight * 1000) / area; // Convert kN to N, result in kPa
}

/**
 * Calculate safe bearing capacity with safety factors
 */
export function calculateSafeBearingCapacity(
  soilBearingCapacity: number,
  safetyFactor: number = 0.8
): number {
  return soilBearingCapacity * safetyFactor;
}

/**
 * Calculate bearing FOS
 */
export function calculateFootingBearingFOS(
  safeBearingCapacity: number,
  appliedPressure: number
): number {
  if (appliedPressure === 0) return 999;
  return safeBearingCapacity / appliedPressure;
}

/**
 * Calculate settlement
 * Simplified: Settlement ≈ (Pressure / SBC) × Depth
 */
export function calculateSettlement(
  appliedPressure: number,
  soilBearingCapacity: number,
  footingDepth: number
): number {
  if (soilBearingCapacity === 0) return 0;
  
  const stressFactor = appliedPressure / soilBearingCapacity;
  const settlement = stressFactor * footingDepth * 100; // mm
  
  return Math.min(settlement, 150); // Cap at 150mm
}

/**
 * Calculate footing concrete and steel
 */
export function calculateFootingMaterials(
  length: number,
  width: number,
  depth: number
): { concrete: number; steel: number } {
  
  const concrete = length * width * depth;
  
  // Steel: 1.0-1.2% of concrete volume for footings
  const steelVolume = concrete * 0.01;
  const steelDensity = 7850; // kg/m³
  const steel = steelVolume * steelDensity; // kg
  
  return { concrete, steel };
}

/**
 * Validate footing design
 */
export function validateFootingDesign(
  bearingFOS: number,
  settlement: number,
  settlementLimit: number = DEFLECTION_LIMITS.SETTLEMENT_MAX
): { status: 'SAFE' | 'WARNING' | 'CRITICAL'; remarks: string } {
  
  const issues: string[] = [];
  
  if (bearingFOS < FACTORS_OF_SAFETY.BEARING_MIN) {
    issues.push(`Bearing FOS ${bearingFOS.toFixed(2)} < ${FACTORS_OF_SAFETY.BEARING_MIN}`);
  }
  
  if (settlement > settlementLimit) {
    issues.push(`Settlement ${settlement.toFixed(1)}mm > limit ${settlementLimit}mm`);
  }
  
  if (issues.length === 0) {
    return { status: 'SAFE', remarks: 'Bearing and settlement within limits' };
  }
  
  return { status: 'WARNING', remarks: issues.join('; ') };
}

/**
 * Main footing design orchestrator
 */
export function calculateFootingDesign(
  inputs: DesignInput,
  pierWeight: number
): FootingDesign {
  
  const dims = calculateFootingDimensions(pierWeight, inputs.soilBearingCapacity);
  const appliedPressure = calculateAppliedPressure(pierWeight, dims.length, dims.width);
  const safeBearingCapacity = calculateSafeBearingCapacity(inputs.soilBearingCapacity);
  const bearingFOS = calculateFootingBearingFOS(safeBearingCapacity, appliedPressure);
  const settlement = calculateSettlement(appliedPressure, inputs.soilBearingCapacity, dims.depth);
  const materials = calculateFootingMaterials(dims.length, dims.width, dims.depth);
  
  const { status, remarks } = validateFootingDesign(bearingFOS, settlement);
  
  return {
    length: dims.length,
    width: dims.width,
    depth: dims.depth,
    appliedPressure,
    safeBearingCapacity,
    bearingFOS,
    concrete: materials.concrete,
    steel: materials.steel / 1000, // Convert to kg/m³
    settlement,
    settlementLimit: DEFLECTION_LIMITS.SETTLEMENT_MAX,
    status,
    remarks
  };
}
