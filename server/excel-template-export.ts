/**
 * COMPLETE WORKBOOK GENERATOR FROM FINAL_RESULT.xls TEMPLATE
 * Copies all 46 sheets with 2,336 live formulas
 * Updates INPUTS sheet with current design parameters
 */

import XLSX from 'xlsx';
import { DesignInput, DesignOutput } from './design-engine';
import fs from 'fs';
import path from 'path';

export async function generateCompleteWorkbookFromTemplate(
  input: DesignInput,
  design: DesignOutput,
  projectName: string
): Promise<Buffer> {
  // Path to template file
  const templatePath = path.join(process.cwd(), 'attached_assets', 'FINAL_RESULT_1763992209815.xls');
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  // Read template workbook with all formulas preserved
  const template = XLSX.readFile(templatePath, { cellFormula: true, cellStyles: true });

  // Get or create INPUTS sheet
  let inputsSheet = template.Sheets['INPUTS'];
  if (!inputsSheet) {
    inputsSheet = {};
    template.Sheets['INPUTS'] = inputsSheet;
    if (!template.SheetNames.includes('INPUTS')) {
      template.SheetNames.unshift('INPUTS');
    }
  }

  // Update INPUTS sheet with design parameters
  // These match the INPUT_CELLS structure
  inputsSheet['B3'] = { v: input.span, t: 'n', f: undefined }; // Design Span
  inputsSheet['B4'] = { v: input.width, t: 'n', f: undefined }; // Bridge Width
  inputsSheet['B5'] = { v: input.discharge, t: 'n', f: undefined }; // Design Discharge
  inputsSheet['B6'] = { v: input.floodLevel, t: 'n', f: undefined }; // Flood Level
  inputsSheet['B7'] = { v: input.bedLevel ?? 0, t: 'n', f: undefined }; // Bed Level
  inputsSheet['B8'] = { v: input.fck, t: 'n', f: undefined }; // Concrete Grade
  inputsSheet['B9'] = { v: input.fy, t: 'n', f: undefined }; // Steel Grade
  inputsSheet['B10'] = { v: input.soilBearingCapacity, t: 'n', f: undefined }; // SBC
  inputsSheet['B11'] = { v: input.bedSlope, t: 'n', f: undefined }; // Bed Slope
  inputsSheet['B12'] = { v: input.numberOfLanes, t: 'n', f: undefined }; // Number of Lanes

  // Add labels for reference
  inputsSheet['A3'] = { v: 'Design Span' };
  inputsSheet['A4'] = { v: 'Bridge Width' };
  inputsSheet['A5'] = { v: 'Design Discharge' };
  inputsSheet['A6'] = { v: 'Flood Level' };
  inputsSheet['A7'] = { v: 'Bed Level' };
  inputsSheet['A8'] = { v: 'Concrete Grade (fck)' };
  inputsSheet['A9'] = { v: 'Steel Grade (fy)' };
  inputsSheet['A10'] = { v: 'Soil Bearing Capacity' };
  inputsSheet['A11'] = { v: 'Bed Slope' };
  inputsSheet['A12'] = { v: 'Number of Lanes' };

  // Hide INPUTS sheet (keep it but hidden)
  const inputsSheetIndex = template.SheetNames.indexOf('INPUTS');
  if (!template.Workbook) template.Workbook = {};
  if (!template.Workbook.Sheets) template.Workbook.Sheets = [];
  
  const inputsSheetObj = template.Workbook.Sheets[inputsSheetIndex];
  if (inputsSheetObj) {
    inputsSheetObj.Hidden = true;
  }

  // Convert to buffer
  return XLSX.write(template, { type: 'buffer', bookType: 'xlsx' });
}

export { generateCompleteWorkbookFromTemplate as generateExcelReport };
