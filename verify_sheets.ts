import XLSX from 'xlsx';

const file = './COMPREHENSIVE_WORKBOOK.xlsx';
const wb = XLSX.readFile(file);

console.log('=== EXPORTED WORKBOOK ===');
console.log('Total Sheets:', wb.SheetNames.length);
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`${idx + 1}. ${name} - ${data.length} rows`);
});
