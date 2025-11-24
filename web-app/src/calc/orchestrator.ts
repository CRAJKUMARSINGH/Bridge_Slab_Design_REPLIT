/**
 * Master Calculation Orchestrator
 * Chains all calculation modules in proper dependency order
 * 
 * Dependency Order:
 * 1. Hydraulics (depends on: DesignInput)
 * 2. Pier (depends on: Hydraulics, DesignInput)
 * 3. Abutment (depends on: Hydraulics, DesignInput)
 * 4. Slab (depends on: DesignInput)
 * 5. Footing (depends on: Pier, DesignInput)
 * 6. Load Cases (depends on: All above)
 */

import { DesignInput, CompleteDesignOutput, BillOfQuantities } from '../types/design';
import { calculateHydraulics } from './Hydraulics.calc';
import { calculatePierDesign } from './Pier.calc';
import { calculateAbutmentType1 } from './Abutment.calc';
import { calculateSlabDesign } from './Slab.calc';
import { calculateFootingDesign } from './Footing.calc';
import { generateLoadCaseAnalysis } from './LoadCases.calc';
import { getConcreteRate, getSteelRate } from '../utils/material-rates';

/**
 * Convert concrete grade to fck value
 */
function getConcreteStrength(grade: string): number {
  const grades: Record<string, number> = {
    'M20': 20, 'M25': 25, 'M30': 30, 'M35': 35, 'M40': 40
  };
  return grades[grade] || 30;
}

/**
 * Convert steel grade to fy value
 */
function getSteelStrength(grade: string): number {
  const grades: Record<string, number> = {
    'Fe415': 415, 'Fe500': 500
  };
  return grades[grade] || 500;
}

/**
 * Calculate Bill of Quantities
 */
export function calculateBOQ(
  pierConcrete: number,
  pierBaseConcrete: number,
  pierSteel: number,
  abutmentConcrete: number,
  abutmentSteel: number,
  slabConcrete: number = 100,
  footingConcrete: number,
  numberOfPiers: number = 1,
  numberOfAbutments: number = 2,
  span: number = 10,
  width: number = 5
): BillOfQuantities {
  
  // Material summation
  const totalConcrete =
    (pierConcrete + pierBaseConcrete) * numberOfPiers +
    abutmentConcrete * numberOfAbutments +
    footingConcrete * numberOfPiers +
    slabConcrete;
  
  const totalSteel =
    pierSteel * numberOfPiers +
    abutmentSteel * numberOfAbutments +
    (footingConcrete * 0.01 * 7850) * numberOfPiers; // ~1% steel in footings
  
  // Calculate excavation & backfill (based on geometry)
  const excavation = span * width * 2.5; // m³ - depth typically 2.5m
  const backfill = span * width * 2.0; // m³ - backfill depth
  
  // Cost assumptions (Indian rates as of 2024)
  const concreteRate = getConcreteRate('M30'); // Rs/m³
  const steelRate = getSteelRate('Fe500'); // Rs/kg
  
  const pccCost = totalConcrete * 0.2 * 5000;
  const rccCost = totalConcrete * 0.8 * concreteRate;
  const steelCost = totalSteel * steelRate;
  
  const totalCost = pccCost + rccCost + steelCost;
  
  return {
    excavation,
    backfill,
    
    pccGrade: {
      quantity: totalConcrete * 0.2,
      rate: 5000,
      cost: pccCost
    },
    
    rccGrade: {
      quantity: totalConcrete * 0.8,
      rate: concreteRate,
      cost: rccCost
    },
    
    steelQuantity: totalSteel,
    steelRate,
    steelCost,
    
    totalCost,
    costPerMeterSpan: span > 0 ? totalCost / span : 0
  };
}

/**
 * Determine overall compliance status
 */
export function determineOverallStatus(output: CompleteDesignOutput): {
  status: 'COMPLIANT' | 'REVIEW_REQUIRED' | 'NON_COMPLIANT';
  criticalIssues: string[];
  warnings: string[];
} {
  
  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  
  // Check hydraulics
  if (output.hydraulics.froudeNumber > 1.2) {
    warnings.push('Froude number indicates supercritical flow - may increase scour risk');
  }
  
  // Check pier stability
  if (output.pier.status === 'CRITICAL') {
    criticalIssues.push(`Pier Design: ${output.pier.remarks}`);
  } else if (output.pier.status === 'WARNING') {
    warnings.push(`Pier Design: ${output.pier.remarks}`);
  }
  
  // Check abutment stability
  if (output.abutmentType1.status === 'CRITICAL') {
    criticalIssues.push(`Abutment Design: ${output.abutmentType1.remarks}`);
  } else if (output.abutmentType1.status === 'WARNING') {
    warnings.push(`Abutment Design: ${output.abutmentType1.remarks}`);
  }
  
  // Check slab design
  if (output.slab.status === 'CRITICAL') {
    criticalIssues.push(`Slab Design: ${output.slab.remarks}`);
  } else if (output.slab.status === 'WARNING') {
    warnings.push(`Slab Design: ${output.slab.remarks}`);
  }
  
  // Check footing
  if (output.footing.status === 'CRITICAL') {
    criticalIssues.push(`Footing Design: ${output.footing.remarks}`);
  } else if (output.footing.status === 'WARNING') {
    warnings.push(`Footing Design: ${output.footing.remarks}`);
  }
  
  const status = criticalIssues.length > 0 
    ? 'NON_COMPLIANT'
    : warnings.length > 0
      ? 'REVIEW_REQUIRED'
      : 'COMPLIANT';
  
  return { status, criticalIssues, warnings };
}

/**
 * MAIN ORCHESTRATOR - Execute all calculations in sequence
 */
export function executeCompleteDesign(inputs: DesignInput): CompleteDesignOutput {
  
  // Validate input
  if (!inputs.span || !inputs.width || !inputs.discharge) {
    throw new Error('Invalid input parameters');
  }
  
  // Normalize inputs - convert grades to numeric values if needed
  const normalizedInputs = {
    ...inputs,
    fck: inputs.fck || getConcreteStrength(inputs.concreteGrade),
    fy: inputs.fy || getSteelStrength(inputs.steelGrade),
    numberOfLanes: inputs.lanes
  };
  
  // Phase 1: Hydraulics (no dependencies)
  const hydraulics = calculateHydraulics(normalizedInputs);
  
  // Phase 2: Structural design (depends on hydraulics)
  const pier = calculatePierDesign(normalizedInputs, hydraulics);
  const abutmentType1 = calculateAbutmentType1(normalizedInputs, hydraulics);
  
  // Phase 3: Slab design
  const slab = calculateSlabDesign(normalizedInputs, inputs.span);
  
  // Phase 4: Footing (depends on pier)
  const footing = calculateFootingDesign(normalizedInputs, pier.pierConcrete);
  
  // Phase 5: Steel design (simplified)
  const steel = [
    {
      pierId: 1,
      steelGrade: normalizedInputs.fy!,
      mainBars: {
        diameter: 20,
        spacing: 150,
        count: 12,
        quantity: pier.pierSteel
      },
      stirrups: {
        diameter: 8,
        spacing: 200,
        quantity: pier.pierSteel * 0.3
      },
      totalQuantity: pier.pierSteel,
      totalCost: pier.pierSteel * normalizedInputs.fy! * 0.001
    }
  ];
  
  // Phase 6: Load cases
  const loadCases = generateLoadCaseAnalysis(normalizedInputs, hydraulics, pier);
  
  // Phase 7: Bill of Quantities
  const boq = calculateBOQ(
    pier.pierConcrete,
    pier.baseConcrete,
    pier.pierSteel,
    abutmentType1.concrete,
    abutmentType1.steel,
    100,
    footing.concrete,
    pier.numberOfPiers,
    2,
    inputs.span,
    inputs.width
  );
  
  // Compile complete output
  const output: CompleteDesignOutput = {
    projectInfo: {
      span: inputs.span,
      width: inputs.width,
      discharge: inputs.discharge,
      floodLevel: inputs.floodLevel,
      bedLevel: inputs.bedLevel,
      flowDepth: hydraulics.flowDepth
    },
    hydraulics,
    pier,
    abutmentType1,
    slab,
    footing,
    steel,
    loadCases,
    boq,
    overallStatus: 'COMPLIANT',
    criticalIssues: [],
    warnings: []
  };
  
  // Determine final compliance status
  const complianceStatus = determineOverallStatus(output);
  output.overallStatus = complianceStatus.status;
  output.criticalIssues = complianceStatus.criticalIssues;
  output.warnings = complianceStatus.warnings;
  
  return output;
}

/**
 * Helper: Get design summary for quick review
 */
export function getDesignSummary(output: CompleteDesignOutput): Record<string, any> {
  return {
    projectInfo: output.projectInfo,
    hydraulics: {
      flowDepth: output.hydraulics.flowDepth.toFixed(2),
      velocity: output.hydraulics.velocity.toFixed(2),
      afflux: output.hydraulics.afflux.toFixed(3),
      designWaterLevel: output.hydraulics.designWaterLevel.toFixed(2),
      froudeNumber: output.hydraulics.froudeNumber.toFixed(2)
    },
    pier: {
      numberOfPiers: output.pier.numberOfPiers,
      status: output.pier.status,
      slidingFOS: output.pier.slidingFOS.toFixed(2),
      overturnFOS: output.pier.overturnFOS.toFixed(2),
      bearingFOS: output.pier.bearingFOS.toFixed(2)
    },
    abutment: {
      status: output.abutmentType1.status,
      slidingFOS: output.abutmentType1.slidingFOS.toFixed(2),
      overturnFOS: output.abutmentType1.overturnFOS.toFixed(2),
      bearingFOS: output.abutmentType1.bearingFOS.toFixed(2)
    },
    boq: {
      totalCost: `Rs ${output.boq.totalCost.toLocaleString()}`,
      costPerMeter: `Rs ${output.boq.costPerMeterSpan.toLocaleString()}`
    },
    overallStatus: output.overallStatus,
    criticalIssues: output.criticalIssues,
    warnings: output.warnings
  };
}
