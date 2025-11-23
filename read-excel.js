const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function readExcel() {
  const filePath = path.join(__dirname, 'attached_assets/for replit FINAL_RESULT_1763885256922.xls');
  
  if (!fs.existsSync(filePath)) {
    console.log('File not found at:', filePath);
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    console.log('Total Sheets:', workbook.worksheets.length);
    console.log('\nSheet Names and Data:');
    console.log('='.repeat(80));
    
    workbook.worksheets.forEach((ws, idx) => {
      console.log(`\nSheet ${idx + 1}: "${ws.name}"`);
      console.log('-'.repeat(80));
      
      const data = [];
      ws.eachRow((row, rowNumber) => {
        const rowData = [];
        row.eachCell((cell) => {
          rowData.push(String(cell.value || ''));
        });
        if (rowData.some(v => v.trim())) {
          data.push(rowData);
        }
      });
      
      // Print first few rows
      data.slice(0, 10).forEach(row => {
        console.log(row.join(' | '));
      });
      if (data.length > 10) {
        console.log(`... and ${data.length - 10} more rows`);
      }
    });
    
  } catch (err) {
    console.error('Error reading Excel:', err.message);
  }
}

readExcel();
