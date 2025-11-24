const XLSX = require('xlsx');
const fs = require('fs');

const file = '/home/runner/workspace/attached_assets/FINAL_RESULT_1763962301422.xls';
const wb = XLSX.readFile(file);

console.log('=== WORKBOOK SHEET NAMES ===');
wb.SheetNames.forEach((name, idx) => {
  console.log(`${idx + 1}. ${name}`);
});

console.log('\n=== SHEET DATA SAMPLE ===');
wb.SheetNames.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  console.log(`\n--- ${sheetName} ---`);
  console.log(`Rows: ${data.length}`);
  console.log('First 10 rows:');
  data.slice(0, 10).forEach((row, i) => {
    console.log(`Row ${i}: ${JSON.stringify(row)}`);
  });
});
