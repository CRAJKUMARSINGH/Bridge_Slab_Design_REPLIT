const XLSX = require('xlsx');

const file = './attached_assets/FINAL_RESULT_1763907681327.xls';
const wb = XLSX.readFile(file);

console.log('=== WORKBOOK STRUCTURE ===');
console.log('Total Sheets:', wb.SheetNames.length);
console.log('Sheet Names:', wb.SheetNames.join(', '));

console.log('\n=== FIRST 3 SHEETS SAMPLE ===');
wb.SheetNames.slice(0, 3).forEach(name => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  console.log('\n--- ' + name + ' (' + data.length + ' rows) ---');
  data.slice(0, 10).forEach((row, idx) => {
    console.log(row.slice(0, 4).join(' | '));
  });
});
