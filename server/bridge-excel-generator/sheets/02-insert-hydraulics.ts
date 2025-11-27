/**
 * SHEET 02: INSERT-HYDRAULICS
 * Hydraulic input data sheet
 */

import ExcelJS from 'exceljs';
import { EnhancedProjectInput, DesignOutput } from '../types';

export async function generateInsertHydraulicsSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('INSERT- HYDRAULICS');
  
  // ==================== HEADER ====================
  sheet.mergeCells('A1:E1');
  const headerCell = sheet.getCell('A1');
  headerCell.value = 'HYDRAULIC DATA INPUT';
  headerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  headerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0066CC' }
  };
  headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;
  
  // ==================== BASIC DATA ====================
  let row = 3;
  
  sheet.getCell(`A${row}`).value = 'Parameter';
  sheet.getCell(`B${row}`).value = 'Value';
  sheet.getCell(`C${row}`).value = 'Unit';
  sheet.getCell(`D${row}`).value = 'Description';
  
  ['A', 'B', 'C', 'D'].forEach(col => {
    sheet.getCell(`${col}${row}`).font = { bold: true };
    sheet.getCell(`${col}${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  });
  
  row++;
  
  const hydraulicData = [
    { param: 'Discharge (Q)', value: input.discharge, unit: 'm³/s', desc: 'Design discharge' },
    { param: 'HFL', value: input.hfl, unit: 'm MSL', desc: 'Highest Flood Level' },
    { param: 'Bed Level', value: input.bedLevel, unit: 'm MSL', desc: 'Average bed level' },
    { param: 'Bed Slope', value: `1 in ${input.bedSlope}`, unit: '-', desc: 'Longitudinal bed slope' },
    { param: 'Manning\'s n', value: input.manningN || 0.035, unit: '-', desc: 'Rugosity coefficient' },
    { param: 'Lacey\'s Silt Factor', value: input.laceysSiltFactor || 0.78, unit: '-', desc: 'Silt factor (m)' },
    { param: 'Flow Depth', value: (input.hfl - input.bedLevel).toFixed(2), unit: 'm', desc: 'Depth of flow' }
  ];
  
  hydraulicData.forEach(item => {
    sheet.getCell(`A${row}`).value = item.param;
    sheet.getCell(`B${row}`).value = item.value;
    sheet.getCell(`C${row}`).value = item.unit;
    sheet.getCell(`D${row}`).value = item.desc;
    
    sheet.getCell(`A${row}`).font = { bold: true };
    
    row++;
  });
  
  // ==================== CROSS-SECTION DATA ====================
  row += 2;
  sheet.getCell(`A${row}`).value = 'CROSS-SECTION DATA';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  sheet.mergeCells(`A${row}:E${row}`);
  
  row++;
  sheet.getCell(`A${row}`).value = 'Chainage (m)';
  sheet.getCell(`B${row}`).value = 'Ground Level (m MSL)';
  sheet.getCell(`C${row}`).value = 'Width (m)';
  sheet.getCell(`D${row}`).value = 'Depth (m)';
  sheet.getCell(`E${row}`).value = 'Area (m²)';
  
  ['A', 'B', 'C', 'D', 'E'].forEach(col => {
    sheet.getCell(`${col}${row}`).font = { bold: true };
    sheet.getCell(`${col}${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    sheet.getCell(`${col}${row}`).alignment = { horizontal: 'center' };
  });
  
  row++;
  const startDataRow = row;
  
  input.crossSectionData.forEach(point => {
    const depth = Math.max(0, input.hfl - point.gl);
    const width = point.width || input.bridgeWidth;
    const area = depth * width;
    
    sheet.getCell(`A${row}`).value = point.chainage;
    sheet.getCell(`B${row}`).value = point.gl;
    sheet.getCell(`C${row}`).value = width;
    sheet.getCell(`D${row}`).value = parseFloat(depth.toFixed(2));
    sheet.getCell(`E${row}`).value = parseFloat(area.toFixed(2));
    
    // Center align numbers
    ['A', 'B', 'C', 'D', 'E'].forEach(col => {
      sheet.getCell(`${col}${row}`).alignment = { horizontal: 'center' };
    });
    
    row++;
  });
  
  // ==================== CALCULATED RESULTS ====================
  row += 2;
  sheet.getCell(`A${row}`).value = 'CALCULATED RESULTS';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  sheet.mergeCells(`A${row}:E${row}`);
  
  row++;
  
  const results = [
    { param: 'Afflux', value: design.hydraulics.afflux, unit: 'm', desc: 'Lacey\'s afflux' },
    { param: 'Design Water Level', value: design.hydraulics.designWaterLevel, unit: 'm MSL', desc: 'HFL + Afflux' },
    { param: 'Velocity', value: design.hydraulics.velocity, unit: 'm/s', desc: 'Manning\'s velocity' },
    { param: 'Froude Number', value: design.hydraulics.froudeNumber, unit: '-', desc: 'Fr = V/√(gh)' },
    { param: 'Cross-sectional Area', value: design.hydraulics.crossSectionalArea, unit: 'm²', desc: 'Flow area' },
    { param: 'Contraction', value: design.hydraulics.contraction, unit: 'm', desc: 'Due to piers' }
  ];
  
  results.forEach(item => {
    sheet.getCell(`A${row}`).value = item.param;
    sheet.getCell(`B${row}`).value = item.value;
    sheet.getCell(`C${row}`).value = item.unit;
    sheet.getCell(`D${row}`).value = item.desc;
    
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`B${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB9C' }
    };
    
    row++;
  });
  
  // ==================== COLUMN WIDTHS ====================
  sheet.getColumn('A').width = 25;
  sheet.getColumn('B').width = 20;
  sheet.getColumn('C').width = 12;
  sheet.getColumn('D').width = 30;
  sheet.getColumn('E').width = 15;
}
