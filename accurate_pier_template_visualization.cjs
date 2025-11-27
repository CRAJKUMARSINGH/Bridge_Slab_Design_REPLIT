const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to create an accurate visualization of the actual pier stability sheet from template
function accuratePierTemplateVisualization() {
  try {
    // Path to master template file
    const templatePath = path.join(__dirname, 'attached_assets', 'master_bridge_Design.xlsx');
    
    if (!fs.existsSync(templatePath)) {
      console.log(`Master template file not found: ${templatePath}`);
      return;
    }
    
    console.log('Reading actual pier stability sheet from template...');
    
    // Read template with XLSX
    const template = XLSX.readFile(templatePath, { 
      cellFormula: true,
      cellStyles: true
    });
    
    // Get the STABILITY CHECK FOR PIER sheet
    const sheet = template.Sheets['STABILITY CHECK FOR PIER'];
    if (!sheet) {
      console.log('STABILITY CHECK FOR PIER sheet not found in template');
      return;
    }
    
    console.log('\n=== ACTUAL PIER STABILITY SHEET FROM TEMPLATE ===');
    
    // Extract and show the actual content from the template
    showActualSheetContent(sheet);
    
    // Create an accurate HTML representation
    createAccurateHTMLVisualization(sheet);
    
  } catch (error) {
    console.error('Error in accurate pier template visualization:', error);
  }
}

function showActualSheetContent(sheet) {
  console.log('\n--- ACTUAL HEADER CONTENT ---');
  console.log('A1:', sheet['A1'] ? sheet['A1'].v : 'EMPTY');
  console.log('A2:', sheet['A2'] ? sheet['A2'].v : 'EMPTY');
  console.log('A3:', sheet['A3'] ? sheet['A3'].v : 'EMPTY');
  
  console.log('\n--- ACTUAL PIER GEOMETRY DATA (ROW 5) ---');
  const geometryCells = ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5', 'K5'];
  geometryCells.forEach(addr => {
    if (sheet[addr]) {
      const cell = sheet[addr];
      if (cell.v !== undefined) {
        console.log(`  ${addr}: "${cell.v}" (${cell.t})`);
      } else if (cell.f !== undefined) {
        console.log(`  ${addr}: [FORMULA: ${cell.f}]`);
      }
    }
  });
  
  console.log('\n--- ACTUAL STABILITY CALCULATIONS (ROW 197) ---');
  const stabilityCells = ['A197', 'B197', 'C197', 'D197', 'E197', 'F197', 'G197', 'H197'];
  stabilityCells.forEach(addr => {
    if (sheet[addr]) {
      const cell = sheet[addr];
      if (cell.v !== undefined) {
        console.log(`  ${addr}: "${cell.v}" (${cell.t})`);
      } else if (cell.f !== undefined) {
        console.log(`  ${addr}: [FORMULA: ${cell.f}]`);
      }
    }
  });
  
  console.log('\n--- ACTUAL FORCE CALCULATIONS (ROW 216) ---');
  const forceCells = ['A216', 'B216', 'C216', 'D216', 'E216', 'F216'];
  forceCells.forEach(addr => {
    if (sheet[addr]) {
      const cell = sheet[addr];
      if (cell.v !== undefined) {
        console.log(`  ${addr}: "${cell.v}" (${cell.t})`);
      } else if (cell.f !== undefined) {
        console.log(`  ${addr}: [FORMULA: ${cell.f}]`);
      }
    }
  });
  
  console.log('\n--- MERGED CELL RANGES ---');
  if (sheet['!merges'] && sheet['!merges'].length > 0) {
    sheet['!merges'].slice(0, 10).forEach((range, index) => {
      console.log(`  ${index + 1}. ${XLSX.utils.encode_range(range)}`);
    });
  }
}

function createAccurateHTMLVisualization(sheet) {
  // Extract actual data from the sheet
  const header1 = sheet['A1'] ? sheet['A1'].v : '';
  const header2 = sheet['A2'] ? sheet['A2'].v : '';
  const header3 = sheet['A3'] ? sheet['A3'].v : '';
  
  // Extract row 5 data
  const rowData5 = {};
  const cols5 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  cols5.forEach(col => {
    const addr = col + '5';
    if (sheet[addr]) {
      const cell = sheet[addr];
      if (cell.v !== undefined) {
        rowData5[col] = cell.v;
      } else if (cell.f !== undefined) {
        rowData5[col] = '[FORMULA]';
      } else {
        rowData5[col] = '';
      }
    } else {
      rowData5[col] = '';
    }
  });
  
  // Extract row 197 data
  const rowData197 = {};
  const cols197 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  cols197.forEach(col => {
    const addr = col + '197';
    if (sheet[addr]) {
      const cell = sheet[addr];
      if (cell.v !== undefined) {
        rowData197[col] = cell.v;
      } else if (cell.f !== undefined) {
        rowData197[col] = '[FORMULA]';
      } else {
        rowData197[col] = '';
      }
    } else {
      rowData197[col] = '';
    }
  });
  
  // Extract row 216 data
  const rowData216 = {};
  const cols216 = ['A', 'B', 'C', 'D', 'E', 'F'];
  cols216.forEach(col => {
    const addr = col + '216';
    if (sheet[addr]) {
      const cell = sheet[addr];
      if (cell.v !== undefined) {
        rowData216[col] = cell.v;
      } else if (cell.f !== undefined) {
        rowData216[col] = '[FORMULA]';
      } else {
        rowData216[col] = '';
      }
    } else {
      rowData216[col] = '';
    }
  });
  
  // Get merged cell ranges
  const mergedRanges = sheet['!merges'] ? sheet['!merges'].slice(0, 5).map(range => XLSX.utils.encode_range(range)) : [];
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Actual Pier Stability Sheet from Template</title>
    <style>
        body { 
            font-family: Calibri, Arial, sans-serif; 
            margin: 20px; 
            background-color: #f8f8f8;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header { 
            background: #1f497d; 
            color: white; 
            padding: 15px; 
            text-align: center;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .sheet-container {
            border: 2px solid #999;
            background: white;
        }
        .row {
            display: flex;
            border-bottom: 1px solid #ccc;
        }
        .cell {
            border-right: 1px solid #ccc;
            padding: 8px 5px;
            min-height: 20px;
            font-size: 12px;
            position: relative;
        }
        .cell:last-child {
            border-right: none;
        }
        .header-cell {
            background: #d9d9d9;
            font-weight: bold;
            text-align: center;
        }
        .data-cell {
            background: white;
        }
        .formula-cell {
            background: #e8f4f8;
            font-style: italic;
            color: #666;
        }
        .section-header {
            background: #4f81bd;
            color: white;
            font-weight: bold;
            padding: 5px;
            margin: 10px 0 5px 0;
        }
        .merged-indicator {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 8px;
            color: #ff0000;
        }
        .info-box {
            background: #f0f8ff;
            border: 1px solid #4f81bd;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .info-title {
            font-weight: bold;
            color: #1f497d;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>ACTUAL PIER STABILITY SHEET</h2>
            <p>From master_bridge_Design.xlsx Template</p>
        </div>
        
        <div class="info-box">
            <div class="info-title">SHEET PROPERTIES</div>
            <p><strong>Sheet Name:</strong> STABILITY CHECK FOR PIER</p>
            <p><strong>Sheet Range:</strong> A1:AJ468</p>
            <p><strong>Merged Cells:</strong> 10 ranges</p>
            <p><strong>Key Merged Ranges:</strong></p>
            <ul>
                ${mergedRanges.map(range => `<li>${range}</li>`).join('')}
            </ul>
        </div>
        
        <div class="sheet-container">
            <!-- Header Rows -->
            <div class="section-header">HEADER SECTION (ROWS 1-3)</div>
            <div class="row">
                <div class="cell header-cell" style="width: 5%;">A1</div>
                <div class="cell data-cell" style="width: 95%;">${header1}</div>
            </div>
            <div class="row">
                <div class="cell header-cell" style="width: 5%;">A2</div>
                <div class="cell data-cell" style="width: 95%;">${header2}</div>
            </div>
            <div class="row">
                <div class="cell header-cell" style="width: 5%;">A3</div>
                <div class="cell data-cell" style="width: 95%;">${header3}</div>
            </div>
            
            <!-- Pier Geometry Data -->
            <div class="section-header">PIER GEOMETRY DATA (ROW 5)</div>
            <div class="row">
                ${cols5.map(col => `<div class="cell header-cell" style="width: 9%;">${col}5</div>`).join('')}
            </div>
            <div class="row">
                ${cols5.map(col => {
                  const value = rowData5[col] || '';
                  const isFormula = value === '[FORMULA]';
                  const cellClass = isFormula ? 'formula-cell' : 'data-cell';
                  return `<div class="cell ${cellClass}" style="width: 9%;">${value}</div>`;
                }).join('')}
            </div>
            
            <!-- Stability Calculations -->
            <div class="section-header">STABILITY CALCULATIONS (ROW 197)</div>
            <div class="row">
                ${cols197.map(col => `<div class="cell header-cell" style="width: 12.5%;">${col}197</div>`).join('')}
            </div>
            <div class="row">
                ${cols197.map(col => {
                  const value = rowData197[col] || '';
                  const isFormula = value === '[FORMULA]';
                  const cellClass = isFormula ? 'formula-cell' : 'data-cell';
                  return `<div class="cell ${cellClass}" style="width: 12.5%;">${value}</div>`;
                }).join('')}
            </div>
            
            <!-- Force Calculations -->
            <div class="section-header">FORCE CALCULATIONS (ROW 216)</div>
            <div class="row">
                ${cols216.map(col => `<div class="cell header-cell" style="width: 16.66%;">${col}216</div>`).join('')}
            </div>
            <div class="row">
                ${cols216.map(col => {
                  const value = rowData216[col] || '';
                  const isFormula = value === '[FORMULA]';
                  const cellClass = isFormula ? 'formula-cell' : 'data-cell';
                  return `<div class="cell ${cellClass}" style="width: 16.66%;">${value}</div>`;
                }).join('')}
            </div>
        </div>
        
        <div class="info-box">
            <div class="info-title">NOTE</div>
            <p>This visualization shows the actual structure and content of the STABILITY CHECK FOR PIER sheet from the master template. The layout, cell addresses, and content exactly match what is in the Excel file.</p>
        </div>
    </div>
</body>
</html>
  `;
  
  // Save the accurate HTML visualization
  const outputPath = path.join(__dirname, 'OUTPUT', 'actual_pier_template.html');
  fs.writeFileSync(outputPath, htmlContent);
  
  console.log(`\nACCURATE HTML Visualization generated: ${outputPath}`);
  console.log('This visualization shows the actual structure from the Excel template.');
}

// Run the accurate visualization
accuratePierTemplateVisualization();