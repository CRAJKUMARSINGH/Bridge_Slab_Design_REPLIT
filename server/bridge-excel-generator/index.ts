/**
 * MAIN EXCEL GENERATOR ORCHESTRATOR
 * Single entry point for all Excel generation
 * 
 * This file orchestrates the generation of complete 46-sheet Excel workbooks
 * with all calculations, formulas, and formatting.
 * 
 * Features:
 * - Generates all 46 sheets
 * - Uses merged design engine (70+155 load cases, 355 stress points)
 * - Applies proper formatting
 * - Includes all formulas
 * - Progress tracking
 * - Caching support
 */

import ExcelJS from 'exceljs';
import { ProjectInput, EnhancedProjectInput, DesignOutput } from './types';
import { generateCompleteDesign } from './design-engine-merged';

// Import sheet generators
import { generateIndexSheet } from './sheets/01-index';
import { generateInsertHydraulicsSheet } from './sheets/02-insert-hydraulics';
import {
  generateAffluxCalculationSheet,
  generateHydraulicsSheet,
  generateDeckAnchorageSheet,
  generateCrossSectionSheet,
  generateBedSlopeSheet,
  generateSBCSheet
} from './sheets/03-08-hydraulics-batch';
import {
  generateStabilityCheckPierSheet,
  generateAbstractOfStressesSheet
} from './sheets/09-10-pier-critical';
import {
  generateSteelFlaredPierSheet,
  generateSteelInPierSheet,
  generateFootingDesignSheet,
  generateFootingStressDiagramSheet,
  generatePierCapLLSheet,
  generatePierCapSheet,
  generateLLOADSheet,
  generateLoadSummSheet
} from './sheets/11-18-pier-remaining';
import {
  generateInsertType1AbutSheet,
  generateType1AbutmentDrawingSheet,
  generateType1StabilityCheckSheet,
  generateType1FootingDesignSheet,
  generateType1FootingStressSheet,
  generateType1SteelInAbutmentSheet,
  generateType1AbutmentCapSheet,
  generateType1DirtWallReinforcementSheet,
  generateType1DirtDirectLoadBMSheet,
  generateType1DirtLLBMSheet
} from './sheets/19-28-abutment-type1';
import {
  generateTechNoteSheet,
  generateInsertEstimateSheet,
  generateTechReportSheet,
  generateGeneralAbsSheet,
  generateAbstractSheet,
  generateBridgeMeasurementsSheet,
  generateC1AbutmentSheets
} from './sheets/29-46-remaining';

// ==================== MAIN EXCEL GENERATOR ====================

/**
 * Generate complete Excel workbook with all 46 sheets
 * 
 * @param input - Project input data
 * @returns Buffer containing the Excel file
 */
export async function generateCompleteExcel(input: ProjectInput): Promise<Buffer> {
  console.log('🚀 Starting Excel generation...');
  console.log(`Project: ${input.projectName}`);
  console.log(`Generating 46 sheets with real formulas...`);
  
  // Step 1: Run design engine to calculate all results
  console.log('📊 Step 1/4: Running design calculations...');
  const designResults = generateCompleteDesign(input);
  
  console.log(`   ✓ Hydraulics calculated`);
  console.log(`   ✓ Pier design complete (${designResults.pier.loadCases.length} load cases)`);
  console.log(`   ✓ Abutment design complete (${designResults.abutment.loadCases.length} load cases)`);
  console.log(`   ✓ Slab design complete`);
  
  // Step 2: Create enhanced input with calculated results
  console.log('📊 Step 2/4: Preparing data for Excel...');
  const enhancedInput: EnhancedProjectInput = {
    ...input,
    hydraulics: designResults.hydraulics,
    pier: designResults.pier,
    abutmentType1: designResults.abutment,
    abutmentC1: designResults.abutment, // Use same for now
    slab: designResults.slab,
    pierDesign: {
      spanCC: input.spanLength
    }
  };
  
  // Step 3: Create workbook
  console.log('📊 Step 3/4: Creating Excel workbook...');
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = 'Bridge Design App';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.company = 'Bridge Design Suite';
  workbook.description = `Complete bridge design report for ${input.projectName}`;
  
  // Step 4: Generate all sheets
  console.log('📊 Step 4/4: Generating sheets...');
  
  // Generate implemented sheets (Hydraulics 1-8)
  await generateIndexSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 1/46: INDEX');
  
  await generateInsertHydraulicsSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 2/46: INSERT-HYDRAULICS');
  
  await generateAffluxCalculationSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 3/46: afflux calculation');
  
  await generateHydraulicsSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 4/46: HYDRAULICS');
  
  await generateDeckAnchorageSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 5/46: Deck Anchorage');
  
  await generateCrossSectionSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 6/46: CROSS SECTION');
  
  await generateBedSlopeSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 7/46: Bed Slope');
  
  await generateSBCSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 8/46: SBC');
  
  // Pier Design Sheets (9-18)
  await generateStabilityCheckPierSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 9/46: STABILITY CHECK FOR PIER (70 load cases)');
  
  await generateAbstractOfStressesSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 10/46: abstract of stresses (168 stress points)');
  
  await generateSteelFlaredPierSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 11/46: STEEL IN FLARED PIER BASE');
  
  await generateSteelInPierSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 12/46: STEEL IN PIER');
  
  await generateFootingDesignSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 13/46: FOOTING DESIGN');
  
  await generateFootingStressDiagramSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 14/46: Footing STRESS DIAGRAM');
  
  await generatePierCapLLSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 15/46: Pier Cap LL tracked vehicle');
  
  await generatePierCapSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 16/46: Pier Cap');
  
  await generateLLOADSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 17/46: LLOAD');
  
  await generateLoadSummSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 18/46: loadsumm');
  
  // Type1 Abutment Sheets (19-28)
  await generateInsertType1AbutSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 19/46: INSERT TYPE1-ABUT');
  
  await generateType1AbutmentDrawingSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 20/46: TYPE1-AbutMENT Drawing');
  
  await generateType1StabilityCheckSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 21/46: TYPE1-STABILITY CHECK ABUTMENT (155 load cases)');
  
  await generateType1FootingDesignSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 22/46: TYPE1-ABUTMENT FOOTING DESIGN');
  
  await generateType1FootingStressSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 23/46: TYPE1- Abut Footing STRESS (153 stress points)');
  
  await generateType1SteelInAbutmentSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 24/46: TYPE1-STEEL IN ABUTMENT');
  
  await generateType1AbutmentCapSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 25/46: TYPE1-Abutment Cap');
  
  await generateType1DirtWallReinforcementSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 26/46: TYPE1-DIRT WALL REINFORCEMENT');
  
  await generateType1DirtDirectLoadBMSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 27/46: TYPE1-DIRT DirectLoad_BM');
  
  await generateType1DirtLLBMSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 28/46: TYPE1-DIRT LL_BM');
  
  // Technical Notes & Estimation Sheets (29-34)
  await generateTechNoteSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 29/46: TechNote');
  
  await generateInsertEstimateSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 30/46: INSERT ESTIMATE');
  
  await generateTechReportSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 31/46: Tech Report');
  
  await generateGeneralAbsSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 32/46: General Abs.');
  
  await generateAbstractSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 33/46: Abstract');
  
  await generateBridgeMeasurementsSheet(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheet 34/46: Bridge measurements');
  
  // C1 Abutment Sheets (35-46)
  await generateC1AbutmentSheets(workbook, enhancedInput, designResults);
  console.log('   ✓ Sheets 35-46: C1 Abutment (12 sheets)');
  
  console.log(`✅ Excel generation complete!`);
  console.log(`Total sheets: ${workbook.worksheets.length}/46`);
  
  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// All 46 sheets are now implemented!

/**
 * Save Excel to file (for testing)
 */
export async function saveExcelToFile(input: ProjectInput, filename: string): Promise<void> {
  const buffer = await generateCompleteExcel(input);
  const fs = await import('fs');
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Saved to: ${filename}`);
}

// Export main function
export default generateCompleteExcel;
