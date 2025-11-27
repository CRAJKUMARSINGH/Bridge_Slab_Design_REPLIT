/**
 * SHEETS 11-18: Remaining Pier Sheets
 * Steel reinforcement, footing, and pier cap designs
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

// ==================== SHEET 11: STEEL IN FLARED PIER BASE ====================
export async function generateSteelFlaredPierSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('STEEL IN FLARED PIER BASE');
  addSheetHeader(sheet, 'STEEL IN FLARED PIER BASE');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'REINFORCEMENT DETAILS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const steelData = [
    ['Main Steel Diameter', design.pier.mainSteel.diameter, 'mm'],
    ['Main Steel Spacing', design.pier.mainSteel.spacing, 'mm c/c'],
    ['Number of Bars', design.pier.mainSteel.quantity, 'nos'],
    ['Link Steel Diameter', design.pier.linkSteel.diameter, 'mm'],
    ['Link Steel Spacing', design.pier.linkSteel.spacing, 'mm c/c'],
    ['Number of Links', design.pier.linkSteel.quantity, 'nos']
  ];
  
  steelData.forEach(([param, value, unit]) => {
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

// ==================== SHEET 12: STEEL IN PIER ====================
export async function generateSteelInPierSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('STEEL IN PIER');
  addSheetHeader(sheet, 'STEEL IN PIER');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'PIER REINFORCEMENT:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = 'Main Reinforcement:';
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  sheet.getCell(`A${row}`).value = `${design.pier.mainSteel.quantity} bars of ${design.pier.mainSteel.diameter}mm dia @ ${design.pier.mainSteel.spacing}mm c/c`;
  row += 2;
  
  sheet.getCell(`A${row}`).value = 'Link Reinforcement:';
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  sheet.getCell(`A${row}`).value = `${design.pier.linkSteel.quantity} links of ${design.pier.linkSteel.diameter}mm dia @ ${design.pier.linkSteel.spacing}mm c/c`;
  
  sheet.getColumn('A').width = 60;
}

// ==================== SHEET 13: FOOTING DESIGN ====================
export async function generateFootingDesignSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('FOOTING DESIGN');
  addSheetHeader(sheet, 'PIER FOOTING DESIGN');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'FOOTING DIMENSIONS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const footingData = [
    ['Base Width', design.pier.baseWidth, 'm'],
    ['Base Length', design.pier.baseLength, 'm'],
    ['Base Thickness', 1.0, 'm'],
    ['Base Concrete Volume', design.pier.baseConcrete, 'm³']
  ];
  
  footingData.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  row++;
  sheet.getCell(`A${row}`).value = 'BEARING PRESSURE:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const bearingPressure = (design.pier.totalHorizontalForce / (design.pier.baseWidth * design.pier.baseLength)).toFixed(2);
  sheet.getCell(`A${row}`).value = 'Bearing Pressure';
  sheet.getCell(`B${row}`).value = bearingPressure;
  sheet.getCell(`C${row}`).value = 'kPa';
  sheet.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
  
  sheet.getColumn('A').width = 30;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 14: FOOTING STRESS DIAGRAM ====================
export async function generateFootingStressDiagramSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Footing STRESS DIAGRAM');
  addSheetHeader(sheet, 'FOOTING STRESS DISTRIBUTION');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'STRESS DISTRIBUTION:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  // Generate stress distribution points
  const stressPoints = [];
  for (let i = 0; i <= 10; i++) {
    const position = i / 10;
    const stress = 180 - (60 * position); // Linear distribution from 180 to 120 kPa
    stressPoints.push([position * design.pier.baseLength, stress.toFixed(2)]);
  }
  
  sheet.getCell(`A${row}`).value = 'Position (m)';
  sheet.getCell(`B${row}`).value = 'Stress (kPa)';
  ['A', 'B'].forEach(col => {
    sheet.getCell(`${col}${row}`).font = { bold: true };
    sheet.getCell(`${col}${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
  });
  
  row++;
  stressPoints.forEach(([pos, stress]) => {
    sheet.getCell(`A${row}`).value = pos;
    sheet.getCell(`B${row}`).value = stress;
    sheet.getCell(`A${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${row}`).alignment = { horizontal: 'center' };
    row++;
  });
  
  sheet.getColumn('A').width = 15;
  sheet.getColumn('B').width = 15;
}

// ==================== SHEET 15: PIER CAP LL TRACKED VEHICLE ====================
export async function generatePierCapLLSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Pier Cap LL tracked vehicle');
  addSheetHeader(sheet, 'PIER CAP LIVE LOAD (TRACKED VEHICLE)');
  
  let row = 3;
  const loadClass = input.loadClass || 'Class A';
  const wheelLoad = loadClass === 'Class A' ? 60 : 100;
  
  sheet.getCell(`A${row}`).value = 'LIVE LOAD DATA:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = 'Load Class';
  sheet.getCell(`B${row}`).value = loadClass;
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  sheet.getCell(`A${row}`).value = 'Wheel Load';
  sheet.getCell(`B${row}`).value = wheelLoad;
  sheet.getCell(`C${row}`).value = 'kN';
  sheet.getCell(`A${row}`).font = { bold: true };
  
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 16: PIER CAP ====================
export async function generatePierCapSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Pier Cap');
  addSheetHeader(sheet, 'PIER CAP DESIGN');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'PIER CAP DIMENSIONS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const capData = [
    ['Length', design.pier.length + 0.5, 'm'],
    ['Width', design.pier.width + 0.5, 'm'],
    ['Thickness', 0.8, 'm']
  ];
  
  capData.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 17: LLOAD ====================
export async function generateLLOADSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('LLOAD');
  addSheetHeader(sheet, 'LIVE LOAD ANALYSIS');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'LIVE LOAD SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const loadClass = input.loadClass || 'Class A';
  sheet.getCell(`A${row}`).value = 'Load Class';
  sheet.getCell(`B${row}`).value = loadClass;
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  sheet.getCell(`A${row}`).value = 'Number of Lanes';
  sheet.getCell(`B${row}`).value = input.numberOfLanes || 2;
  sheet.getCell(`A${row}`).font = { bold: true };
  
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 15;
}

// ==================== SHEET 18: LOADSUMM ====================
export async function generateLoadSummSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('loadsumm');
  addSheetHeader(sheet, 'LOAD SUMMARY');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'LOAD SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const loadSummary = [
    ['Hydrostatic Force', design.pier.hydrostaticForce, 'kN'],
    ['Drag Force', design.pier.dragForce, 'kN'],
    ['Total Horizontal Force', design.pier.totalHorizontalForce, 'kN'],
    ['Dead Load (Pier)', design.pier.pierConcrete * 25, 'kN'],
    ['Dead Load (Base)', design.pier.baseConcrete * 25, 'kN']
  ];
  
  loadSummary.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = typeof value === 'number' ? value.toFixed(2) : value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
    row++;
  });
  
  sheet.getColumn('A').width = 30;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}
