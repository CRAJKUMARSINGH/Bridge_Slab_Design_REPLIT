/**
 * SHEETS 29-46: Remaining Sheets
 * Technical notes, estimation, reports, and C1 abutment
 */

import ExcelJS from 'exceljs';
import { EnhancedProjectInput, DesignOutput } from '../types';

// Helper function for sheet header
function addSheetHeader(sheet: ExcelJS.Worksheet, title: string) {
  sheet.mergeCells('A1:E1');
  const headerCell = sheet.getCell('A1');
  headerCell.value = title;
  headerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;
}

// ==================== SHEET 29: TECHNOTE ====================
export async function generateTechNoteSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TechNote');
  addSheetHeader(sheet, 'TECHNICAL NOTES');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'DESIGN STANDARDS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const standards = [
    'IRC:6-2016 - Loads & Stresses',
    'IRC:112-2015 - Concrete Bridge Design',
    'IRC:78-1983 - Foundations & Substructure',
    'IS:7784-1975 - Afflux Calculation'
  ];
  
  standards.forEach(std => {
    sheet.getCell(`A${row}`).value = `• ${std}`;
    row++;
  });
  
  row++;
  sheet.getCell(`A${row}`).value = 'DESIGN SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = `Total Load Cases Analyzed: ${design.pier.loadCases.length + design.abutment.loadCases.length}`;
  row++;
  sheet.getCell(`A${row}`).value = `Total Stress Points Evaluated: ${design.pier.stressDistribution.length + design.abutment.stressDistribution.length + design.slab.stressDistribution.length}`;
  
  sheet.getColumn('A').width = 60;
}

// ==================== SHEET 30: INSERT ESTIMATE ====================
export async function generateInsertEstimateSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('INSERT ESTIMATE');
  addSheetHeader(sheet, 'ESTIMATION INPUT');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'QUANTITIES:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const quantities = [
    ['Total Concrete', design.quantities.totalConcrete, 'm³'],
    ['Total Steel', design.quantities.totalSteel, 'tonnes'],
    ['Formwork', design.quantities.formwork, 'm²']
  ];
  
  quantities.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
    row++;
  });
  
  sheet.getColumn('A').width = 30;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 31: TECH REPORT ====================
export async function generateTechReportSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Tech Report');
  addSheetHeader(sheet, 'TECHNICAL REPORT');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'PROJECT SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = `Project: ${input.projectName}`;
  row++;
  sheet.getCell(`A${row}`).value = `Location: ${input.location}`;
  row++;
  sheet.getCell(`A${row}`).value = `Span: ${input.spanLength}m`;
  row++;
  sheet.getCell(`A${row}`).value = `Width: ${input.bridgeWidth}m`;
  
  row += 2;
  sheet.getCell(`A${row}`).value = 'DESIGN VERIFICATION:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const pierSafe = design.pier.loadCases.filter(c => c.status === 'SAFE').length;
  const abutmentSafe = design.abutment.loadCases.filter(c => c.status === 'SAFE').length;
  
  sheet.getCell(`A${row}`).value = `Pier: ${pierSafe}/${design.pier.loadCases.length} cases SAFE`;
  row++;
  sheet.getCell(`A${row}`).value = `Abutment: ${abutmentSafe}/${design.abutment.loadCases.length} cases SAFE`;
  
  sheet.getColumn('A').width = 50;
}

// ==================== SHEET 32: GENERAL ABS ====================
export async function generateGeneralAbsSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('General Abs.');
  addSheetHeader(sheet, 'GENERAL ABSTRACT');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'MATERIAL SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = 'Concrete';
  sheet.getCell(`B${row}`).value = design.quantities.totalConcrete;
  sheet.getCell(`C${row}`).value = 'm³';
  row++;
  
  sheet.getCell(`A${row}`).value = 'Steel';
  sheet.getCell(`B${row}`).value = design.quantities.totalSteel;
  sheet.getCell(`C${row}`).value = 'tonnes';
  
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 33: ABSTRACT ====================
export async function generateAbstractSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Abstract');
  addSheetHeader(sheet, 'COST ABSTRACT');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'COST ESTIMATION:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  // Sample rates
  const concreteRate = 8000; // ₹/m³
  const steelRate = 65000; // ₹/tonne
  
  const concreteCost = design.quantities.totalConcrete * concreteRate;
  const steelCost = design.quantities.totalSteel * steelRate;
  const totalCost = concreteCost + steelCost;
  
  sheet.getCell(`A${row}`).value = 'Concrete Cost';
  sheet.getCell(`B${row}`).value = concreteCost.toFixed(2);
  sheet.getCell(`C${row}`).value = '₹';
  row++;
  
  sheet.getCell(`A${row}`).value = 'Steel Cost';
  sheet.getCell(`B${row}`).value = steelCost.toFixed(2);
  sheet.getCell(`C${row}`).value = '₹';
  row++;
  
  sheet.getCell(`A${row}`).value = 'Total Cost';
  sheet.getCell(`B${row}`).value = totalCost.toFixed(2);
  sheet.getCell(`C${row}`).value = '₹';
  sheet.getCell(`A${row}`).font = { bold: true };
  sheet.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
  
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 20;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 34: BRIDGE MEASUREMENTS ====================
export async function generateBridgeMeasurementsSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Bridge measurements');
  addSheetHeader(sheet, 'BRIDGE MEASUREMENTS');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'BRIDGE DIMENSIONS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const measurements = [
    ['Total Length', input.spanLength * input.numberOfSpans, 'm'],
    ['Width', input.bridgeWidth, 'm'],
    ['Number of Spans', input.numberOfSpans, '-'],
    ['Number of Piers', design.pier.numberOfPiers, '-'],
    ['Pier Height', design.pier.depth, 'm'],
    ['Abutment Height', design.abutment.height, 'm']
  ];
  
  measurements.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  sheet.getColumn('A').width = 30;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEETS 35-46: C1 ABUTMENT (PLACEHOLDERS) ====================
export async function generateC1AbutmentSheets(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const c1Sheets = [
    'INSERT C1-ABUT',
    'C1-AbutMENT Drawing',
    'C1-STABILITY CHECK ABUTMENT',
    'C1-ABUTMENT FOOTING DESIGN',
    'C1- Abut Footing STRESS DIAGRAM',
    'CAN RETURN FOOTING DESIGN',
    'STEEL IN CANT ABUTMENT',
    'STEEL IN CANT RETURNS',
    'C1-Abutment Cap',
    'C1-DIRT WALL REINFORCEMENT',
    'C1-DIRT DirectLoad_BM',
    'C1-DIRT LL_BM'
  ];
  
  c1Sheets.forEach(sheetName => {
    const sheet = workbook.addWorksheet(sheetName);
    addSheetHeader(sheet, sheetName.toUpperCase());
    
    let row = 3;
    sheet.getCell(`A${row}`).value = 'C1 ABUTMENT (CANTILEVER TYPE):';
    sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
    row++;
    
    sheet.getCell(`A${row}`).value = 'Similar to Type1 abutment with cantilever configuration';
    row++;
    sheet.getCell(`A${row}`).value = 'Design parameters same as Type1';
    row++;
    sheet.getCell(`A${row}`).value = `Load Cases: ${design.abutment.loadCases.length}`;
    row++;
    sheet.getCell(`A${row}`).value = `Stress Points: ${design.abutment.stressDistribution.length}`;
    
    sheet.getColumn('A').width = 50;
  });
}
