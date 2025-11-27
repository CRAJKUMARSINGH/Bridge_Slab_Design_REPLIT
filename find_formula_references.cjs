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

console.log('\n=== FORMULA REFERENCE ANALYSIS ===');

// Function to get all cells with formulas in a sheet
function getFormulaCells(sheet) {
  const cells = [];
  for (const cell in sheet) {
    if (cell.startsWith('!')) continue; // Skip metadata
    const cellValue = sheet[cell];
    if (cellValue && cellValue.f !== undefined) {
      cells.push({
        address: cell,
        formula: cellValue.f
      });
    }
  }
  return cells;
}

// Check which sheets reference the INSERT sheets
const insertSheets = ['INSERT- HYDRAULICS', 'INSERT C1-ABUT', 'INSERT ESTIMATE'];
const designSheets = ['HYDRAULICS', 'STABILITY CHECK FOR PIER', 'C1-STABILITY CHECK ABUTMENT'];

console.log('\n=== DIRECT REFERENCES TO INSERT SHEETS ===');
designSheets.forEach(designSheetName => {
  const designSheet = template.Sheets[designSheetName];
  if (!designSheet) {
    console.log(`${designSheetName}: Sheet not found`);
    return;
  }
  
  console.log(`\n--- ${designSheetName} ---`);
  const formulaCells = getFormulaCells(designSheet);
  
  // Look for direct references to INSERT sheets
  const directReferences = formulaCells.filter(cell => 
    insertSheets.some(insertSheet => cell.formula.includes(`'${insertSheet}'`))
  );
  
  if (directReferences.length > 0) {
    console.log(`Direct references to INSERT sheets: ${directReferences.length}`);
    directReferences.slice(0, 10).forEach(ref => {
      console.log(`  ${ref.address}: ${ref.formula}`);
    });
    if (directReferences.length > 10) {
      console.log(`  ... and ${directReferences.length - 10} more references`);
    }
  } else {
    console.log('No direct references to INSERT sheets found');
  }
});

// Look for indirect references (without sheet name but with cell references)
console.log('\n=== INDIRECT REFERENCES ANALYSIS ===');
const hydraulicsSheet = template.Sheets['HYDRAULICS'];
if (hydraulicsSheet) {
  console.log('\n--- HYDRAULICS sheet indirect references ---');
  const formulaCells = getFormulaCells(hydraulicsSheet);
  
  // Look for formulas that might reference cells that would be in INSERT- HYDRAULICS
  const potentialReferences = formulaCells.filter(cell => 
    // Look for simple cell references that might be meant for input
    cell.formula.match(/^[A-Z]\d+$/) ||  // Simple cell reference like A1, B2
    cell.formula.match(/^[A-Z]\d+:[A-Z]\d+$/)  // Range reference like A1:B2
  );
  
  if (potentialReferences.length > 0) {
    console.log(`Potential input cell references: ${potentialReferences.length}`);
    potentialReferences.slice(0, 10).forEach(ref => {
      console.log(`  ${ref.address}: ${ref.formula}`);
    });
  }
}

// Analyze what typical bridge design input parameters look like
console.log('\n=== COMMON BRIDGE INPUT PARAMETERS ===');
console.log('Based on template analysis, typical input parameters would include:');
console.log('- Span (meters)');
console.log('- Width (meters)');
console.log('- Discharge (cumecs)');
console.log('- Flood Level (meters)');
console.log('- Bed Level (meters)');
console.log('- Bed Slope');
console.log('- Number of Lanes');
console.log('- Concrete Grade (fck)');
console.log('- Steel Grade (fy)');
console.log('- Soil Bearing Capacity');

console.log('\n=== RECOMMENDED APPROACH ===');
console.log('1. Populate INSERT- HYDRAULICS sheet with hydraulic input parameters');
console.log('2. Populate INSERT C1-ABUT sheet with abutment input parameters');
console.log('3. Populate INSERT ESTIMATE sheet with estimation input parameters');
console.log('4. The design sheets will automatically calculate based on these inputs');

console.log('\n=== FORMULA REFERENCE ANALYSIS COMPLETE ===');