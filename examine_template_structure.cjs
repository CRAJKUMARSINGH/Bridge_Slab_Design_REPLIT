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

console.log('\n=== DETAILED TEMPLATE STRUCTURE ANALYSIS ===');

// Examine the INSERT sheets in detail
const insertSheets = ['INSERT- HYDRAULICS', 'INSERT C1-ABUT', 'INSERT ESTIMATE'];

insertSheets.forEach(sheetName => {
  const sheet = template.Sheets[sheetName];
  if (!sheet) {
    console.log(`\n${sheetName}: Sheet not found`);
    return;
  }
  
  console.log(`\n--- ${sheetName} ---`);
  
  // Show sheet properties
  console.log(`Sheet range: ${sheet['!ref'] || 'undefined'}`);
  
  if (sheet['!cols']) {
    console.log(`Column definitions: ${sheet['!cols'].length} columns`);
  }
  
  if (sheet['!rows']) {
    console.log(`Row definitions: ${sheet['!rows'].length} rows`);
  }
  
  if (sheet['!merges']) {
    console.log(`Merged cells: ${sheet['!merges'].length} ranges`);
  }
  
  // Show all cells with data
  console.log('\nCells with data:');
  let cellCount = 0;
  for (const cellAddress in sheet) {
    if (cellAddress.startsWith('!')) continue; // Skip metadata
    
    const cell = sheet[cellAddress];
    if (cell) {
      if (cell.v !== undefined) {
        console.log(`  ${cellAddress}: "${cell.v}" (type: ${cell.t})`);
      } else if (cell.f !== undefined) {
        console.log(`  ${cellAddress}: [formula: ${cell.f}]`);
      } else {
        console.log(`  ${cellAddress}: [empty cell with formatting]`);
      }
      cellCount++;
    }
  }
  
  console.log(`Total cells: ${cellCount}`);
});

// Let's also examine some of the design sheets to understand the structure
const designSheets = ['HYDRAULICS', 'STABILITY CHECK FOR PIER', 'abstract of stresses'];

console.log('\n=== DESIGN SHEET REFERENCE STRUCTURE ===');
designSheets.forEach(sheetName => {
  const sheet = template.Sheets[sheetName];
  if (!sheet) {
    console.log(`\n${sheetName}: Sheet not found`);
    return;
  }
  
  console.log(`\n--- ${sheetName} ---`);
  console.log(`Sheet range: ${sheet['!ref'] || 'undefined'}`);
  console.log(`Merged cells: ${sheet['!merges'] ? sheet['!merges'].length : 0} ranges`);
  
  // Show first 5 cells with values
  console.log('Sample data cells:');
  let cellCount = 0;
  for (const cellAddress in sheet) {
    if (cellAddress.startsWith('!')) continue;
    
    const cell = sheet[cellAddress];
    if (cell && (cell.v !== undefined || cell.f !== undefined)) {
      const value = cell.v !== undefined ? `"${cell.v}"` : `[formula: ${cell.f}]`;
      console.log(`  ${cellAddress}: ${value}`);
      cellCount++;
      
      if (cellCount >= 5) break;
    }
  }
});

console.log('\n=== TEMPLATE ANALYSIS COMPLETE ===');