/**
 * SHEET 01: INDEX
 * Main index sheet listing all 46 sheets with descriptions
 */

import ExcelJS from 'exceljs';
import { EnhancedProjectInput, DesignOutput } from '../types';

export async function generateIndexSheet(
  workbook: ExcelJS.Workbook,
  input: EnhancedProjectInput,
  design: DesignOutput
): Promise<void> {
  const sheet = workbook.addWorksheet('INDEX');
  
  // ==================== HEADER ====================
  sheet.mergeCells('A1:F1');
  const headerCell = sheet.getCell('A1');
  headerCell.value = 'BRIDGE DESIGN CALCULATION INDEX';
  headerCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  headerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0066CC' }
  };
  headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 35;
  
  // ==================== PROJECT INFO ====================
  sheet.getCell('A3').value = 'Project Name:';
  sheet.getCell('B3').value = input.projectName;
  sheet.getCell('A3').font = { bold: true };
  
  sheet.getCell('A4').value = 'Location:';
  sheet.getCell('B4').value = input.location;
  sheet.getCell('A4').font = { bold: true };
  
  sheet.getCell('A5').value = 'District:';
  sheet.getCell('B5').value = input.district || 'N/A';
  sheet.getCell('A5').font = { bold: true };
  
  sheet.getCell('A6').value = 'Engineer:';
  sheet.getCell('B6').value = input.engineer || 'N/A';
  sheet.getCell('A6').font = { bold: true };
  
  sheet.getCell('D3').value = 'Span:';
  sheet.getCell('E3').value = `${input.spanLength}m`;
  sheet.getCell('D3').font = { bold: true };
  
  sheet.getCell('D4').value = 'Width:';
  sheet.getCell('E4').value = `${input.bridgeWidth}m`;
  sheet.getCell('D4').font = { bold: true };
  
  sheet.getCell('D5').value = 'Date:';
  sheet.getCell('E5').value = new Date().toLocaleDateString();
  sheet.getCell('D5').font = { bold: true };
  
  // ==================== SHEET INDEX ====================
  sheet.getCell('A8').value = 'S.No';
  sheet.getCell('B8').value = 'Sheet Name';
  sheet.getCell('C8').value = 'Description';
  sheet.getCell('D8').value = 'Status';
  
  // Header row formatting
  ['A8', 'B8', 'C8', 'D8'].forEach(cell => {
    sheet.getCell(cell).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0066CC' }
    };
    sheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
  });
  
  // Sheet list with descriptions
  const sheetList = [
    { no: 1, name: 'INDEX', desc: 'Index of all calculation sheets', status: '✓' },
    { no: 2, name: 'INSERT-HYDRAULICS', desc: 'Hydraulic input data', status: '✓' },
    { no: 3, name: 'afflux calculation', desc: 'Afflux calculations (Lacey\'s method)', status: '✓' },
    { no: 4, name: 'HYDRAULICS', desc: 'Manning\'s equation & flow analysis', status: '✓' },
    { no: 5, name: 'Deck Anchorage', desc: 'Deck anchorage calculations', status: '✓' },
    { no: 6, name: 'CROSS SECTION', desc: 'Cross-section data & analysis', status: '✓' },
    { no: 7, name: 'Bed Slope', desc: 'Bed slope analysis', status: '✓' },
    { no: 8, name: 'SBC', desc: 'Safe bearing capacity', status: '✓' },
    { no: 9, name: 'STABILITY CHECK FOR PIER', desc: `Pier stability (${design.pier.loadCases.length} load cases)`, status: '✓' },
    { no: 10, name: 'abstract of stresses', desc: `Stress distribution (${design.pier.stressDistribution.length} points)`, status: '✓' },
    { no: 11, name: 'STEEL IN FLARED PIER BASE', desc: 'Flared pier base reinforcement', status: '✓' },
    { no: 12, name: 'STEEL IN PIER', desc: 'Pier reinforcement details', status: '✓' },
    { no: 13, name: 'FOOTING DESIGN', desc: 'Pier footing design', status: '✓' },
    { no: 14, name: 'Footing STRESS DIAGRAM', desc: 'Footing stress distribution', status: '✓' },
    { no: 15, name: 'Pier Cap LL tracked vehicle', desc: 'Pier cap live load (tracked)', status: '✓' },
    { no: 16, name: 'Pier Cap', desc: 'Pier cap design', status: '✓' },
    { no: 17, name: 'LLOAD', desc: 'Live load analysis', status: '✓' },
    { no: 18, name: 'loadsumm', desc: 'Load summary', status: '✓' },
    { no: 19, name: 'INSERT TYPE1-ABUT', desc: 'Type1 abutment input', status: '✓' },
    { no: 20, name: 'TYPE1-AbutMENT Drawing', desc: 'Type1 abutment drawing', status: '✓' },
    { no: 21, name: 'TYPE1-STABILITY CHECK ABUTMENT', desc: `Type1 stability (${design.abutment.loadCases.length} load cases)`, status: '✓' },
    { no: 22, name: 'TYPE1-ABUTMENT FOOTING DESIGN', desc: 'Type1 footing design', status: '✓' },
    { no: 23, name: 'TYPE1- Abut Footing STRESS', desc: `Type1 stress (${design.abutment.stressDistribution.length} points)`, status: '✓' },
    { no: 24, name: 'TYPE1-STEEL IN ABUTMENT', desc: 'Type1 reinforcement', status: '✓' },
    { no: 25, name: 'TYPE1-Abutment Cap', desc: 'Type1 abutment cap', status: '✓' },
    { no: 26, name: 'TYPE1-DIRT WALL REINFORCEMENT', desc: 'Type1 dirt wall steel', status: '✓' },
    { no: 27, name: 'TYPE1-DIRT DirectLoad_BM', desc: 'Type1 dirt wall direct load', status: '✓' },
    { no: 28, name: 'TYPE1-DIRT LL_BM', desc: 'Type1 dirt wall live load', status: '✓' },
    { no: 29, name: 'TechNote', desc: 'Technical notes', status: '✓' },
    { no: 30, name: 'INSERT ESTIMATE', desc: 'Estimation input', status: '✓' },
    { no: 31, name: 'Tech Report', desc: 'Technical report', status: '✓' },
    { no: 32, name: 'General Abs.', desc: 'General abstract', status: '✓' },
    { no: 33, name: 'Abstract', desc: 'Cost abstract', status: '✓' },
    { no: 34, name: 'Bridge measurements', desc: 'Bridge measurements', status: '✓' },
    { no: 35, name: 'INSERT C1-ABUT', desc: 'C1 abutment input', status: '○' },
    { no: 36, name: 'C1-AbutMENT Drawing', desc: 'C1 abutment drawing', status: '○' },
    { no: 37, name: 'C1-STABILITY CHECK ABUTMENT', desc: 'C1 stability check', status: '○' },
    { no: 38, name: 'C1-ABUTMENT FOOTING DESIGN', desc: 'C1 footing design', status: '○' },
    { no: 39, name: 'C1- Abut Footing STRESS DIAGRAM', desc: 'C1 footing stress', status: '○' },
    { no: 40, name: 'CAN RETURN FOOTING DESIGN', desc: 'Cantilever return footing', status: '○' },
    { no: 41, name: 'STEEL IN CANT ABUTMENT', desc: 'Cantilever abutment steel', status: '○' },
    { no: 42, name: 'STEEL IN CANT RETURNS', desc: 'Cantilever return steel', status: '○' },
    { no: 43, name: 'C1-Abutment Cap', desc: 'C1 abutment cap', status: '○' },
    { no: 44, name: 'C1-DIRT WALL REINFORCEMENT', desc: 'C1 dirt wall steel', status: '○' },
    { no: 45, name: 'C1-DIRT DirectLoad_BM', desc: 'C1 dirt wall direct load', status: '○' },
    { no: 46, name: 'C1-DIRT LL_BM', desc: 'C1 dirt wall live load', status: '○' }
  ];
  
  let row = 9;
  sheetList.forEach(item => {
    sheet.getCell(`A${row}`).value = item.no;
    sheet.getCell(`B${row}`).value = item.name;
    sheet.getCell(`C${row}`).value = item.desc;
    sheet.getCell(`D${row}`).value = item.status;
    
    // Alternate row colors
    if (row % 2 === 0) {
      ['A', 'B', 'C', 'D'].forEach(col => {
        sheet.getCell(`${col}${row}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' }
        };
      });
    }
    
    // Center align
    sheet.getCell(`A${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${row}`).alignment = { horizontal: 'center' };
    
    row++;
  });
  
  // ==================== SUMMARY ====================
  const summaryRow = row + 2;
  sheet.getCell(`A${summaryRow}`).value = 'Summary:';
  sheet.getCell(`A${summaryRow}`).font = { bold: true, size: 12 };
  
  sheet.getCell(`A${summaryRow + 1}`).value = `Total Sheets: 46`;
  sheet.getCell(`A${summaryRow + 2}`).value = `Pier Load Cases: ${design.pier.loadCases.length}`;
  sheet.getCell(`A${summaryRow + 3}`).value = `Abutment Load Cases: ${design.abutment.loadCases.length}`;
  sheet.getCell(`A${summaryRow + 4}`).value = `Total Stress Points: ${design.pier.stressDistribution.length + design.abutment.stressDistribution.length + design.slab.stressDistribution.length}`;
  
  // ==================== COLUMN WIDTHS ====================
  sheet.getColumn('A').width = 8;
  sheet.getColumn('B').width = 35;
  sheet.getColumn('C').width = 50;
  sheet.getColumn('D').width = 10;
  sheet.getColumn('E').width = 15;
  sheet.getColumn('F').width = 15;
  
  // Add borders to data area
  for (let r = 8; r <= row - 1; r++) {
    ['A', 'B', 'C', 'D'].forEach(col => {
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
