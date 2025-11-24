/**
 * Abutment Design Calculations Module
 * IRC:6-2016 & IRC:112-2015 Compliant
 * 
 * Calculates Type 1 (Gravity) Abutment:
 * - Dimensions and geometry
 * - Active/Passive earth pressures
 * - Stability factors: Sliding, Overturning, Bearing
 */

import { DesignInput, AbutmentDesign, HydraulicsOutput } from '../types/design';
import { FACTORS_OF_SAFETY, HYDRAULIC_CONSTANTS, EARTH_PRESSURE } from '../utils/constants';

const { GRAVITY } = HYDRAULIC_CONSTANTS;

/**
 * Calculate abutment height
 * Height = HFL - Bed Level + freeboard
 */
export function calculateAbutmentHeight(inputs: DesignInput): number {
  return inputs.floodLevel - inputs.bedLevel + 2.5; // 2.5m freeboard
}

/**
 * Calculate abutment base width
 * Typically: (Bridge Width / 2) + wing wall offset + safety
 */
export function calculateAbutmentBaseWidth(inputs: DesignInput): number {
  return inputs.width / 2 + 1.0; // Half width + 1m
}

/**
 * Calculate base length (in flow direction)
 */
export function calculateAbutmentBaseLength(): number {
  return 3.0; // Typical 3m for gravity abutment
}

/**
 * Calculate wing wall length
 */
export function calculateWingWallLength(inputs: DesignInput): number {
  return inputs.width * 0.25; // 25% of bridge width
}

/**
 * Calculate active earth pressure coefficient (Rankine)
 * Ka = (1 - sin(φ)) / (1 + sin(φ))
 * φ: friction angle (typically 30-35 degrees)
 */
export function calculateActiveEarthPressureCoeff(frictionAngle: number = 35): number {
  const angleRad = (frictionAngle * Math.PI) / 180;
  const sinPhi = Math.sin(angleRad);
  return (1 - sinPhi) / (1 + sinPhi);
}

/**
 * Calculate passive earth pressure coefficient (Rankine)
 * Kp = (1 + sin(φ)) / (1 - sin(φ))
 */
export function calculatePassiveEarthPressureCoeff(frictionAngle: number = 35): number {
  const angleRad = (frictionAngle * Math.PI) / 180;
  const sinPhi = Math.sin(angleRad);
  return (1 + sinPhi) / (1 - sinPhi);
}

/**
 * Calculate active earth pressure (per linear meter of abutment)
 * Pressure = 0.5 × γ × H² × Ka
 * γ: soil density (18-20 kN/m³)
 * H: abutment height
 * Ka: active earth pressure coefficient
 */
export function calculateActiveEarthPressure(
  height: number,
  soilDensity: number = EARTH_PRESSURE.DENSITY_SOIL,
  ka: number
): number {
  return 0.5 * soilDensity * Math.pow(height, 2) * ka;
}

/**
 * Calculate passive earth pressure
 * Acts at the base, resists sliding
 */
export function calculatePassiveEarthPressure(
  height: number,
  soilDensity: number = EARTH_PRESSURE.DENSITY_SATURATED,
  kp: number
): number {
  return 0.5 * soilDensity * Math.pow(height, 2) * kp;
}

/**
 * Calculate abutment weight
 */
export function calculateAbutmentWeight(
  height: number,
  baseWidth: number,
  baseLength: number,
  wingWallLength: number,
  concreteDensity: number = 2500
): number {
  // Main body volume
  const mainVolume = baseWidth * baseLength * height;
  
  // Wing walls (approximate)
  const wingVolume = 2 * (wingWallLength * 0.5 * height); // Simplified
  
  const totalVolume = mainVolume + wingVolume;
  const weightKg = totalVolume * concreteDensity;
  
  return weightKg / 1000; // Convert to kN (approx)
}

/**
 * Calculate sliding factor of safety
 * FOS_sliding = (Weight × μ + Passive Pressure) / Active Pressure
 */
export function calculateAbutmentSlidingFOS(
  abutmentWeight: number,
  activeEarthPressure: number,
  passiveEarthPressure: number,
  frictionCoefficient: number = 0.5
): number {
  if (activeEarthPressure === 0) return 999;
  
  const resistingForce = (abutmentWeight * frictionCoefficient) + passiveEarthPressure;
  return resistingForce / activeEarthPressure;
}

/**
 * Calculate overturning factor of safety
 * FOS_overturning = (Weight × L/2) / (Pressure × H/3)
 */
export function calculateAbutmentOverturnFOS(
  abutmentWeight: number,
  activeEarthPressure: number,
  baseLength: number,
  height: number
): number {
  if (activeEarthPressure === 0) return 999;
  
  // Resulting moment of earth pressure acts at H/3 from base
  const resistingMoment = abutmentWeight * (baseLength / 2);
  const overturnMoment = activeEarthPressure * (height / 3);
  
  if (overturnMoment === 0) return 999;
  return resistingMoment / overturnMoment;
}

/**
 * Calculate bearing factor of safety
 */
export function calculateAbutmentBearingFOS(
  abutmentWeight: number,
  baseLength: number,
  baseWidth: number,
  soilBearingCapacity: number
): number {
  const baseArea = baseLength * baseWidth;
  if (baseArea === 0) return 0;
  
  const appliedPressure = abutmentWeight / baseArea;
  const safeBearingCapacity = soilBearingCapacity * 0.8;
  
  if (appliedPressure === 0) return 999;
  return safeBearingCapacity / appliedPressure;
}

/**
 * Calculate concrete and steel volume
 */
export function calculateAbutmentMaterials(
  height: number,
  baseWidth: number,
  baseLength: number,
  wingWallLength: number
): { concrete: number; steel: number } {
  const mainVolume = baseWidth * baseLength * height;
  const wingVolume = 2 * (wingWallLength * 0.5 * height);
  const concrete = mainVolume + wingVolume;
  
  // Steel: 0.8-1.0% of concrete volume
  const steel = concrete * 0.01 * 100; // kg/m³
  
  return { concrete, steel };
}

/**
 * Determine abutment status
 */
export function determineAbutmentStatus(
  slidingFOS: number,
  overturnFOS: number,
  bearingFOS: number
): { status: 'SAFE' | 'WARNING' | 'CRITICAL'; remarks: string } {
  
  const issues: string[] = [];
  
  if (slidingFOS < FACTORS_OF_SAFETY.SLIDING_MIN) {
    issues.push(`Sliding FOS ${slidingFOS.toFixed(2)} < ${FACTORS_OF_SAFETY.SLIDING_MIN}`);
  }
  
  if (overturnFOS < FACTORS_OF_SAFETY.OVERTURNING_MIN) {
    issues.push(`Overturning FOS ${overturnFOS.toFixed(2)} < ${FACTORS_OF_SAFETY.OVERTURNING_MIN}`);
  }
  
  if (bearingFOS < FACTORS_OF_SAFETY.BEARING_MIN) {
    issues.push(`Bearing FOS ${bearingFOS.toFixed(2)} < ${FACTORS_OF_SAFETY.BEARING_MIN}`);
  }
  
  if (issues.length === 0) {
    return { status: 'SAFE', remarks: 'All FOS values within limits' };
  }
  
  if (issues.length === 1) {
    return { status: 'WARNING', remarks: issues[0] };
  }
  
  return { status: 'CRITICAL', remarks: `Multiple FOS violations: ${issues.join('; ')}` };
}

/**
 * Main abutment design orchestrator (Type 1)
 */
export function calculateAbutmentType1(
  inputs: DesignInput,
  hydraulics: HydraulicsOutput
): AbutmentDesign {
  
  const height = calculateAbutmentHeight(inputs);
  const baseWidth = calculateAbutmentBaseWidth(inputs);
  const baseLength = calculateAbutmentBaseLength();
  const wingWallLength = calculateWingWallLength(inputs);
  
  const frictionAngle = EARTH_PRESSURE.FRICTION_ANGLE_MAX; // 40 degrees
  const ka = calculateActiveEarthPressureCoeff(frictionAngle);
  const kp = calculatePassiveEarthPressureCoeff(frictionAngle);
  
  const activeEarthPressure = calculateActiveEarthPressure(height, EARTH_PRESSURE.DENSITY_SOIL, ka);
  const passiveEarthPressure = calculatePassiveEarthPressure(height, EARTH_PRESSURE.DENSITY_SATURATED, kp);
  
  const weight = calculateAbutmentWeight(height, baseWidth, baseLength, wingWallLength);
  
  const slidingFOS = calculateAbutmentSlidingFOS(weight, activeEarthPressure, passiveEarthPressure);
  const overturnFOS = calculateAbutmentOverturnFOS(weight, activeEarthPressure, baseLength, height);
  const bearingFOS = calculateAbutmentBearingFOS(weight, baseLength, baseWidth, inputs.soilBearingCapacity);
  
  const { status, remarks } = determineAbutmentStatus(slidingFOS, overturnFOS, bearingFOS);
  const materials = calculateAbutmentMaterials(height, baseWidth, baseLength, wingWallLength);
  
  return {
    type: 'TYPE1',
    height,
    baseWidth,
    baseLength,
    wingWallLength,
    activeEarthPressure,
    passiveEarthPressure,
    frictionAngle,
    concrete: materials.concrete,
    steel: materials.steel,
    slidingFOS,
    overturnFOS,
    bearingFOS,
    status,
    remarks
  };
}
