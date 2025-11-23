import XLSX from 'xlsx';
const wb = XLSX.readFile('./REAL_COMPREHENSIVE_WORKBOOK.xlsx');
console.log('✓ REAL COMPREHENSIVE WORKBOOK');
console.log('Total Sheets:', wb.SheetNames.length);
let totalRows = 0;
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  const rows = data.length;
  totalRows += rows;
  console.log(`${(idx + 1).toString().padStart(2)}. ${name.padEnd(25)} - ${rows.toString().padStart(5)} rows`);
});
console.log('\nTOTAL ROWS ACROSS ALL SHEETS:', totalRows);
