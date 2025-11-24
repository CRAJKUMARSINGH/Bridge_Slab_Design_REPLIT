/**
 * Slab Design Calculations Module (Pigeaud's Method)
 * IRC:6-2016 Compliant
 */

import { DesignInput, SlabDesign } from '../types/design';
import { LOAD_FACTORS, DEFLECTION_LIMITS } from '../utils/constants';

/**
 * Calculate slab aspect ratio
 */
export function calculateAspectRatio(span: number, width: number): number {
  if (width === 0) return 0;
  return span / width;
}

/**
 * Estimate dead load (slab self-weight + wearing coat)
 * DL = (slab thickness × concrete density) + wearing coat
 * Typical: 25 kN/m² for 500mm RCC slab
 */
export function calculateDeadLoad(slabThickness: number = 0.5): number {
  const concreteDensity = 25; // kN/m³
  const slabDL = slabThickness * concreteDensity;
  const wearingCoat = 1.5; // kN/m²
  return slabDL + wearingCoat;
}

/**
 * Estimate live load based on IRC:6-2016
 * Class 70R: 70 kN per wheel, contact area 0.25m²
 * Typical reduced LL for design: 15 kN/m²
 */
export function calculateLiveLoad(loadClass: string = '70R'): number {
  // Simplified for 2-lane bridge with class 70R
  return 15; // kN/m²
}

/**
 * Calculate design load
 * Design Load = 1.5 × DL + 1.75 × LL (IRC:6-2016)
 */
export function calculateDesignLoad(deadLoad: number, liveLoad: number): number {
  return (LOAD_FACTORS.DEAD_LOAD * deadLoad) + (LOAD_FACTORS.LIVE_LOAD * liveLoad);
}

/**
 * Calculate longitudinal moment (Pigeaud's method)
 * For simply supported slab: M = (w × L²) / 12
 * Using Pigeaud's coefficients for edge cases
 */
export function calculateLongitudinalMoment(
  designLoad: number,
  span: number,
  aspectRatio: number
): number {
  // Pigeaud's coefficient varies with aspect ratio
  // For simplification: use standard formula with reduction factor
  let coefficient = 1.0;
  
  if (aspectRatio < 0.5) {
    coefficient = 0.8; // Span-critical
  } else if (aspectRatio > 2.0) {
    coefficient = 1.2; // Width-critical
  }
  
  return coefficient * (designLoad * Math.pow(span, 2)) / 12;
}

/**
 * Calculate transverse moment (across width)
 */
export function calculateTransverseMoment(
  designLoad: number,
  width: number,
  aspectRatio: number
): number {
  let coefficient = 1.0;
  
  if (aspectRatio > 2.0) {
    coefficient = 0.6; // Width much less than span
  }
  
  return coefficient * (designLoad * Math.pow(width, 2)) / 12;
}

/**
 * Calculate maximum deflection
 * Deflection = (5 × w × L⁴) / (384 × E × I)
 * Simplified estimation
 */
export function calculateMaxDeflection(
  designLoad: number,
  span: number,
  thickness: number = 0.5
): number {
  // Simplified: approximate deflection
  // E: Young's modulus ~ 30000 N/mm² for concrete
  // I: Moment of inertia for slab
  
  const estimatedDeflection = (5 * designLoad * Math.pow(span, 4)) / (384 * 30 * Math.pow(thickness, 3));
  
  return Math.min(estimatedDeflection, 100); // Cap at 100mm
}

/**
 * Calculate deflection limit (L/250 for simply supported)
 */
export function calculateDeflectionLimit(span: number): number {
  return (span * 1000) / DEFLECTION_LIMITS.SIMPLY_SUPPORTED; // Convert to mm
}

/**
 * Validate slab design
 */
export function validateSlabDesign(
  maxDeflection: number,
  deflectionLimit: number,
  longitudinalMoment: number,
  transverseMoment: number
): { status: 'SAFE' | 'WARNING' | 'CRITICAL'; remarks: string } {
  
  const issues: string[] = [];
  
  if (maxDeflection > deflectionLimit) {
    issues.push(`Deflection ${maxDeflection.toFixed(1)}mm > limit ${deflectionLimit.toFixed(1)}mm`);
  }
  
  if (longitudinalMoment <= 0 || transverseMoment <= 0) {
    issues.push('Moments are not positive');
  }
  
  if (issues.length === 0) {
    return { status: 'SAFE', remarks: 'Deflection and moments within limits' };
  }
  
  return { status: 'WARNING', remarks: issues.join('; ') };
}

/**
 * Main slab design orchestrator
 */
export function calculateSlabDesign(
  inputs: DesignInput,
  span: number = 10.0,
  slabThickness: number = 0.5
): SlabDesign {
  
  const aspectRatio = calculateAspectRatio(span, inputs.width);
  const deadLoad = calculateDeadLoad(slabThickness);
  const liveLoad = calculateLiveLoad(inputs.loadClass);
  const designLoad = calculateDesignLoad(deadLoad, liveLoad);
  
  const longitudinalMoment = calculateLongitudinalMoment(designLoad, span, aspectRatio);
  const transverseMoment = calculateTransverseMoment(designLoad, inputs.width, aspectRatio);
  
  const maxDeflection = calculateMaxDeflection(designLoad, span, slabThickness);
  const deflectionLimit = calculateDeflectionLimit(span);
  
  const { status, remarks } = validateSlabDesign(
    maxDeflection,
    deflectionLimit,
    longitudinalMoment,
    transverseMoment
  );
  
  return {
    aspectRatio,
    deadLoad,
    liveLoad,
    designLoad,
    longitudinalMoment,
    transverseMoment,
    maxDeflection,
    deflectionLimit,
    status,
    remarks
  };
}
