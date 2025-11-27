const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Simple inspection of the template
function simpleTemplateInspection() {
  try {
    console.log('=== SIMPLE TEMPLATE INSPECTION ===');
    
    // Path to master template file
    const templatePath = path.join(__dirname, 'attached_assets', 'master_bridge_Design.xlsx');
    
    if (!fs.existsSync(templatePath)) {
      console.error(`❌ Master template file not found: ${templatePath}`);
      return;
    }
    
    console.log(`✅ Found template file: ${templatePath}`);
    
    // Read template with minimal options
    const template = XLSX.readFile(templatePath);
    
    console.log(`✅ Template loaded successfully`);
    console.log(`📊 Total Sheets: ${template.SheetNames.length}`);
    
    // List all sheet names
    console.log('\n=== SHEET NAMES ===');
    template.SheetNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
    // Check for problematic sheet names
    console.log('\n=== CHECKING FOR PROBLEMATIC SHEETS ===');
    template.SheetNames.forEach(name => {
      if (name.includes('INDEX') || name.includes('index')) {
        console.log(`⚠️  Found potentially problematic sheet: ${name}`);
      }
    });
    
    // Inspect first few sheets in detail
    console.log('\n=== DETAILED INSPECTION OF FIRST 10 SHEETS ===');
    const firstTenSheets = template.SheetNames.slice(0, 10);
    
    firstTenSheets.forEach((sheetName, index) => {
      console.log(`\n--- Sheet ${index + 1}: ${sheetName} ---`);
      
      try {
        const sheet = template.Sheets[sheetName];
        if (!sheet) {
          console.log('  ❌ Sheet object is null/undefined');
          return;
        }
        
        console.log(`  Range: ${sheet['!ref'] || 'undefined'}`);
        console.log(`  Merged cells: ${sheet['!merges'] ? sheet['!merges'].length : 0}`);
        
        // Count cells
        let cellCount = 0;
        for (const addr in sheet) {
          if (!addr.startsWith('!')) {
            cellCount++;
          }
        }
        console.log(`  Total cells: ${cellCount}`);
        
      } catch (sheetError) {
        console.log(`  ❌ Error inspecting sheet: ${sheetError.message}`);
      }
    });
    
    // Check key sheets
    console.log('\n=== KEY SHEETS INSPECTION ===');
    const keySheets = [
      'INSERT- HYDRAULICS',
      'INSERT C1-ABUT', 
      'INSERT ESTIMATE',
      'STABILITY CHECK FOR PIER'
    ];
    
    keySheets.forEach(sheetName => {
      console.log(`\n--- ${sheetName} ---`);
      
      if (!template.Sheets[sheetName]) {
        console.log('  ❌ NOT FOUND');
        return;
      }
      
      const sheet = template.Sheets[sheetName];
      console.log(`  Range: ${sheet['!ref'] || 'undefined'}`);
      console.log(`  Merged cells: ${sheet['!merges'] ? sheet['!merges'].length : 0}`);
      
      // Show sample data
      let count = 0;
      for (const addr in sheet) {
        if (!addr.startsWith('!') && count < 5) {
          const cell = sheet[addr];
          if (cell && cell.v !== undefined) {
            console.log(`  ${addr}: "${String(cell.v).substring(0, 30)}"...`);
            count++;
          }
        }
      }
    });
    
    // Test template preservation
    console.log('\n=== TEMPLATE PRESERVATION TEST ===');
    try {
      const buffer = XLSX.write(template, { type: 'buffer', bookType: 'xlsx' });
      console.log(`✅ Template preservation test successful (${(buffer.length/1024).toFixed(2)} KB)`);
      
      // Save test file
      const testPath = path.join(__dirname, 'OUTPUT', 'template_inspection_test.xlsx');
      fs.writeFileSync(testPath, buffer);
      console.log(`💾 Test file saved: ${testPath}`);
      
    } catch (writeError) {
      console.log(`❌ Template preservation failed: ${writeError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error in simple template inspection:', error);
  }
}

// Run the inspection
simpleTemplateInspection();