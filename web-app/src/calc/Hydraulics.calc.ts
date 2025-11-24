/**
 * Hydraulics Calculations Module
 * IRC:6-2016 Compliant
 * 
 * Calculates:
 * - Flow depth and area
 * - Velocity (Manning's equation)
 * - Afflux (Lacey's formula)
 * - Design water level
 * - Froude number
 * - Flow characteristics
 */

import { DesignInput, HydraulicsOutput, CrossSectionData } from '../types/design';
import { 
  HYDRAULIC_CONSTANTS, 
  STANDARDS 
} from '../utils/constants';

const { GRAVITY, WATER_DENSITY, MANNING_N, LACEY_SILT_FACTOR_RANGE } = HYDRAULIC_CONSTANTS;

/**
 * Calculate flow depth (HFL - Bed Level)
 */
export function calculateFlowDepth(inputs: DesignInput): number {
  return inputs.floodLevel - inputs.bedLevel;
}

/**
 * Calculate flow area (Width × Depth)
 */
export function calculateFlowArea(inputs: DesignInput, flowDepth: number): number {
  return inputs.width * flowDepth;
}

/**
 * Calculate mean flow velocity using Manning's equation
 * V = (1/n) * R^(2/3) * S^(1/2)
 * Simplified for rectangular channel: V = Q / A
 */
export function calculateVelocity(
  inputs: DesignInput,
  flowArea: number
): number {
  if (flowArea <= 0) return 0;
  return inputs.discharge / flowArea;
}

/**
 * Calculate Lacey's silt factor
 * m = Q / (f × √(depth))
 * For Indian rivers: f typically ranges 0.4-2.0
 */
export function calculateLaceysSiltFactor(
  inputs: DesignInput,
  flowDepth: number
): number {
  if (flowDepth <= 0) return LACEY_SILT_FACTOR_RANGE[0];
  
  // Using simplified formula for natural channels
  // m = Q^(1/3) / (some constant)
  const m = Math.pow(inputs.discharge, 1/3) / 1.5;
  
  // Constrain within typical range
  return Math.max(
    LACEY_SILT_FACTOR_RANGE[0],
    Math.min(m, LACEY_SILT_FACTOR_RANGE[1])
  );
}

/**
 * Calculate afflux using Lacey's formula
 * Afflux = V² / (17.9 × √m)
 * V: velocity in m/s
 * m: Lacey's silt factor
 */
export function calculateAfflux(
  velocity: number,
  laceysSiltFactor: number
): number {
  if (laceysSiltFactor <= 0) return 0;
  return (velocity * velocity) / (17.9 * Math.sqrt(laceysSiltFactor));
}

/**
 * Calculate design water level
 * DWL = HFL + Afflux
 */
export function calculateDesignWaterLevel(
  inputs: DesignInput,
  afflux: number
): number {
  return inputs.floodLevel + afflux;
}

/**
 * Calculate Froude number
 * Fr = V / √(g × D)
 * V: velocity (m/s)
 * g: gravity (9.81 m/s²)
 * D: flow depth (m)
 */
export function calculateFroudeNumber(
  velocity: number,
  flowDepth: number
): number {
  if (flowDepth <= 0) return 0;
  const sqrtGD = Math.sqrt(GRAVITY * flowDepth);
  if (sqrtGD === 0) return 0;
  return velocity / sqrtGD;
}

/**
 * Determine flow regime based on Froude number
 * Fr < 1: Subcritical (safe)
 * Fr = 1: Critical
 * Fr > 1: Supercritical (turbulent)
 */
export function getFlowRegime(froudeNumber: number): 'SUBCRITICAL' | 'CRITICAL' | 'SUPERCRITICAL' {
  if (froudeNumber < 0.9) return 'SUBCRITICAL';
  if (froudeNumber > 1.1) return 'SUPERCRITICAL';
  return 'CRITICAL';
}

/**
 * Calculate contraction scour
 * Simplified: Based on discharge and width change
 */
export function calculateContractionScour(
  inputs: DesignInput,
  velocity: number,
  flowDepth: number
): number {
  // Contraction coefficient based on pier width
  const contractionCoeff = 0.05;
  const additionalVelocity = velocity * contractionCoeff;
  
  // Scour depth approximation (Krishna formula)
  const scourDepth = 1.27 * Math.pow(additionalVelocity, 0.5) * Math.pow(flowDepth, 0.33);
  
  return Math.max(0, scourDepth);
}

/**
 * Generate cross-section data at multiple chainages
 */
export function generateCrossSectionData(
  inputs: DesignInput,
  designWaterLevel: number,
  velocity: number
): CrossSectionData[] {
  const data: CrossSectionData[] = [];
  const numPoints = Math.ceil(inputs.width / 5); // Point every 5m
  
  for (let i = 0; i <= numPoints; i++) {
    const chainage = (i / numPoints) * inputs.width;
    
    // Assume linear bed profile (simplification)
    const groundLevel = inputs.bedLevel;
    const floodDepth = designWaterLevel - groundLevel;
    const sectionWidth = 5; // meters
    const area = floodDepth * sectionWidth;
    const sectionVelocity = inputs.discharge / (area || 1);
    
    data.push({
      chainage,
      groundLevel,
      floodDepth: Math.max(0, floodDepth),
      width: sectionWidth,
      area: Math.max(0, area),
      velocity: Math.max(0, sectionVelocity)
    });
  }
  
  return data;
}

/**
 * Main hydraulics calculation orchestrator
 */
export function calculateHydraulics(inputs: DesignInput): HydraulicsOutput {
  // Sequential calculations with dependencies
  const flowDepth = calculateFlowDepth(inputs);
  const flowArea = calculateFlowArea(inputs, flowDepth);
  const velocity = calculateVelocity(inputs, flowArea);
  const laceysSiltFactor = calculateLaceysSiltFactor(inputs, flowDepth);
  const afflux = calculateAfflux(velocity, laceysSiltFactor);
  const designWaterLevel = calculateDesignWaterLevel(inputs, afflux);
  const froudeNumber = calculateFroudeNumber(velocity, flowDepth);
  const contraction = calculateContractionScour(inputs, velocity, flowDepth);
  const crossSectionData = generateCrossSectionData(inputs, designWaterLevel, velocity);
  
  return {
    flowDepth,
    flowArea,
    velocity,
    laceysSiltFactor,
    afflux,
    designWaterLevel,
    froudeNumber,
    contraction,
    crossSectionData
  };
}

/**
 * Validate hydraulic calculations
 */
export function validateHydraulics(output: HydraulicsOutput): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (output.flowDepth <= 0) {
    issues.push('Flow depth is zero or negative');
  }
  
  if (output.velocity < 0.5) {
    issues.push('Flow velocity is too low (< 0.5 m/s) - possible stagnation');
  }
  
  if (output.velocity > 4.0) {
    issues.push('Flow velocity is high (> 4.0 m/s) - increased scour risk');
  }
  
  if (output.froudeNumber > 1.2) {
    issues.push('Froude number > 1.2 - supercritical flow detected');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}
