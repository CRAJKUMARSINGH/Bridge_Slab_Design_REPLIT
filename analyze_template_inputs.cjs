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

// Look for sheets that might contain input parameters
console.log('\n=== POTENTIAL INPUT SHEETS ===');
const potentialInputSheets = template.SheetNames.filter(name => 
  name.toUpperCase().includes('INSERT') || 
  name.toUpperCase().includes('INPUT') || 
  name.toUpperCase().includes('DATA') ||
  name.toUpperCase().includes('PARAM') ||
  name.toUpperCase().includes('HYDRAULIC') ||
  name.toUpperCase().includes('AFFLUX')
);

if (potentialInputSheets.length > 0) {
  potentialInputSheets.forEach(sheetName => {
    console.log(`- ${sheetName}`);
  });
} else {
  console.log('No obvious input sheets found');
}

// Analyze the "INSERT- HYDRAULICS" sheet in detail
console.log('\n=== ANALYZING "INSERT- HYDRAULICS" SHEET ===');
const insertHydraulicsSheet = template.Sheets['INSERT- HYDRAULICS'];
if (insertHydraulicsSheet) {
  console.log('Sheet exists but may be empty or hidden');
  if (insertHydraulicsSheet['!ref']) {
    console.log(`Cell range: ${insertHydraulicsSheet['!ref']}`);
    
    // Show all cells with values
    let cellCount = 0;
    for (const cell in insertHydraulicsSheet) {
      if (cell.startsWith('!')) continue; // Skip metadata
      
      const cellValue = insertHydraulicsSheet[cell];
      if (cellValue && (cellValue.v !== undefined || cellValue.f !== undefined)) {
        console.log(`  ${cell}: ${cellValue.v !== undefined ? cellValue.v : '[formula]'} ${cellValue.f ? `(formula: ${cellValue.f})` : ''}`);
        cellCount++;
      }
    }
    
    if (cellCount === 0) {
      console.log('  (No data cells found - sheet appears to be empty or for input)');
    }
  } else {
    console.log('  (No cell range defined - likely an input sheet)');
  }
} else {
  console.log('Sheet does not exist');
}

// Analyze the "INSERT C1-ABUT" sheet in detail
console.log('\n=== ANALYZING "INSERT C1-ABUT" SHEET ===');
const insertAbutSheet = template.Sheets['INSERT C1-ABUT'];
if (insertAbutSheet) {
  console.log('Sheet exists');
  if (insertAbutSheet['!ref']) {
    console.log(`Cell range: ${insertAbutSheet['!ref']}`);
    
    // Show all cells with values
    let cellCount = 0;
    for (const cell in insertAbutSheet) {
      if (cell.startsWith('!')) continue; // Skip metadata
      
      const cellValue = insertAbutSheet[cell];
      if (cellValue && (cellValue.v !== undefined || cellValue.f !== undefined)) {
        console.log(`  ${cell}: ${cellValue.v !== undefined ? cellValue.v : '[formula]'} ${cellValue.f ? `(formula: ${cellValue.f})` : ''}`);
        cellCount++;
      }
    }
    
    if (cellCount === 0) {
      console.log('  (No data cells found - sheet appears to be empty or for input)');
    }
  } else {
    console.log('  (No cell range defined - likely an input sheet)');
  }
} else {
  console.log('Sheet does not exist');
}

// Analyze the "INSERT ESTIMATE" sheet in detail
console.log('\n=== ANALYZING "INSERT ESTIMATE" SHEET ===');
const insertEstimateSheet = template.Sheets['INSERT ESTIMATE'];
if (insertEstimateSheet) {
  console.log('Sheet exists');
  if (insertEstimateSheet['!ref']) {
    console.log(`Cell range: ${insertEstimateSheet['!ref']}`);
    
    // Show all cells with values
    let cellCount = 0;
    for (const cell in insertEstimateSheet) {
      if (cell.startsWith('!')) continue; // Skip metadata
      
      const cellValue = insertEstimateSheet[cell];
      if (cellValue && (cellValue.v !== undefined || cellValue.f !== undefined)) {
        console.log(`  ${cell}: ${cellValue.v !== undefined ? cellValue.v : '[formula]'} ${cellValue.f ? `(formula: ${cellValue.f})` : ''}`);
        cellCount++;
      }
    }
    
    if (cellCount === 0) {
      console.log('  (No data cells found - sheet appears to be empty or for input)');
    }
  } else {
    console.log('  (No cell range defined - likely an input sheet)');
  }
} else {
  console.log('Sheet does not exist');
}

// Look for any sheet with "INSERT" in the name
console.log('\n=== ALL "INSERT" SHEETS ===');
const insertSheets = template.SheetNames.filter(name => name.toUpperCase().includes('INSERT'));
insertSheets.forEach(sheetName => {
  console.log(`- ${sheetName}`);
});

console.log('\n=== TEMPLATE ANALYSIS COMPLETE ===');