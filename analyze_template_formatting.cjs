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
  bookFiles: true,
  cellNF: true,  // Number formats
  cellHTML: true // HTML content
});

console.log('\n=== TEMPLATE FORMATTING ANALYSIS ===');
console.log(`Number of sheets: ${template.SheetNames.length}`);

// Function to analyze cell formatting
function analyzeCellFormatting(sheet, cellAddress) {
  const cell = sheet[cellAddress];
  if (!cell) return null;
  
  const formatting = {
    address: cellAddress,
    value: cell.v,
    type: cell.t,
    formula: cell.f,
    style: cell.s
  };
  
  return formatting;
}

// Analyze a few key sheets
const keySheets = ['INSERT- HYDRAULICS', 'HYDRAULICS', 'STABILITY CHECK FOR PIER', 'abstract of stresses'];

keySheets.forEach(sheetName => {
  const sheet = template.Sheets[sheetName];
  if (!sheet) {
    console.log(`\n${sheetName}: Sheet not found`);
    return;
  }
  
  console.log(`\n--- ${sheetName} ---`);
  
  // Get basic info
  if (sheet['!ref']) {
    console.log(`Cell range: ${sheet['!ref']}`);
  }
  
  // Check if sheet has styles
  console.log(`Has styles: ${!!sheet['!cols'] || !!sheet['!rows']}`);
  
  if (sheet['!cols']) {
    console.log(`Column styles: ${sheet['!cols'].length} columns with formatting`);
  }
  
  if (sheet['!rows']) {
    console.log(`Row styles: ${sheet['!rows'].length} rows with formatting`);
  }
  
  // Show a few sample cells with their formatting
  let cellCount = 0;
  for (const cellAddress in sheet) {
    if (cellAddress.startsWith('!')) continue; // Skip metadata
    
    const cell = sheet[cellAddress];
    if (cell && (cell.v !== undefined || cell.f !== undefined)) {
      console.log(`  ${cellAddress}: ${cell.v !== undefined ? cell.v : '[formula]'} ${cell.f ? `(formula: ${cell.f})` : ''}`);
      
      // Show style info if available
      if (cell.s) {
        console.log(`    Style: ${JSON.stringify(cell.s)}`);
      }
      
      cellCount++;
      if (cellCount >= 3) break; // Limit output
    }
  }
});

// Check if the workbook has styles
console.log('\n=== WORKBOOK-LEVEL FORMATTING ===');
console.log(`Has workbook styles: ${!!template.Workbook && !!template.Workbook.Sheets}`);
if (template.Workbook && template.Workbook.Sheets) {
  console.log(`Number of styled sheets: ${template.Workbook.Sheets.length}`);
}

console.log('\n=== TEMPLATE ANALYSIS COMPLETE ===');