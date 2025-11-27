const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to visualize the pier stability sheet structure
function visualizePierSheet() {
  try {
    // Path to master template file
    const templatePath = path.join(__dirname, 'attached_assets', 'master_bridge_Design.xlsx');
    
    if (!fs.existsSync(templatePath)) {
      console.log(`Master template file not found: ${templatePath}`);
      return;
    }
    
    console.log('Reading pier stability sheet from template...');
    
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
    
    console.log('\n=== PIER STABILITY SHEET STRUCTURE ===');
    console.log(`Sheet range: ${sheet['!ref'] || 'undefined'}`);
    console.log(`Merged cells: ${sheet['!merges'] ? sheet['!merges'].length : 0} ranges`);
    
    // Show header information
    console.log('\n--- HEADER SECTION ---');
    if (sheet['A1'] && sheet['A1'].v) {
      console.log(`A1: ${sheet['A1'].v}`);
    }
    if (sheet['A2'] && sheet['A2'].v) {
      console.log(`A2: ${sheet['A2'].v}`);
    }
    if (sheet['A3'] && sheet['A3'].v) {
      console.log(`A3: ${sheet['A3'].v}`);
    }
    
    // Show design data area (around row 5)
    console.log('\n--- DESIGN DATA AREA (ROW 5) ---');
    const row5Cells = ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5', 'K5'];
    row5Cells.forEach(cellAddr => {
      if (sheet[cellAddr]) {
        const cell = sheet[cellAddr];
        if (cell.v !== undefined) {
          console.log(`  ${cellAddr}: "${cell.v}" (type: ${cell.t})`);
        } else if (cell.f !== undefined) {
          console.log(`  ${cellAddr}: [FORMULA: ${cell.f}]`);
        }
      }
    });
    
    // Show stability calculation area (around row 197)
    console.log('\n--- STABILITY CALCULATION AREA (ROW 197) ---');
    const row197Cells = ['A197', 'B197', 'C197', 'D197', 'E197', 'F197', 'G197', 'H197', 'I197', 'J197', 'K197'];
    row197Cells.forEach(cellAddr => {
      if (sheet[cellAddr]) {
        const cell = sheet[cellAddr];
        if (cell.v !== undefined) {
          console.log(`  ${cellAddr}: "${cell.v}" (type: ${cell.t})`);
        } else if (cell.f !== undefined) {
          console.log(`  ${cellAddr}: [FORMULA: ${cell.f}]`);
        }
      }
    });
    
    // Show forces calculation area (around row 216)
    console.log('\n--- FORCES CALCULATION AREA (ROW 216) ---');
    const row216Cells = ['A216', 'B216', 'C216', 'D216', 'E216', 'F216', 'G216', 'H216', 'I216', 'J216', 'K216'];
    row216Cells.forEach(cellAddr => {
      if (sheet[cellAddr]) {
        const cell = sheet[cellAddr];
        if (cell.v !== undefined) {
          console.log(`  ${cellAddr}: "${cell.v}" (type: ${cell.t})`);
        } else if (cell.f !== undefined) {
          console.log(`  ${cellAddr}: [FORMULA: ${cell.f}]`);
        }
      }
    });
    
    // Show sample of merged cells if any
    if (sheet['!merges'] && sheet['!merges'].length > 0) {
      console.log('\n--- MERGED CELL RANGES ---');
      sheet['!merges'].slice(0, 5).forEach((range, index) => {
        console.log(`  ${index + 1}. ${XLSX.utils.encode_range(range)}`);
      });
      if (sheet['!merges'].length > 5) {
        console.log(`  ... and ${sheet['!merges'].length - 5} more merged ranges`);
      }
    }
    
    // Create a text-based visualization of the sheet structure
    createTextVisualization(sheet);
    
  } catch (error) {
    console.error('Error visualizing pier sheet:', error);
  }
}

function createTextVisualization(sheet) {
  console.log('\n=== TEXT-BASED VISUALIZATION ===');
  console.log('This is a simplified representation of the pier stability sheet structure:');
  
  const visualization = `
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STABILITY CHECK FOR PIER SHEET                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A1: DESIGN OF PIER AND CHECK FOR STABILITY - SUBMERSIBLE BRIDGE            │
│ A2: Name Of Work :- Construction of Submersible Bridge                     │
│ A3: DESIGN DATA                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ROW 5 - PIER GEOMETRY DATA                                                 │
│ ┌─────┬────────────┬─────┬──────────┬─────┬─────────┬─────────────────────┐ │
│ │ A5  │     B5     │ C5  │    D5    │ E5  │   F5    │        K5           │ │
│ │  1  │ RIGHT EFF. │  =  │ [FORMULA]│7.6M │ DEGREE  │      DEGREES        │ │
│ │     │   SPAN     │     │          │     │ OF SKEW │                     │ │
│ └─────┴────────────┴─────┴──────────┴─────┴─────────┴─────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ ROW 197 - STABILITY CALCULATIONS                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ B197: BASE PRESSURE CALCULATION                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ ROW 216 - FORCE CALCULATIONS                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ D216: [NUMERIC VALUE]                                                   │ │
│ │ D219: [NUMERIC VALUE]                                                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ MERGED CELLS: 10 ranges                                                    │
│ EXAMPLE MERGED RANGES:                                                     │
│  1. A1:F1 (Header spanning across columns)                                 │
│  2. A3:K3 (Section header)                                                 │
│  3. ...                                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
  `;
  
  console.log(visualization);
  
  // Also create a simple HTML visualization
  createHTMLVisualization();
}

function createHTMLVisualization() {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Pier Stability Sheet Visualization</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f0f0f0; }
        .container { max-width: 1000px; margin: 0 auto; }
        .sheet { 
            background: white; 
            border: 2px solid #333; 
            border-radius: 5px; 
            padding: 20px; 
            margin: 20px 0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header { 
            background: #2c3e50; 
            color: white; 
            padding: 15px; 
            border-radius: 5px;
            text-align: center;
            margin-bottom: 20px;
        }
        .section { 
            border: 1px solid #ddd; 
            border-radius: 5px; 
            margin: 15px 0; 
            overflow: hidden;
        }
        .section-header { 
            background: #3498db; 
            color: white; 
            padding: 10px; 
            font-weight: bold;
        }
        .cell-row { 
            display: flex; 
            border-bottom: 1px solid #eee;
        }
        .cell { 
            flex: 1; 
            padding: 10px; 
            border-right: 1px solid #eee;
            min-height: 20px;
        }
        .cell:last-child { border-right: none; }
        .formula-cell { background-color: #e8f4f8; font-style: italic; }
        .numeric-cell { background-color: #fff8e1; text-align: right; }
        .header-cell { background-color: #e3f2fd; font-weight: bold; }
        .merged-cell { background-color: #fce4ec; }
        .legend { 
            background: #f8f9fa; 
            border: 1px solid #dee2e6; 
            border-radius: 5px; 
            padding: 15px; 
            margin: 20px 0;
        }
        .legend-item { 
            display: inline-block; 
            margin: 5px 15px; 
            padding: 5px 10px; 
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PIER STABILITY SHEET VISUALIZATION</h1>
            <p>STABILITY CHECK FOR PIER - Template Structure Analysis</p>
        </div>
        
        <div class="legend">
            <h3>Cell Type Legend:</h3>
            <span class="legend-item" style="background-color: #e3f2fd;">Header Cell</span>
            <span class="legend-item" style="background-color: #e8f4f8;">Formula Cell</span>
            <span class="legend-item" style="background-color: #fff8e1;">Numeric Cell</span>
            <span class="legend-item" style="background-color: #fce4ec;">Merged Cell</span>
        </div>
        
        <div class="sheet">
            <div class="section">
                <div class="section-header">HEADER SECTION (ROWS 1-3)</div>
                <div class="cell-row">
                    <div class="cell header-cell">A1</div>
                    <div class="cell" colspan="10">DESIGN OF PIER AND CHECK FOR STABILITY - SUBMERSIBLE BRIDGE</div>
                </div>
                <div class="cell-row">
                    <div class="cell header-cell">A2</div>
                    <div class="cell" colspan="10">Name Of Work :- Construction of Submersible Bridge on ON KHERWARA - JAWAS - SUVERI ROAD IN KM 9/000, ACROSS RIVER SOM</div>
                </div>
                <div class="cell-row">
                    <div class="cell header-cell">A3</div>
                    <div class="cell" colspan="10">DESIGN DATA</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">PIER GEOMETRY DATA (ROW 5)</div>
                <div class="cell-row">
                    <div class="cell header-cell">A5</div>
                    <div class="cell header-cell">B5</div>
                    <div class="cell header-cell">C5</div>
                    <div class="cell header-cell">D5</div>
                    <div class="cell header-cell">E5</div>
                    <div class="cell header-cell">F5</div>
                    <div class="cell header-cell">G5</div>
                    <div class="cell header-cell">H5</div>
                    <div class="cell header-cell">I5</div>
                    <div class="cell header-cell">J5</div>
                    <div class="cell header-cell">K5</div>
                </div>
                <div class="cell-row">
                    <div class="cell numeric-cell">1</div>
                    <div class="cell">RIGHT EFFECTIVE SPAN</div>
                    <div class="cell">=</div>
                    <div class="cell formula-cell">[FORMULA]</div>
                    <div class="cell numeric-cell">7.6 M</div>
                    <div class="cell">DEGREE</div>
                    <div class="cell">OF SKEW</div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell">DEGREES</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">STABILITY CALCULATIONS (ROW 197)</div>
                <div class="cell-row">
                    <div class="cell header-cell">A197</div>
                    <div class="cell header-cell">B197</div>
                    <div class="cell header-cell">C197</div>
                    <div class="cell header-cell">D197</div>
                    <div class="cell header-cell">E197</div>
                </div>
                <div class="cell-row">
                    <div class="cell"></div>
                    <div class="cell">BASE PRESSURE CALCULATION</div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">FORCE CALCULATIONS (ROW 216)</div>
                <div class="cell-row">
                    <div class="cell header-cell">A216</div>
                    <div class="cell header-cell">B216</div>
                    <div class="cell header-cell">C216</div>
                    <div class="cell header-cell">D216</div>
                    <div class="cell header-cell">E216</div>
                </div>
                <div class="cell-row">
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell numeric-cell">137.4414363273386</div>
                    <div class="cell"></div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">MERGED CELL EXAMPLES</div>
                <div class="cell-row">
                    <div class="cell merged-cell" colspan="6">MERGED RANGE: A1:F1 (Header spanning 6 columns)</div>
                </div>
                <div class="cell-row">
                    <div class="cell merged-cell" colspan="11">MERGED RANGE: A3:K3 (Section header spanning 11 columns)</div>
                </div>
            </div>
        </div>
        
        <div class="sheet">
            <h3>Sheet Properties:</h3>
            <ul>
                <li><strong>Sheet Range:</strong> A1:AJ468</li>
                <li><strong>Total Merged Cells:</strong> 10 ranges</li>
                <li><strong>Key Features:</strong> Formulas, merged cells, structured data layout</li>
            </ul>
            
            <h3>Engineering Data Mapping:</h3>
            <ul>
                <li><strong>Pier Geometry:</strong> Row 5 area contains span and skew data</li>
                <li><strong>Stability Calculations:</strong> Around row 197 for base pressure</li>
                <li><strong>Force Calculations:</strong> Around row 216 for hydraulic forces</li>
            </ul>
        </div>
    </div>
</body>
</html>
  `;
  
  // Save the HTML visualization
  const outputPath = path.join(__dirname, 'OUTPUT', 'pier_sheet_visualization.html');
  fs.writeFileSync(outputPath, htmlContent);
  
  console.log(`\nHTML Visualization generated: ${outputPath}`);
  console.log('Open this file in a browser to view the pier stability sheet structure.');
}

// Run the visualization
visualizePierSheet();