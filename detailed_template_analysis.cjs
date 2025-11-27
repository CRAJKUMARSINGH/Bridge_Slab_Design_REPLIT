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

console.log('\n=== DETAILED TEMPLATE ANALYSIS ===');
console.log(`Number of sheets: ${template.SheetNames.length}`);

// Function to get all cells with data in a sheet
function getSheetCells(sheet) {
  const cells = [];
  for (const cell in sheet) {
    if (cell.startsWith('!')) continue; // Skip metadata
    const cellValue = sheet[cell];
    if (cellValue && (cellValue.v !== undefined || cellValue.f !== undefined)) {
      cells.push({
        address: cell,
        value: cellValue.v,
        formula: cellValue.f,
        type: cellValue.t
      });
    }
  }
  return cells;
}

// Function to find input cells (cells that might be for user input)
function findInputCells(sheet) {
  const cells = getSheetCells(sheet);
  // Look for cells that have values but no formulas - these are likely input cells
  return cells.filter(cell => cell.value !== undefined && cell.formula === undefined);
}

// Function to find formula cells that reference other sheets
function findFormulaReferences(sheet, sheetName) {
  const cells = getSheetCells(sheet);
  // Look for cells with formulas
  return cells.filter(cell => cell.formula !== undefined)
    .map(cell => ({
      address: cell.address,
      formula: cell.formula,
      referencesSheet: cell.formula.includes(sheetName)
    }))
    .filter(cell => cell.referencesSheet);
}

// Analyze key sheets for input data
const keySheets = [
  'INSERT- HYDRAULICS',
  'INSERT C1-ABUT',
  'INSERT ESTIMATE',
  'HYDRAULICS',
  'STABILITY CHECK FOR PIER',
  'C1-STABILITY CHECK ABUTMENT',
  'abstract of stresses',
  'Abstract'
];

console.log('\n=== KEY SHEET ANALYSIS ===');
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
  
  // Get all cells
  const allCells = getSheetCells(sheet);
  console.log(`Total cells with data: ${allCells.length}`);
  
  // Get input cells (no formula)
  const inputCells = findInputCells(sheet);
  if (inputCells.length > 0) {
    console.log(`Input cells (no formula): ${inputCells.length}`);
    inputCells.slice(0, 10).forEach(cell => {
      console.log(`  ${cell.address}: ${cell.value} (${cell.type || 'unknown type'})`);
    });
    if (inputCells.length > 10) {
      console.log(`  ... and ${inputCells.length - 10} more input cells`);
    }
  }
  
  // Get formula cells
  const formulaCells = allCells.filter(cell => cell.formula !== undefined);
  if (formulaCells.length > 0) {
    console.log(`Formula cells: ${formulaCells.length}`);
    formulaCells.slice(0, 5).forEach(cell => {
      console.log(`  ${cell.address}: ${cell.formula}`);
    });
    if (formulaCells.length > 5) {
      console.log(`  ... and ${formulaCells.length - 5} more formula cells`);
    }
  }
  
  // For INSERT sheets, show more details since they're likely for input
  if (sheetName.includes('INSERT')) {
    console.log('Detailed cell analysis for INSERT sheet:');
    allCells.slice(0, 20).forEach(cell => {
      console.log(`  ${cell.address}: ${cell.value !== undefined ? cell.value : '[no value]'} ${cell.formula ? `(formula: ${cell.formula})` : ''}`);
    });
  }
});

// Look for cross-sheet references
console.log('\n=== CROSS-SHEET REFERENCES ===');
const insertSheets = keySheets.filter(name => name.includes('INSERT'));
const designSheets = keySheets.filter(name => !name.includes('INSERT'));

// Check which design sheets reference INSERT sheets
designSheets.forEach(designSheetName => {
  const designSheet = template.Sheets[designSheetName];
  if (!designSheet) return;
  
  insertSheets.forEach(insertSheetName => {
    const references = findFormulaReferences(designSheet, insertSheetName);
    if (references.length > 0) {
      console.log(`${designSheetName} references ${insertSheetName}:`);
      references.slice(0, 3).forEach(ref => {
        console.log(`  ${ref.address}: ${ref.formula}`);
      });
      if (references.length > 3) {
        console.log(`  ... and ${references.length - 3} more references`);
      }
    }
  });
});

// Try to identify input parameter locations
console.log('\n=== POTENTIAL INPUT PARAMETER LOCATIONS ===');

// Check the INSERT- HYDRAULICS sheet more thoroughly
const hydraulicsInsertSheet = template.Sheets['INSERT- HYDRAULICS'];
if (hydraulicsInsertSheet) {
  console.log('\nINSERT- HYDRAULICS sheet:');
  if (!hydraulicsInsertSheet['!ref']) {
    console.log('  No cell range - likely completely empty for user input');
  } else {
    console.log(`  Cell range: ${hydraulicsInsertSheet['!ref']}`);
    const cells = getSheetCells(hydraulicsInsertSheet);
    if (cells.length === 0) {
      console.log('  No cells with data - ready for user input');
    } else {
      console.log('  Cells with data:');
      cells.forEach(cell => {
        console.log(`    ${cell.address}: ${cell.value} ${cell.formula ? `(formula: ${cell.formula})` : ''}`);
      });
    }
  }
}

console.log('\n=== TEMPLATE ANALYSIS COMPLETE ===');