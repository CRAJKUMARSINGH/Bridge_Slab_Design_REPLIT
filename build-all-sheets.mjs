import XLSX from 'xlsx';
import fs from 'fs';

const file = '/home/runner/workspace/attached_assets/FINAL_RESULT_1763962301422.xls';
const wb = XLSX.readFile(file);

const sheetsDir = './attached_assets/html-sheets';
if (!fs.existsSync(sheetsDir)) fs.mkdirSync(sheetsDir, { recursive: true });

// Extract project info from INDEX sheet
const indexData = XLSX.utils.sheet_to_json(wb.Sheets['INDEX'], { header: 1, defval: '' });
const projectName = indexData[0]?.[0] || 'Design of Submersible Bridge';

// Helper to create HTML table from sheet data
function createSheetHTML(sheetName, data) {
  const title = sheetName.replace(/_/g, ' ').toUpperCase();
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    h2 {
      color: #34495e;
      margin-top: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #bdc3c7;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #3498db;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #ecf0f1;
    }
    tr:hover {
      background-color: #d5dbdb;
    }
    .formula {
      background-color: #fff9e6;
      font-family: 'Courier New', monospace;
      padding: 8px;
      border-radius: 4px;
    }
    .result {
      background-color: #d4edda;
      font-weight: bold;
      color: #155724;
    }
    .step {
      background-color: #e7f3ff;
      border-left: 4px solid #3498db;
      padding: 10px;
      margin: 10px 0;
    }
    .red { color: red; font-weight: bold; }
    .green { color: green; font-weight: bold; }
    .note {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      padding: 12px;
      margin: 15px 0;
      border-radius: 4px;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p><strong>Project:</strong> ${projectName}</p>`;

  // Create detailed table from data
  if (data.length > 0) {
    html += '<table>\n<thead>\n<tr>';
    
    // Get headers from first row with content
    let headerRow = data[0];
    for (let i = 0; i < headerRow.length; i++) {
      if (headerRow[i] !== '' && headerRow[i] !== undefined) {
        html += `<th>${headerRow[i]}</th>`;
      }
    }
    html += '</tr>\n</thead>\n<tbody>\n';
    
    // Add data rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.some(cell => cell !== '' && cell !== undefined)) {
        html += '<tr>';
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          let cellContent = '';
          if (typeof cell === 'number') {
            cellContent = cell.toFixed(2);
          } else if (cell) {
            cellContent = String(cell);
          }
          html += `<td>${cellContent}</td>`;
        }
        html += '</tr>\n';
      }
    }
    
    html += '</tbody>\n</table>';
  }
  
  html += `
  </div>
</body>
</html>`;
  
  return html;
}

// Generate HTML files for all sheets
const sheetMapping = {
  'INDEX': 'Sheet_01_Index',
  'afflux calculation': 'Sheet_03_Hydraulics',
  'Deck Anchorage': 'Sheet_06_Deck_Anchorage',
  'STABILITY CHECK FOR PIER': 'Sheet_09_Pier_Stability',
  'FOOTING DESIGN': 'Sheet_13_Footing_Design',
  'STEEL IN PIER': 'Sheet_12_Steel_in_Pier',
  'Pier Cap': 'Sheet_16_Pier_Cap',
  'TYPE1-STABILITY CHECK ABUTMENT': 'Sheet_21_Abutment_Stability',
  'TYPE1-ABUTMENT FOOTING DESIGN': 'Sheet_22_Abutment_Footing',
  'CROSS SECTION': 'Sheet_06_Cross_Section',
  'SBC': 'Sheet_08_SBC',
  'Bed Slope': 'Sheet_07_Bed_Slope'
};

let sheetCount = 1;
wb.SheetNames.forEach(sheetName => {
  if (sheetName.includes('INSERT') || sheetName.includes('loadsumm')) {
    return; // Skip helper sheets
  }
  
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  if (data.length > 0) {
    const htmlFilename = `Sheet_${String(sheetCount).padStart(2, '0')}_${sheetName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.html`;
    const htmlContent = createSheetHTML(sheetName, data);
    const filepath = `${sheetsDir}/${htmlFilename}`;
    fs.writeFileSync(filepath, htmlContent);
    console.log(`✓ ${sheetCount}: ${htmlFilename} (${data.length} rows)`);
    sheetCount++;
  }
});

console.log(`\nTotal sheets generated: ${sheetCount - 1}`);
