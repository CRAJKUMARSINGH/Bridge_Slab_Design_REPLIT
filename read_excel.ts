import XLSX from 'xlsx';

const file = './attached_assets/FINAL_RESULT_1763907681327.xls';
const wb = XLSX.readFile(file);

console.log('=== WORKBOOK STRUCTURE ===');
console.log('Total Sheets:', wb.SheetNames.length);
console.log('Sheet Names:', wb.SheetNames.join('\n'));

console.log('\n=== FIRST SHEET (Sample Data) ===');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
console.log('Rows:', data.length);
data.slice(0, 15).forEach((row, idx) => {
  console.log(row.slice(0, 5).join(' | '));
});
