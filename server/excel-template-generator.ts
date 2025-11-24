/**
 * FINAL_RESULT Template-Based Sheet Generator
 * Uses actual template structure with dynamic formula references
 */

import ExcelJS from "exceljs";
import { DesignInput, DesignOutput } from "./design-engine";

// This will be populated from template extraction
const templateSheets: { [key: string]: any[] } = {};

export function generateSheetsFromTemplate(
  workbook: ExcelJS.Workbook,
  input: DesignInput,
  design: DesignOutput,
  templateData: { [key: string]: any }
): void {
  // Map of all 46 sheet names from FINAL_RESULT.xls
  const requiredSheets = [
    "INDEX",
    "INSERT- HYDRAULICS",
    "afflux calculation",
    "HYDRAULICS",
    "Deck Anchorage",
    "CROSS SECTION",
    "Bed Slope",
    "SBC",
    "STABILITY CHECK FOR PIER",
    "abstract of stresses",
    "STEEL IN FLARED PIER BASE",
    "STEEL IN PIER",
    "FOOTING DESIGN",
    "Footing STRESS DIAGRAM",
    "Pier Cap LL tracked vehicle",
    "Pier Cap",
    "LLOAD",
    "loadsumm",
    "LL-ABSTRACT",
    "TYPE1-AbutMENT Drawing",
    "TYPE1-STABILITY CHECK ABUTMENT",
    "TYPE1-ABUTMENT FOOTING DESIGN",
    "TYPE1- Abut Footing STRESS",
    "TYPE1-STEEL IN ABUTMENT",
    "TYPE1-Abutment Cap",
    "TYPE1-DIRT WALL REINFORCEMENT",
    "TYPE1-DIRT DirectLoad_BM",
    "TYPE1-DIRT LL_BM",
    "TechNote",
    "INSERT C1-ABUT",
    "C1-AbutMENT Drawing",
    "C1-STABILITY CHECK ABUTMENT",
    "C1-ABUTMENT FOOTING DESIGN",
    "C1-Abut Footing STRESS DIAGRAM",
    "CAN-RETURN FOOTING DESIGN",
    "STEEL IN CANT-ABUTMENT",
    "STEEL IN CANT-RETURNS",
    "C1-Abutment Cap",
    "C1-DIRT WALL REINFORCEMENT",
    "C1-DIRT DirectLoad_BM",
    "C1-DIRT LL_BM",
    "INSERT ESTIMATE",
    "Tech Report",
    "General Abs.",
    "Abstract",
    "Bridge measurements",
  ];

  // Generate each sheet
  requiredSheets.forEach((sheetName) => {
    if (templateData[sheetName]) {
      const ws = workbook.addWorksheet(sheetName);
      populateSheetFromTemplate(ws, templateData[sheetName], input, design);
    }
  });
}

function populateSheetFromTemplate(
  ws: ExcelJS.Worksheet,
  sheetData: any[],
  input: DesignInput,
  design: DesignOutput
): void {
  // Fill in data from template
  if (Array.isArray(sheetData)) {
    sheetData.forEach((row, rowIdx) => {
      if (Array.isArray(row)) {
        row.forEach((cell, colIdx) => {
          if (cell !== null && cell !== undefined) {
            ws.getCell(rowIdx + 1, colIdx + 1).value = cell;
          }
        });
      }
    });
  }
}

export { requiredSheets };
