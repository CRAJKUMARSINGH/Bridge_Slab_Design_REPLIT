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

console.log('\n=== TEXT FORMATTING ANALYSIS ===');

// Function to analyze text formatting in cells
function analyzeTextFormatting(sheet, sheetName) {
  console.log(`\n--- ${sheetName} ---`);
  
  // Look at the first few cells with values to understand formatting
  let cellCount = 0;
  for (const cellAddress in sheet) {
    if (cellAddress.startsWith('!')) continue; // Skip metadata
    
    const cell = sheet[cellAddress];
    if (cell && (cell.v !== undefined || cell.f !== undefined)) {
      console.log(`  ${cellAddress}: "${cell.v}"`);
      
      // Check for formatting if available
      if (cell.s) {
        console.log(`    Style properties:`);
        if (cell.s.alignment) {
          console.log(`      Alignment: ${JSON.stringify(cell.s.alignment)}`);
        }
        if (cell.s.font) {
          console.log(`      Font: ${JSON.stringify(cell.s.font)}`);
        }
        if (cell.s.fill) {
          console.log(`      Fill: ${JSON.stringify(cell.s.fill)}`);
        }
        if (cell.s.border) {
          console.log(`      Border: ${JSON.stringify(cell.s.border)}`);
        }
      }
      
      cellCount++;
      if (cellCount >= 3) break; // Limit output
    }
  }
}

// Function to check for text wrapping and center alignment specifically
function checkTextProperties(sheet, sheetName) {
  console.log(`\n--- ${sheetName} Text Properties ---`);
  
  let wrapTextCount = 0;
  let centerAlignCount = 0;
  let totalCount = 0;
  
  for (const cellAddress in sheet) {
    if (cellAddress.startsWith('!')) continue; // Skip metadata
    
    const cell = sheet[cellAddress];
    if (cell && cell.s) {
      totalCount++;
      
      if (cell.s.alignment) {
        if (cell.s.alignment.wrapText) {
          wrapTextCount++;
          if (wrapTextCount <= 3) { // Show first 3 examples
            console.log(`  Wrap Text: ${cellAddress} - "${cell.v}"`);
          }
        }
        
        if (cell.s.alignment.horizontal === 'center') {
          centerAlignCount++;
          if (centerAlignCount <= 3) { // Show first 3 examples
            console.log(`  Center Align: ${cellAddress} - "${cell.v}"`);
          }
        }
      }
    }
  }
  
  console.log(`  Total cells with styles: ${totalCount}`);
  console.log(`  Cells with text wrapping: ${wrapTextCount}`);
  console.log(`  Cells with center alignment: ${centerAlignCount}`);
}

// Analyze key sheets
const keySheets = ['INSERT- HYDRAULICS', 'HYDRAULICS', 'STABILITY CHECK FOR PIER', 'abstract of stresses'];

keySheets.forEach(sheetName => {
  const sheet = template.Sheets[sheetName];
  if (!sheet) {
    console.log(`\n${sheetName}: Sheet not found`);
    return;
  }
  
  analyzeTextFormatting(sheet, sheetName);
  checkTextProperties(sheet, sheetName);
});

console.log('\n=== MERGED CELLS DETAILED ANALYSIS ===');
keySheets.forEach(sheetName => {
  const sheet = template.Sheets[sheetName];
  if (!sheet || !sheet['!merges'] || sheet['!merges'].length === 0) {
    return;
  }
  
  console.log(`\n${sheetName} - Merged Cell Ranges:`);
  sheet['!merges'].forEach((merge, index) => {
    const range = XLSX.utils.encode_range(merge);
    console.log(`  ${index + 1}. ${range}`);
    
    // Show what's in the first cell of the merged range
    const firstCell = sheet[merge.s.r + 1 + String.fromCharCode(65 + merge.s.c)];
    if (firstCell && firstCell.v) {
      console.log(`     Content: "${firstCell.v}"`);
    }
  });
});

console.log('\n=== TEMPLATE ANALYSIS COMPLETE ===');