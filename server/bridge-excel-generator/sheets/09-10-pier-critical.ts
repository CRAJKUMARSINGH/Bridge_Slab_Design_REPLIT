/**
 * SHEETS 09-10: Critical Pier Sheets
 * Sheet 09: STABILITY CHECK FOR PIER (70 load cases)
 * Sheet 10: abstract of stresses (168 stress points)
 */

import ExcelJS from 'exceljs';
import { EnhancedProjectInput, DesignOutput } from '../types';

// ==================== SHEET 09: STABILITY CHECK FOR PIER ====================
export async function generateStabilityCheckPierSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('STABILITY CHECK FOR PIER');
  
  // Header
  sheet.mergeCells('A1:H1');
  const headerCell = sheet.getCell('A1');
  headerCell.value = 'PIER STABILITY ANALYSIS - 70 LOAD CASES';
  headerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  headerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0066CC' }
  };
  headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 35;
  
  // Pier dimensions summary
  let row = 3;
  sheet.getCell(`A${row}`).value = 'PIER DIMENSIONS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const pierData = [
    ['Width', design.pier.width, 'm'],
    ['Length', design.pier.length, 'm'],
    ['Depth', design.pier.depth, 'm'],
    ['Number of Piers', design.pier.numberOfPiers, '-'],
    ['Base Width', design.pier.baseWidth, 'm'],
    ['Base Length', design.pier.baseLength, 'm']
  ];
  
  pierData.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
  });
  
  // Forces summary
  row++;
  sheet.getCell(`A${row}`).value = 'FORCES:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  const forces = [
    ['Hydrostatic Force', design.pier.hydrostaticForce, 'kN'],
    ['Drag Force', design.pier.dragForce, 'kN'],
    ['Total Horizontal Force', design.pier.totalHorizontalForce, 'kN']
  ];
  
  forces.forEach(([param, value, unit]) => {
    sheet.getCell(`A${row}`).value = param;
    sheet.getCell(`B${row}`).value = value;
    sheet.getCell(`C${row}`).value = unit;
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`B${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB9C' }
    };
    row++;
  });
  
  // Load cases table
  row += 2;
  sheet.getCell(`A${row}`).value = `LOAD CASES (${design.pier.loadCases.length} CASES):`;
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  // Table headers
  const headers = ['Case', 'Description', 'H-Force (kN)', 'V-Force (kN)', 'Sliding FOS', 'Overturning FOS', 'Bearing FOS', 'Status'];
  headers.forEach((header, idx) => {
    const cell = sheet.getCell(String.fromCharCode(65 + idx) + row);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0066CC' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  
  row++;
  const startDataRow = row;
  
  // Add all 70 load cases
  design.pier.loadCases.forEach((loadCase, index) => {
    sheet.getCell(`A${row}`).value = loadCase.caseNumber;
    sheet.getCell(`B${row}`).value = loadCase.description;
    sheet.getCell(`C${row}`).value = loadCase.resultantHorizontal;
    sheet.getCell(`D${row}`).value = loadCase.resultantVertical;
    sheet.getCell(`E${row}`).value = loadCase.slidingFOS;
    sheet.getCell(`F${row}`).value = loadCase.overturningFOS;
    sheet.getCell(`G${row}`).value = loadCase.bearingFOS;
    sheet.getCell(`H${row}`).value = loadCase.status;
    
    // Center align numbers
    ['A', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
      sheet.getCell(`${col}${row}`).alignment = { horizontal: 'center' };
    });
    
    // Color code status
    const statusCell = sheet.getCell(`H${row}`);
    if (loadCase.status === 'SAFE') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF90EE90' }
      };
      statusCell.font = { bold: true };
    } else if (loadCase.status === 'CHECK') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCCCB' }
      };
    } else {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFEB9C' }
      };
    }
    
    // Alternate row colors for readability
    if (index % 2 === 0) {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
        const cell = sheet.getCell(`${col}${row}`);
        if (!cell.fill || !cell.fill.fgColor) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' }
          };
        }
      });
    }
    
    row++;
  });
  
  // Summary statistics
  row += 2;
  const safeCount = design.pier.loadCases.filter(c => c.status === 'SAFE').length;
  const checkCount = design.pier.loadCases.filter(c => c.status === 'CHECK').length;
  const acceptableCount = design.pier.loadCases.filter(c => c.status === 'ACCEPTABLE').length;
  
  sheet.getCell(`A${row}`).value = 'SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = `Total Cases: ${design.pier.loadCases.length}`;
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  sheet.getCell(`A${row}`).value = `SAFE: ${safeCount}`;
  sheet.getCell(`A${row}`).font = { bold: true };
  sheet.getCell(`A${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF90EE90' }
  };
  row++;
  
  sheet.getCell(`A${row}`).value = `ACCEPTABLE: ${acceptableCount}`;
  sheet.getCell(`A${row}`).font = { bold: true };
  sheet.getCell(`A${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFEB9C' }
  };
  row++;
  
  sheet.getCell(`A${row}`).value = `CHECK: ${checkCount}`;
  sheet.getCell(`A${row}`).font = { bold: true };
  sheet.getCell(`A${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFCCCB' }
  };
  
  // Column widths
  sheet.getColumn('A').width = 8;
  sheet.getColumn('B').width = 45;
  sheet.getColumn('C').width = 12;
  sheet.getColumn('D').width = 12;
  sheet.getColumn('E').width = 12;
  sheet.getColumn('F').width = 15;
  sheet.getColumn('G').width = 12;
  sheet.getColumn('H').width = 12;
  
  // Add borders to data area
  for (let r = startDataRow - 1; r < startDataRow + design.pier.loadCases.length; r++) {
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
      const cell = sheet.getCell(`${col}${r}`);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }
}

// ==================== SHEET 10: ABSTRACT OF STRESSES ====================
export async function generateAbstractOfStressesSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('abstract of stresses');
  
  // Header
  sheet.mergeCells('A1:F1');
  const headerCell = sheet.getCell('A1');
  headerCell.value = 'PIER STRESS DISTRIBUTION - 168 STRESS POINTS';
  headerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  headerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0066CC' }
  };
  headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 35;
  
  // Info
  let row = 3;
  sheet.getCell(`A${row}`).value = 'STRESS ANALYSIS:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = `Total Stress Points: ${design.pier.stressDistribution.length}`;
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  sheet.getCell(`A${row}`).value = 'Sections: 4 (Top, Upper-Mid, Lower-Mid, Base)';
  sheet.getCell(`A${row}`).font = { bold: true };
  row++;
  
  sheet.getCell(`A${row}`).value = 'Points per Section: 42';
  sheet.getCell(`A${row}`).font = { bold: true };
  
  // Table
  row += 2;
  const headers = ['Location', 'Long. Stress (MPa)', 'Trans. Stress (MPa)', 'Shear Stress (MPa)', 'Combined (MPa)', 'Status'];
  headers.forEach((header, idx) => {
    const cell = sheet.getCell(String.fromCharCode(65 + idx) + row);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0066CC' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  
  row++;
  const startDataRow = row;
  
  // Add all 168 stress points
  design.pier.stressDistribution.forEach((point, index) => {
    sheet.getCell(`A${row}`).value = point.location;
    sheet.getCell(`B${row}`).value = point.longitudinalStress;
    sheet.getCell(`C${row}`).value = point.transverseStress;
    sheet.getCell(`D${row}`).value = point.shearStress;
    sheet.getCell(`E${row}`).value = point.combinedStress;
    sheet.getCell(`F${row}`).value = point.status;
    
    // Center align numbers
    ['B', 'C', 'D', 'E', 'F'].forEach(col => {
      sheet.getCell(`${col}${row}`).alignment = { horizontal: 'center' };
    });
    
    // Color code status
    const statusCell = sheet.getCell(`F${row}`);
    if (point.status === 'Safe') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF90EE90' }
      };
    } else {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCCCB' }
      };
    }
    
    // Highlight section boundaries (every 42 rows)
    if (index % 42 === 0 && index > 0) {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
        sheet.getCell(`${col}${row}`).border = {
          top: { style: 'medium' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
    
    row++;
  });
  
  // Summary
  row += 2;
  const safePoints = design.pier.stressDistribution.filter(p => p.status === 'Safe').length;
  
  sheet.getCell(`A${row}`).value = 'SUMMARY:';
  sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
  row++;
  
  sheet.getCell(`A${row}`).value = `Total Points: ${design.pier.stressDistribution.length}`;
  row++;
  sheet.getCell(`A${row}`).value = `Safe Points: ${safePoints}`;
  sheet.getCell(`A${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF90EE90' }
  };
  row++;
  sheet.getCell(`A${row}`).value = `Check Points: ${design.pier.stressDistribution.length - safePoints}`;
  if (design.pier.stressDistribution.length - safePoints > 0) {
    sheet.getCell(`A${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFCCCB' }
    };
  }
  
  // Column widths
  sheet.getColumn('A').width = 15;
  sheet.getColumn('B').width = 18;
  sheet.getColumn('C').width = 18;
  sheet.getColumn('D').width = 18;
  sheet.getColumn('E').width = 16;
  sheet.getColumn('F').width = 10;
}
