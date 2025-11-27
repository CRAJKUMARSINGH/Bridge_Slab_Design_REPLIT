const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to master template file
const templatePath = path.join(__dirname, 'attached_assets', 'master_bridge_Design.xlsx');

if (!fs.existsSync(templatePath)) {
  console.log(`Master template file not found: ${templatePath}`);
  process.exit(1);
}

console.log(`Reading template from: ${templatePath}`);

// Read template with XLSX (preserves formulas and styles)
const template = XLSX.readFile(templatePath, { 
  cellFormula: true,
  cellStyles: true,
  bookVBA: true,
  bookFiles: true
});

console.log('\n=== MERGED CELLS AND FORMATTING ANALYSIS ===');
console.log(`Number of sheets: ${template.SheetNames.length}`);

// Function to analyze merged cells
function analyzeMergedCells(sheet, sheetName) {
  if (!sheet['!merges'] || sheet['!merges'].length === 0) {
    return;
  }
  
  console.log(`\n${sheetName} - Merged Cells:`);
  sheet['!merges'].forEach((merge, index) => {
    console.log(`  ${index + 1}. ${XLSX.utils.encode_range(merge)}`);
  });
}

// Function to analyze cell formatting details
function analyzeCellFormatting(sheet, cellAddress) {
  const cell = sheet[cellAddress];
  if (!cell) return null;
  
  const formatting = {
    address: cellAddress,
    value: cell.v,
    type: cell.t,
    formula: cell.f
  };
  
  // Check for specific formatting attributes
  if (cell.s) {
    formatting.style = cell.s;
  }
  
  return formatting;
}

// Analyze key sheets for merged cells and formatting
const keySheets = ['INSERT- HYDRAULICS', 'HYDRAULICS', 'STABILITY CHECK FOR PIER', 'abstract of stresses'];

keySheets.forEach(sheetName => {
  const sheet = template.Sheets[sheetName];
  if (!sheet) {
    console.log(`\n${sheetName}: Sheet not found`);
    return;
  }
  
  console.log(`\n--- ${sheetName} ---`);
  
  // Check for merged cells
  if (sheet['!merges'] && sheet['!merges'].length > 0) {
    console.log(`Merged cells found: ${sheet['!merges'].length}`);
    sheet['!merges'].slice(0, 5).forEach((merge, index) => {
      console.log(`  ${index + 1}. ${XLSX.utils.encode_range(merge)}`);
    });
    if (sheet['!merges'].length > 5) {
      console.log(`  ... and ${sheet['!merges'].length - 5} more merged cells`);
    }
  } else {
    console.log('No merged cells found');
  }
  
  // Check for column widths
  if (sheet['!cols']) {
    console.log(`Column widths defined: ${sheet['!cols'].length} columns`);
    sheet['!cols'].slice(0, 3).forEach((col, index) => {
      if (col.wch) {
        console.log(`  Column ${index}: width = ${col.wch}`);
      }
    });
  }
  
  // Check for row heights
  if (sheet['!rows']) {
    console.log(`Row heights defined: ${sheet['!rows'].length} rows`);
    sheet['!rows'].slice(0, 3).forEach((row, index) => {
      if (row.hpt) {
        console.log(`  Row ${index}: height = ${row.hpt} points`);
      }
    });
  }
  
  // Show sample cells with values
  let cellCount = 0;
  for (const cellAddress in sheet) {
    if (cellAddress.startsWith('!')) continue; // Skip metadata
    
    const cell = sheet[cellAddress];
    if (cell && (cell.v !== undefined || cell.f !== undefined)) {
      console.log(`  ${cellAddress}: ${cell.v !== undefined ? `"${cell.v}"` : '[formula]'} ${cell.f ? `(formula: ${cell.f})` : ''}`);
      cellCount++;
      
      if (cellCount >= 5) break; // Limit output
    }
  }
});

// Check workbook-level formatting
console.log('\n=== WORKBOOK-LEVEL FORMATTING ===');
if (template.Workbook) {
  if (template.Workbook.Sheets) {
    console.log(`Styled sheets: ${template.Workbook.Sheets.length}`);
  }
  
  if (template.Workbook.Names) {
    console.log(`Defined names: ${Object.keys(template.Workbook.Names).length}`);
  }
}

console.log('\n=== TEMPLATE ANALYSIS COMPLETE ===');