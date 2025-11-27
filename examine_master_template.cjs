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

// Read template with XLSX (preserves formulas)
const template = XLSX.readFile(templatePath, { 
  cellFormula: true,
  cellStyles: true,
  bookVBA: true,
  bookFiles: true
});

console.log('\n=== TEMPLATE STRUCTURE ===');
console.log(`Number of sheets: ${template.SheetNames.length}`);
console.log('Sheet names:');
template.SheetNames.forEach((name, index) => {
  console.log(`  ${index + 1}. ${name}`);
});

console.log('\n=== SHEET DETAILS ===');
// Show details for first few sheets
const sheetNamesToShow = template.SheetNames.slice(0, 10); // Show first 10 sheets
sheetNamesToShow.forEach(sheetName => {
  const sheet = template.Sheets[sheetName];
  console.log(`\n--- ${sheetName} ---`);
  
  // Get range of cells
  if (sheet['!ref']) {
    console.log(`Cell range: ${sheet['!ref']}`);
  }
  
  // Show first few cells with values
  let cellCount = 0;
  for (const cell in sheet) {
    if (cell.startsWith('!')) continue; // Skip metadata
    
    const cellValue = sheet[cell];
    if (cellValue && (cellValue.v !== undefined || cellValue.f !== undefined)) {
      console.log(`  ${cell}: ${cellValue.v !== undefined ? cellValue.v : '[formula]'} ${cellValue.f ? `(formula: ${cellValue.f})` : ''}`);
      cellCount++;
      
      if (cellCount >= 5) break; // Limit output
    }
  }
  
  if (cellCount === 0) {
    console.log('  (No data cells found)');
  }
});

console.log('\n=== FIRST INPUTS SHEET ANALYSIS ===');
// Look for a sheet that might contain inputs
const inputSheetName = template.SheetNames.find(name => 
  name.toUpperCase().includes('INPUT') || 
  name.toUpperCase().includes('DATA') ||
  name.toUpperCase().includes('PARAM')
);

if (inputSheetName) {
  console.log(`Found potential input sheet: ${inputSheetName}`);
  const inputSheet = template.Sheets[inputSheetName];
  
  // Show more cells from this sheet
  console.log(`\n--- ${inputSheetName} (Detailed View) ---`);
  if (inputSheet['!ref']) {
    console.log(`Cell range: ${inputSheet['!ref']}`);
  }
  
  let cellCount = 0;
  for (const cell in inputSheet) {
    if (cell.startsWith('!')) continue; // Skip metadata
    
    const cellValue = inputSheet[cell];
    if (cellValue && (cellValue.v !== undefined || cellValue.f !== undefined)) {
      console.log(`  ${cell}: ${cellValue.v !== undefined ? cellValue.v : '[formula]'} ${cellValue.f ? `(formula: ${cellValue.f})` : ''}`);
      cellCount++;
      
      if (cellCount >= 20) break; // Show more cells for input sheet
    }
  }
} else {
  console.log('No obvious input sheet found');
}

console.log('\n=== TEMPLATE ANALYSIS COMPLETE ===');