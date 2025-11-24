import ExcelJS from "exceljs";
import XLSX from "xlsx";
import path from "path";

// Color scheme matching source
export const COLORS = {
  PRIMARY: { argb: "FF365070" },      // Dark blue
  HEADER: { argb: "FF1F496B" },       // Darker blue
  SUBHEADER: { argb: "FF4472C4" },    // Blue
  LIGHT_BG: { argb: "FFECF0F1" },     // Light gray
  WHITE: { argb: "FFFFFFFF" },
  SUCCESS: { argb: "FF27AE60" },      // Green
  WARNING: { argb: "FFF39C12" },      // Orange
  LIGHT_BLUE: { argb: "FFDDE8F5" }    // Very light blue
};

export const BORDERS = {
  thin: { style: "thin" as const, color: { argb: "FF000000" } },
  medium: { style: "medium" as const, color: { argb: "FF365070" } }
};

// Load source metadata
let sourceMetadata: any = null;
export function loadSourceMetadata() {
  try {
    const xlsxWorkbook = XLSX.readFile(path.join(__dirname, '../attached_assets/FINAL_RESULT_1763962301422.xls'));
    sourceMetadata = {};
    
    xlsxWorkbook.SheetNames.forEach(sheetName => {
      const sheet = xlsxWorkbook.Sheets[sheetName];
      sourceMetadata[sheetName] = {
        columns: sheet['!cols'] || [],
        rows: sheet['!rows'] || [],
        ref: sheet['!ref'] || 'A1'
      };
    });
    
    return sourceMetadata;
  } catch (e) {
    console.warn('Could not load source metadata');
    return null;
  }
}

// Apply column widths from source
export function applyColumnWidths(ws: ExcelJS.Worksheet, sheetName: string, numCols: number = 10) {
  if (!sourceMetadata || !sourceMetadata[sheetName]) return;
  
  const cols = sourceMetadata[sheetName].columns;
  if (cols && Array.isArray(cols)) {
    cols.slice(0, numCols).forEach((col: any, idx: number) => {
      if (col && col.wch) {
        ws.getColumn(idx + 1).width = col.wch;
      }
    });
  }
  
  // Default column widths if not in source
  for (let i = cols?.length || 0; i < numCols; i++) {
    ws.getColumn(i + 1).width = 15;
  }
}

// Apply row heights from source
export function applyRowHeights(ws: ExcelJS.Worksheet, sheetName: string, numRows: number = 50) {
  if (!sourceMetadata || !sourceMetadata[sheetName]) {
    setDefaultRowHeights(ws, numRows);
    return;
  }
  
  const rows = sourceMetadata[sheetName].rows;
  if (rows && Array.isArray(rows)) {
    rows.slice(0, numRows).forEach((row: any, idx: number) => {
      if (row && (row.hpt || row.hpx)) {
        ws.getRow(idx + 1).height = (row.hpt || row.hpx) * 0.75 / 15; // Convert to ExcelJS units
      }
    });
  } else {
    setDefaultRowHeights(ws, numRows);
  }
}

function setDefaultRowHeights(ws: ExcelJS.Worksheet, numRows: number) {
  for (let i = 1; i <= numRows; i++) {
    ws.getRow(i).height = 20; // Default height
  }
}

// Style header cells
export function styleHeader(ws: ExcelJS.Worksheet, row: number, text: string, cols: number = 8) {
  ws.getCell(row, 1).value = text;
  ws.getCell(row, 1).font = { bold: true, size: 12, color: COLORS.WHITE };
  ws.getCell(row, 1).fill = { type: "pattern", pattern: "solid", fgColor: COLORS.PRIMARY };
  ws.getCell(row, 1).alignment = { horizontal: "center", vertical: "center", wrapText: true };
  
  // Apply to borders
  for (let col = 1; col <= cols; col++) {
    const cell = ws.getCell(row, col);
    cell.border = {
      top: BORDERS.thin,
      bottom: BORDERS.thin,
      left: BORDERS.thin,
      right: BORDERS.thin
    };
    if (col > 1) {
      cell.font = { bold: true, size: 12, color: COLORS.WHITE };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: COLORS.PRIMARY };
    }
  }
  
  ws.mergeCells(`A${row}:${String.fromCharCode(64 + cols)}${row}`);
}

// Style subheader
export function styleSubheader(ws: ExcelJS.Worksheet, row: number, text: string, cols: number = 4) {
  ws.getCell(row, 1).value = text;
  ws.getCell(row, 1).font = { bold: true, size: 11, color: COLORS.WHITE };
  ws.getCell(row, 1).fill = { type: "pattern", pattern: "solid", fgColor: COLORS.SUBHEADER };
  ws.getCell(row, 1).alignment = { horizontal: "left", vertical: "center" };
  
  for (let col = 1; col <= cols; col++) {
    const cell = ws.getCell(row, col);
    cell.border = { bottom: BORDERS.thin };
    if (col > 1) {
      cell.font = { bold: true, size: 11, color: COLORS.WHITE };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: COLORS.SUBHEADER };
    }
  }
  
  ws.mergeCells(`A${row}:${String.fromCharCode(64 + cols)}${row}`);
}

// Add calculation row with formatting
export function addCalcRow(
  ws: ExcelJS.Worksheet,
  row: number,
  label: string,
  value: string | number,
  unit: string = "",
  highlighted: boolean = false
): number {
  const cells = [
    { col: 1, value: "", bold: false },
    { col: 2, value: label, bold: true },
    { col: 3, value: "=", bold: false },
    { col: 4, value: value, bold: false },
    { col: 5, value: unit, bold: false }
  ];
  
  cells.forEach(({ col, value: val, bold }) => {
    const cell = ws.getCell(row, col);
    cell.value = val;
    cell.font = {
      bold,
      size: 10,
      color: { argb: "FF000000" }
    };
    
    if (highlighted) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: COLORS.LIGHT_BLUE };
    }
    
    cell.border = {
      top: { style: "thin" as const, color: { argb: "FFD3D3D3" } },
      bottom: { style: "thin" as const, color: { argb: "FFD3D3D3" } },
      left: { style: "thin" as const, color: { argb: "FFD3D3D3" } },
      right: { style: "thin" as const, color: { argb: "FFD3D3D3" } }
    };
    
    cell.alignment = { horizontal: "left", vertical: "center", wrapText: true };
  });
  
  return row + 1;
}

// Add table row
export function addTableRow(
  ws: ExcelJS.Worksheet,
  row: number,
  values: (string | number)[],
  isHeader: boolean = false,
  backgroundColor?: any
): number {
  values.forEach((val, idx) => {
    const cell = ws.getCell(row, idx + 1);
    cell.value = val;
    
    if (isHeader) {
      cell.font = { bold: true, size: 11, color: COLORS.WHITE };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: COLORS.SUBHEADER };
    } else if (backgroundColor) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: backgroundColor };
    }
    
    cell.border = {
      top: BORDERS.thin,
      bottom: BORDERS.thin,
      left: BORDERS.thin,
      right: BORDERS.thin
    };
    
    cell.alignment = { horizontal: "center", vertical: "center", wrapText: true };
  });
  
  return row + 1;
}

// Add title cell
export function addTitle(ws: ExcelJS.Worksheet, row: number, text: string, size: number = 14) {
  ws.getCell(row, 1).value = text;
  ws.getCell(row, 1).font = { bold: true, size, color: COLORS.PRIMARY };
  ws.getCell(row, 1).alignment = { horizontal: "left", vertical: "center" };
}

// Format currency
export function formatCurrency(ws: ExcelJS.Worksheet, row: number, col: number) {
  ws.getCell(row, col).numFmt = '₹#,##0.00';
}

// Initialize metadata
loadSourceMetadata();
