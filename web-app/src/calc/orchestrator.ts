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
  numberOfAbutments: number = 2
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
  
  // Cost assumptions (Indian rates as of 2024) - Using standard M30 concrete
  const concreteRate = getConcreteRate('M30'); // Rs/m³
  const steelRate = getSteelRate('Fe500'); // Rs/kg
  
  return {
    excavation: 150, // m³ - typical
    backfill: 100,
    
    pccGrade: {
      quantity: totalConcrete * 0.2,
      rate: 5000,
      cost: totalConcrete * 0.2 * 5000
    },
    
    rccGrade: {
      quantity: totalConcrete * 0.8,
      rate: concreteRate,
      cost: totalConcrete * 0.8 * concreteRate
    },
    
    steelQuantity: totalSteel,
    steelRate,
    steelCost: totalSteel * steelRate,
    
    totalCost:
      (totalConcrete * 0.2 * 5000) +
      (totalConcrete * 0.8 * concreteRate) +
      (totalSteel * steelRate),
    
    costPerMeterSpan: 0 // To be calculated
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
  
  // Phase 1: Hydraulics (no dependencies)
  const hydraulics = calculateHydraulics(inputs);
  
  // Phase 2: Structural design (depends on hydraulics)
  const pier = calculatePierDesign(inputs, hydraulics);
  const abutmentType1 = calculateAbutmentType1(inputs, hydraulics);
  
  // Phase 3: Slab design
  const slab = calculateSlabDesign(inputs, inputs.span);
  
  // Phase 4: Footing (depends on pier)
  const footing = calculateFootingDesign(inputs, pier.pierConcrete);
  
  // Phase 5: Steel design (simplified)
  const steel = [
    {
      pierId: 1,
      steelGrade: inputs.fy,
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
      totalCost: pier.pierSteel * inputs.fy * 0.001
    }
  ];
  
  // Phase 6: Load cases
  const loadCases = generateLoadCaseAnalysis(inputs, hydraulics, pier);
  
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
    2
  );
  
  boq.costPerMeterSpan = boq.totalCost / inputs.span;
  
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
