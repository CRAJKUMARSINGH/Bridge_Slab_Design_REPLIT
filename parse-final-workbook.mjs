import XLSX from 'xlsx';

const file = '/home/runner/workspace/attached_assets/FINAL_RESULT_1763962301422.xls';
const wb = XLSX.readFile(file);

console.log('=== WORKBOOK SHEET NAMES ===');
wb.SheetNames.forEach((name, idx) => {
  console.log(`${idx + 1}. ${name}`);
});

console.log('\n=== SHEET DATA SAMPLE ===');
wb.SheetNames.slice(0, 5).forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  console.log(`\n--- ${sheetName} (${data.length} rows) ---`);
  data.slice(0, 15).forEach((row, i) => {
    if (row.filter(c => c !== '').length > 0) {
      console.log(`Row ${i}: ${JSON.stringify(row).substring(0, 150)}`);
    }
  });
});
