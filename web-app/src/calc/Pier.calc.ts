/**
 * Pier Design Calculations Module
 * IRC:6-2016 Compliant
 * 
 * Calculates:
 * - Pier dimensions and spacing
 * - Hydrostatic and drag forces (Morison equation)
 * - Stability factors: Sliding, Overturning, Bearing
 * - Reinforcement requirements
 */

import { DesignInput, PierDesign, HydraulicsOutput } from '../types/design';
import { FACTORS_OF_SAFETY, HYDRAULIC_CONSTANTS, STANDARDS } from '../utils/constants';

const { GRAVITY } = HYDRAULIC_CONSTANTS;

/**
 * Calculate number of piers based on span
 * Rule: One pier per 5m span approximately
 */
export function calculateNumberOfPiers(span: number): number {
  return Math.max(2, Math.round(span / 5));
}

/**
 * Calculate pier dimensions
 */
export function calculatePierDimensions(inputs: DesignInput, numberOfPiers: number) {
  const pierWidth = 1.5; // m - typical for Indian bridges
  const pierLength = 0.8 * inputs.width; // Along flow direction
  const pierDepth = 2.0; // m typical scour depth + safety
  const baseWidth = pierWidth + 0.5; // Foundation width
  const baseLength = pierLength + 0.5;
  const spacing = inputs.span / numberOfPiers;
  
  return {
    pierWidth,
    pierLength,
    pierDepth,
    baseWidth,
    baseLength,
    spacing
  };
}

/**
 * Calculate pier concrete volume
 */
export function calculatePierVolume(
  width: number,
  length: number,
  height: number,
  baseWidth: number,
  baseLength: number,
  baseThickness: number = 1.5
): { pierConcrete: number; baseConcrete: number } {
  const pierConcrete = width * length * height;
  const baseConcrete = baseWidth * baseLength * baseThickness;
  
  return { pierConcrete, baseConcrete };
}

/**
 * Calculate pier weight
 */
export function calculatePierWeight(
  pierVolume: number,
  baseVolume: number,
  concreteDensity: number = 2500
): number {
  const totalVolume = pierVolume + baseVolume;
  const weightKg = totalVolume * concreteDensity;
  return weightKg / 1000; // Convert to kN (assuming 1000kg = 10kN approximately)
}

/**
 * Calculate hydrostatic force (Morison equation simplified)
 * F_h = 0.5 × ρ × A × v² × C_d
 * Where:
 * ρ: water density (1000 kg/m³)
 * A: projected area
 * v: velocity
 * C_d: drag coefficient (1.1 for circular pier, 1.25 for rectangular)
 */
export function calculateHydrostaticForce(
  flowDepth: number,
  pierWidth: number,
  velocity: number,
  waterDensity: number = 1000
): number {
  const projectedArea = flowDepth * pierWidth;
  
  // Hydrostatic pressure force = 0.5 × ρ × g × D² × width
  const hydrostaticForce = 0.5 * waterDensity * GRAVITY * Math.pow(flowDepth, 2) * pierWidth;
  
  return hydrostaticForce / 1000; // Convert to kN
}

/**
 * Calculate drag force (Morison equation)
 * F_d = 0.5 × ρ × A × C_d × v²
 */
export function calculateDragForce(
  flowDepth: number,
  pierWidth: number,
  pierLength: number,
  velocity: number,
  dragCoefficient: number = 1.25,
  waterDensity: number = 1000
): number {
  const projectedArea = flowDepth * pierWidth;
  
  const dragForce = 0.5 * waterDensity * projectedArea * dragCoefficient * Math.pow(velocity, 2);
  
  return dragForce / 1000; // Convert to kN
}

/**
 * Calculate total horizontal force
 */
export function calculateTotalHorizontalForce(
  hydrostaticForce: number,
  dragForce: number
): number {
  return hydrostaticForce + dragForce;
}

/**
 * Calculate sliding factor of safety
 * FOS_sliding = (Weight × μ) / Horizontal Force
 * μ: coefficient of friction (0.5 for concrete on soil)
 */
export function calculateSlidingFOS(
  pierWeight: number,
  totalHorizontalForce: number,
  frictionCoefficient: number = 0.5
): number {
  if (totalHorizontalForce === 0) return 999;
  return (pierWeight * frictionCoefficient) / totalHorizontalForce;
}

/**
 * Calculate overturning factor of safety
 * FOS_overturning = (Weight × L/2) / (H.Force × D/2)
 * L: base length
 * D: flow depth
 */
export function calculateOverturnFOS(
  pierWeight: number,
  totalHorizontalForce: number,
  baseLength: number,
  flowDepth: number
): number {
  if (totalHorizontalForce === 0) return 999;
  
  const resistingMoment = pierWeight * (baseLength / 2);
  const overturningMoment = totalHorizontalForce * (flowDepth / 2);
  
  if (overturningMoment === 0) return 999;
  return resistingMoment / overturningMoment;
}

/**
 * Calculate bearing factor of safety
 * FOS_bearing = Safe Bearing Capacity / Applied Bearing Pressure
 * Applied Pressure = Weight / (Base Area)
 */
export function calculateBearingFOS(
  pierWeight: number,
  baseLength: number,
  baseWidth: number,
  soilBearingCapacity: number
): number {
  const baseArea = baseLength * baseWidth;
  if (baseArea === 0) return 0;
  
  const appliedPressure = pierWeight / baseArea; // Convert to kPa
  const safeBearingCapacity = soilBearingCapacity * 0.8; // Safety factor applied
  
  if (appliedPressure === 0) return 999;
  return safeBearingCapacity / appliedPressure;
}

/**
 * Determine design status based on FOS values
 */
export function determinePierStatus(
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
 * Calculate steel reinforcement quantity
 * Simplified: kg/m³ of concrete
 */
export function calculateSteelQuantity(
  fck: number,
  fy: number
): number {
  // Typical steel percentage: 0.8-1.2% for piers
  // Using 1% for standard design
  return 100; // kg/m³
}

/**
 * Main pier design orchestrator
 */
export function calculatePierDesign(
  inputs: DesignInput,
  hydraulics: HydraulicsOutput
): PierDesign {
  const numberOfPiers = calculateNumberOfPiers(inputs.span);
  const dims = calculatePierDimensions(inputs, numberOfPiers);
  const volumes = calculatePierVolume(dims.pierWidth, dims.pierLength, 3.0, dims.baseWidth, dims.baseLength);
  const pierWeight = calculatePierWeight(volumes.pierConcrete, volumes.baseConcrete);
  
  const hydrostaticForce = calculateHydrostaticForce(
    hydraulics.flowDepth,
    dims.pierWidth,
    hydraulics.velocity
  );
  
  const dragForce = calculateDragForce(
    hydraulics.flowDepth,
    dims.pierWidth,
    dims.pierLength,
    hydraulics.velocity
  );
  
  const totalHorizontalForce = calculateTotalHorizontalForce(hydrostaticForce, dragForce);
  
  const slidingFOS = calculateSlidingFOS(pierWeight, totalHorizontalForce);
  const overturnFOS = calculateOverturnFOS(pierWeight, totalHorizontalForce, dims.baseLength, hydraulics.flowDepth);
  const bearingFOS = calculateBearingFOS(pierWeight, dims.baseLength, dims.baseWidth, inputs.soilBearingCapacity);
  
  const { status, remarks } = determinePierStatus(slidingFOS, overturnFOS, bearingFOS);
  const pierSteel = calculateSteelQuantity(inputs.fck, inputs.fy);
  
  return {
    numberOfPiers,
    pierWidth: dims.pierWidth,
    pierLength: dims.pierLength,
    pierDepth: dims.pierDepth,
    baseWidth: dims.baseWidth,
    baseLength: dims.baseLength,
    spacing: dims.spacing,
    pierConcrete: volumes.pierConcrete,
    baseConcrete: volumes.baseConcrete,
    pierSteel,
    hydrostaticForce,
    dragForce,
    totalHorizontalForce,
    slidingFOS,
    overturnFOS,
    bearingFOS,
    status,
    remarks
  };
}
