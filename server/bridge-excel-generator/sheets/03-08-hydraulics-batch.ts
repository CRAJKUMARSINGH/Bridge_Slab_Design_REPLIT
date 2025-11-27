/**
 * SHEETS 03-08: Hydraulics Batch
 * Remaining hydraulics sheets (3-8)
 */

import ExcelJS from 'exceljs';
import { EnhancedProjectInput, DesignOutput } from '../types';

// ==================== SHEET 03: AFFLUX CALCULATION ====================
export async function generateAffluxCalculationSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('afflux calculation');
  
  // Header
  sheet.mergeCells('A1:E1');
  sheet.getCell('A1').value = 'AFFLUX CALCULATION (LACEY\'S METHOD)';
  sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;
  
  // Input data
  let row = 3;
  sheet.getCell(`A${row}`).value = 'INPUT DATA:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const inputs = [
    ['Velocity (V)', design.hydraulics.velocity, 'm/s'],
    ['Lacey\'s Silt Factor (m)', design.hydraulics.laceysSiltFactor, '-'],
    ['HFL', input.hfl, 'm MSL']
  ];
  
  inputs.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  // Formula
  row++;
  sheet.getCell(`A${row}`).value = 'FORMULA:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  sheet.getCell(`A${row}`).value = 'Afflux = V² / (17.9 × √m)';
  sheet.getCell(`A${row}`).font = { italic: true };
  
  // Calculation
  row += 2;
  sheet.getCell(`A${row}`).value = 'CALCULATION:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const v = design.hydraulics.velocity;
  const m = design.hydraulics.laceysSiltFactor;
  const afflux = design.hydraulics.afflux;
  
  sheet.getCell(`A${row}`).value = `Afflux = ${v}² / (17.9 × √${m})`;
  row++;
  sheet.getCell(`A${row}`).value = `Afflux = ${(v*v).toFixed(3)} / ${(17.9 * Math.sqrt(m)).toFixed(3)}`;
  row++;
  sheet.getCell(`A${row}`).value = `Afflux = ${afflux} m`;
  sheet.getCell(`A${row}`).font = { bold: true };
  sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
  
  // Result
  row += 2;
  sheet.getCell(`A${row}`).value = 'DESIGN WATER LEVEL:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  sheet.getCell(`A${row}`).value = `DWL = HFL + Afflux = ${input.hfl} + ${afflux} = ${design.hydraulics.designWaterLevel} m MSL`;
  sheet.getCell(`A${row}`).font = { bold: true };
  sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };
  
  sheet.getColumn('A').width = 40;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 04: HYDRAULICS ====================
export async function generateHydraulicsSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('HYDRAULICS');
  
  // Header
  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').value = 'HYDRAULICS ANALYSIS (MANNING\'S EQUATION)';
  sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  
  let row = 3;
  
  // Manning's equation
  sheet.getCell(`A${row}`).value = 'MANNING\'S EQUATION:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  sheet.getCell(`A${row}`).value = 'V = (1/n) × R^(2/3) × √S';
  sheet.getCell(`A${row}`).font = { italic: true };
  
  row += 2;
  const results = [
    ['Velocity (V)', design.hydraulics.velocity, 'm/s'],
    ['Cross-sectional Area', design.hydraulics.crossSectionalArea, 'm²'],
    ['Froude Number', design.hydraulics.froudeNumber, '-'],
    ['Flow Type', design.hydraulics.froudeNumber < 1 ? 'Subcritical' : 'Supercritical', '-'],
    ['Contraction', design.hydraulics.contraction, 'm']
  ];
  
  results.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  // Cross-section data
  row += 2;
  sheet.getCell(`A${row}`).value = 'CROSS-SECTION ANALYSIS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  ['Chainage', 'Ground Level', 'Flood Depth', 'Width', 'Area', 'Velocity'].forEach((header, idx) => {
    sheet.getCell(String.fromCharCode(65 + idx) + row).value = header;
    sheet.getCell(String.fromCharCode(65 + idx) + row).font = { bold: true };
    sheet.getCell(String.fromCharCode(65 + idx) + row).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
  });
  
  row++;
  design.hydraulics.crossSectionData.slice(0, 10).forEach(point => {
    sheet.getCell(`A${row}`).value = point.chainage;
    sheet.getCell(`B${row}`).value = point.groundLevel;
    sheet.getCell(`C${row}`).value = point.floodDepth;
    sheet.getCell(`D${row}`).value = point.width;
    sheet.getCell(`E${row}`).value = point.area;
    sheet.getCell(`F${row}`).value = point.velocity;
    row++;
  });
  
  sheet.getColumn('A').width = 15;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 15;
  sheet.getColumn('D').width = 12;
  sheet.getColumn('E').width = 12;
  sheet.getColumn('F').width = 12;
}

// ==================== SHEET 05: DECK ANCHORAGE ====================
export async function generateDeckAnchorageSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Deck Anchorage');
  
  sheet.mergeCells('A1:E1');
  sheet.getCell('A1').value = 'DECK ANCHORAGE CALCULATIONS';
  sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'Uplift Force Calculation:';
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  const upliftForce = design.hydraulics.velocity * design.hydraulics.velocity * 0.5 * 9.81;
  sheet.getCell(`A${row}`).value = 'Uplift Force';
  sheet.getCell(`B${row}`).value = upliftForce.toFixed(2);
  sheet.getCell(`C${row}`).value = 'kN/m²';
  
  row += 2;
  sheet.getCell(`A${row}`).value = 'Anchorage Required:';
  sheet.getCell(`B${row}`).value = 'Yes';
  sheet.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
  
  sheet.getColumn('A').width = 30;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}

// ==================== SHEET 06: CROSS SECTION ====================
export async function generateCrossSectionSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('CROSS SECTION');
  
  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').value = 'CROSS SECTION DATA';
  sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  
  let row = 3;
  ['Chainage (m)', 'GL (m)', 'Depth (m)', 'Width (m)', 'Area (m²)', 'Velocity (m/s)'].forEach((header, idx) => {
    sheet.getCell(String.fromCharCode(65 + idx) + row).value = header;
    sheet.getCell(String.fromCharCode(65 + idx) + row).font = { bold: true };
    sheet.getCell(String.fromCharCode(65 + idx) + row).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
  });
  
  row++;
  design.hydraulics.crossSectionData.forEach(point => {
    sheet.getCell(`A${row}`).value = point.chainage;
    sheet.getCell(`B${row}`).value = point.groundLevel;
    sheet.getCell(`C${row}`).value = point.floodDepth;
    sheet.getCell(`D${row}`).value = point.width;
    sheet.getCell(`E${row}`).value = point.area;
    sheet.getCell(`F${row}`).value = point.velocity;
    row++;
  });
  
  for (let col of ['A', 'B', 'C', 'D', 'E', 'F']) {
    sheet.getColumn(col).width = 15;
  }
}

// ==================== SHEET 07: BED SLOPE ====================
export async function generateBedSlopeSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('Bed Slope');
  
  sheet.mergeCells('A1:D1');
  sheet.getCell('A1').value = 'BED SLOPE ANALYSIS';
  sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'Bed Slope:';
  sheet.getCell(`B${row}`).value = `1 in ${input.bedSlope}`;
  sheet.getCell(`A${row}`).font = { bold: true };
  
  row++;
  sheet.getCell(`A${row}`).value = 'Decimal:';
  sheet.getCell(`B${row}`).value = (1 / input.bedSlope).toFixed(6);
  sheet.getCell(`A${row}`).font = { bold: true };
  
  row += 2;
  sheet.getCell(`A${row}`).value = 'Classification:';
  const slope = 1 / input.bedSlope;
  const classification = slope > 0.01 ? 'Steep' : slope > 0.001 ? 'Moderate' : 'Mild';
  sheet.getCell(`B${row}`).value = classification;
  sheet.getCell(`A${row}`).font = { bold: true };
  
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 20;
}

// ==================== SHEET 08: SBC ====================
export async function generateSBCSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('SBC');
  
  sheet.mergeCells('A1:D1');
  sheet.getCell('A1').value = 'SAFE BEARING CAPACITY';
  sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  
  let row = 3;
  sheet.getCell(`A${row}`).value = 'Soil Parameters:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const soilData = [
    ['SBC', input.sbc, 'kPa'],
    ['Angle of Internal Friction (φ)', input.phi, '°'],
    ['Unit Weight (γ)', input.gamma, 'kN/m³']
  ];
  
  soilData.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  row += 2;
  sheet.getCell(`A${row}`).value = 'Foundation Type:';
  sheet.getCell(`B${row}`).value = input.sbc > 150 ? 'Rock' : 'Soil';
  sheet.getCell(`A${row}`).font = { bold: true };
  
  row++;
  sheet.getCell(`A${row}`).value = 'Recommended Foundation:';
  sheet.getCell(`B${row}`).value = input.sbc > 150 ? 'Shallow' : 'Deep';
  sheet.getCell(`A${row}`).font = { bold: true };
  
  sheet.getColumn('A').width = 35;
  sheet.getColumn('B').width = 15;
  sheet.getColumn('C').width = 10;
}
