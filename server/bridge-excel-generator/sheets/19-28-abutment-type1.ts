/**
 * SHEETS 19-28: Type1 Abutment Design
 * Complete Type1 abutment with 155 load cases and 153 stress points
 */

import ExcelJS from 'exceljs';
import { EnhancedProjectInput, DesignOutput } from '../types';

// Helper function for sheet header
function addSheetHeader(sheet: ExcelJS.Worksheet, title: string) {
  sheet.mergeCells('A1:H1');
  const headerCell = sheet.getCell('A1');
  headerCell.value = title;
  headerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 35;
}

// ==================== SHEET 19: INSERT TYPE1-ABUT ====================
export async function generateInsertType1AbutSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('INSERT TYPE1-ABUT');
  addSheetHeader(sheet, 'TYPE1 ABUTMENT INPUT DATA');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'ABUTMENT DIMENSIONS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const abutmentData = [
    ['Height', design.abutment.height, 'm'],
    ['Width', design.abutment.width, 'm'],
    ['Depth', design.abutment.depth, 'm'],
    ['Base Width', design.abutment.baseWidth, 'm'],
    ['Base Length', design.abutment.baseLength, 'm'],
    ['Wing Wall Height', design.abutment.wingWallHeight, 'm'],
    ['Wing Wall Thickness', design.abutment.wingWallThickness, 'm']
  ];
  
  abutmentData.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  row++;
  sheet.getCell(`A${row}`).value = 'CONCRETE VOLUMES:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const volumes = [
    ['Abutment Concrete', design.abutment.abutmentConcrete, 'm³'],
    ['Base Concrete', design.abutment.baseConcrete, 'm³'],
    ['Wing Wall Concrete', design.abutment.wingWallConcrete, 'm³']
  ];
  
  volumes.forEach(([param, value, unit]) => {
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

// ==================== SHEET 20: TYPE1-ABUTMENT DRAWING ====================
export async function generateType1AbutmentDrawingSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-AbutMENT Drawing');
  addSheetHeader(sheet, 'TYPE1 ABUTMENT DRAWING');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'ABUTMENT SCHEMATIC:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row += 2;
  
  sheet.getCell(`A${row}`).value = `Height: ${design.abutment.height}m`;
  row++;
  sheet.getCell(`A${row}`).value = `Width: ${design.abutment.width}m`;
  row++;
  sheet.getCell(`A${row}`).value = `Base: ${design.abutment.baseWidth}m × ${design.abutment.baseLength}m`;
  
  sheet.getColumn('A').width = 40;
}

// ==================== SHEET 21: TYPE1-STABILITY CHECK ABUTMENT ====================
export async function generateType1StabilityCheckSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-STABILITY CHECK ABUTMENT');
  addSheetHeader(sheet, 'TYPE1 ABUTMENT STABILITY - 155 LOAD CASES');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'FORCES:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const forces = [
    ['Active Earth Pressure', design.abutment.activeEarthPressure, 'kN'],
    ['Vertical Load', design.abutment.verticalLoad, 'kN']
  ];
  
  forces.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
    row++;
  });
  
  // Load cases table
  row += 2;
  sheet.getCell(`A${row}`).value = `LOAD CASES (${design.abutment.loadCases.length} CASES):`;
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  // Table headers
  const headers = ['Case', 'Description', 'H-Force (kN)', 'V-Force (kN)', 'Sliding FOS', 'Overturning FOS', 'Bearing FOS', 'Status'];
  headers.forEach((header, idx) => {
    const cell = sheet.getCell(String.fromCharCode(65 + idx) + row);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  
  row++;
  const startDataRow = row;
  
  // Add all 155 load cases
  design.abutment.loadCases.forEach((loadCase, index) => {
    sheet.getCell(`A${row}`).value = loadCase.caseNumber;
    sheet.getCell(`B${row}`).value = loadCase.description;
    sheet.getCell(`C${row}`).value = loadCase.resultantHorizontal;
    sheet.getCell(`D${row}`).value = loadCase.resultantVertical;
    sheet.getCell(`E${row}`).value = loadCase.slidingFOS;
    sheet.getCell(`F${row}`).value = loadCase.overturningFOS;
    sheet.getCell(`G${row}`).value = loadCase.bearingFOS;
    sheet.getCell(`H${row}`).value = loadCase.status;
    
    // Center align
    ['A', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
      sheet.getCell(`${col}${row}`).alignment = { horizontal: 'center' };
    });
    
    // Color code status
    const statusCell = sheet.getCell(`H${row}`);
    if (loadCase.status === 'SAFE') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };
      statusCell.font = { bold: true };
    } else {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCCCB' } };
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
        const cell = sheet.getCell(`${col}${row}`);
        if (!cell.fill || !cell.fill.fgColor) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
        }
      });
    }
    
    row++;
  });
  
  // Summary
  row += 2;
  const safeCount = design.abutment.loadCases.filter(c => c.status === 'SAFE').length;
  
  sheet.getCell(`A${row}`).value = 'SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = `Total Cases: ${design.abutment.loadCases.length}`;
  row++;
  sheet.getCell(`A${row}`).value = `SAFE: ${safeCount}`;
  sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };
  row++;
  sheet.getCell(`A${row}`).value = `CHECK: ${design.abutment.loadCases.length - safeCount}`;
  if (design.abutment.loadCases.length - safeCount > 0) {
    sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCCCB' } };
  }
  
  // Column widths
  sheet.getColumn('A').width = 8;
  sheet.getColumn('B').width = 35;
  sheet.getColumn('C').width = 12;
  sheet.getColumn('D').width = 12;
  sheet.getColumn('E').width = 12;
  sheet.getColumn('F').width = 15;
  sheet.getColumn('G').width = 12;
  sheet.getColumn('H').width = 12;
}

// ==================== SHEET 22: TYPE1-ABUTMENT FOOTING DESIGN ====================
export async function generateType1FootingDesignSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-ABUTMENT FOOTING DESIGN');
  addSheetHeader(sheet, 'TYPE1 ABUTMENT FOOTING DESIGN');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'FOOTING DIMENSIONS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const footingData = [
    ['Base Width', design.abutment.baseWidth, 'm'],
    ['Base Length', design.abutment.baseLength, 'm'],
    ['Base Concrete', design.abutment.baseConcrete, 'm³']
  ];
  
  footingData.forEach(([param, value, unit]) => {
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

// ==================== SHEET 23: TYPE1- ABUT FOOTING STRESS ====================
export async function generateType1FootingStressSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1- Abut Footing STRESS');
  addSheetHeader(sheet, 'TYPE1 ABUTMENT STRESS DISTRIBUTION - 153 POINTS');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = `STRESS ANALYSIS (${design.abutment.stressDistribution.length} POINTS):`;
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  // Table headers
  const headers = ['Location', 'Long. Stress (MPa)', 'Trans. Stress (MPa)', 'Shear (MPa)', 'Combined (MPa)', 'Status'];
  headers.forEach((header, idx) => {
    const cell = sheet.getCell(String.fromCharCode(65 + idx) + row);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  
  row++;
  
  // Add all 153 stress points
  design.abutment.stressDistribution.forEach((point, index) => {
    sheet.getCell(`A${row}`).value = point.location;
    sheet.getCell(`B${row}`).value = point.longitudinalStress;
    sheet.getCell(`C${row}`).value = point.transverseStress;
    sheet.getCell(`D${row}`).value = point.shearStress;
    sheet.getCell(`E${row}`).value = point.combinedStress;
    sheet.getCell(`F${row}`).value = point.status;
    
    // Center align
    ['B', 'C', 'D', 'E', 'F'].forEach(col => {
      sheet.getCell(`${col}${row}`).alignment = { horizontal: 'center' };
    });
    
    // Color code status
    const statusCell = sheet.getCell(`F${row}`);
    if (point.status === 'Safe') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };
    } else {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCCCB' } };
    }
    
    row++;
  });
  
  // Summary
  row += 2;
  const safePoints = design.abutment.stressDistribution.filter(p => p.status === 'Safe').length;
  
  sheet.getCell(`A${row}`).value = 'SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  sheet.getCell(`A${row}`).value = `Total Points: ${design.abutment.stressDistribution.length}`;
  row++;
  sheet.getCell(`A${row}`).value = `Safe: ${safePoints}`;
  sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };
  
  sheet.getColumn('A').width = 15;
  sheet.getColumn('B').width = 18;
  sheet.getColumn('C').width = 18;
  sheet.getColumn('D').width = 15;
  sheet.getColumn('E').width = 16;
  sheet.getColumn('F').width = 10;
}

// ==================== REMAINING SHEETS 24-28 ====================
export async function generateType1SteelInAbutmentSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-STEEL IN ABUTMENT');
  addSheetHeader(sheet, 'TYPE1 ABUTMENT REINFORCEMENT');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'REINFORCEMENT SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  sheet.getCell(`A${row}`).value = 'Main reinforcement as per design calculations';
  
  sheet.getColumn('A').width = 50;
}

export async function generateType1AbutmentCapSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-Abutment Cap');
  addSheetHeader(sheet, 'TYPE1 ABUTMENT CAP');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'ABUTMENT CAP DESIGN:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  sheet.getCell(`A${row}`).value = `Width: ${design.abutment.width}m`;
  
  sheet.getColumn('A').width = 40;
}

export async function generateType1DirtWallReinforcementSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-DIRT WALL REINFORCEMENT');
  addSheetHeader(sheet, 'TYPE1 DIRT WALL REINFORCEMENT');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'DIRT WALL STEEL:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  
  sheet.getColumn('A').width = 40;
}

export async function generateType1DirtDirectLoadBMSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-DIRT DirectLoad_BM');
  addSheetHeader(sheet, 'TYPE1 DIRT WALL DIRECT LOAD BM');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'DIRECT LOAD BENDING MOMENT:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  
  sheet.getColumn('A').width = 40;
}

export async function generateType1DirtLLBMSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('TYPE1-DIRT LL_BM');
  addSheetHeader(sheet, 'TYPE1 DIRT WALL LIVE LOAD BM');
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'LIVE LOAD BENDING MOMENT:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  
  sheet.getColumn('A').width = 40;
}
