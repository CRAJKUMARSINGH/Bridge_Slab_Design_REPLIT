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

  // Read template with XLSX (preserves formulas for older .xls format)
  const template = XLSX.readFile(templatePath, { cellFormula: true });

  // Get or create INPUTS sheet - insert at beginning
  if (!template.Sheets['INPUTS']) {
    template.Sheets['INPUTS'] = {};
    template.SheetNames.unshift('INPUTS');
  }
  
  const inputsSheet = template.Sheets['INPUTS'];

  // Update INPUTS sheet with design parameters and labels
  const inputData = [
    ['A3', 'B3', 'Design Span', input.span],
    ['A4', 'B4', 'Bridge Width', input.width],
    ['A5', 'B5', 'Design Discharge', input.discharge],
    ['A6', 'B6', 'Flood Level', input.floodLevel],
    ['A7', 'B7', 'Bed Level', input.bedLevel ?? 0],
    ['A8', 'B8', 'Concrete Grade (fck)', input.fck],
    ['A9', 'B9', 'Steel Grade (fy)', input.fy],
    ['A10', 'B10', 'Soil Bearing Capacity', input.soilBearingCapacity],
    ['A11', 'B11', 'Bed Slope', input.bedSlope],
    ['A12', 'B12', 'Number of Lanes', input.numberOfLanes],
  ];

  inputData.forEach(([labelCell, valueCell, label, value]) => {
    inputsSheet[labelCell] = { v: label, t: 's' };
    inputsSheet[valueCell] = { v: value, t: typeof value === 'string' ? 's' : 'n' };
  });

  // Set range for INPUTS sheet
  inputsSheet['!ref'] = 'A1:B12';

  // Convert to buffer using XLSX
  const buffer = XLSX.write(template, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

export { generateCompleteWorkbookFromTemplate as generateExcelReport };
