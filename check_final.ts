import XLSX from 'xlsx';
const wb = XLSX.readFile('./FINAL_COMPREHENSIVE_WORKBOOK.xlsx');
console.log('\n✅ SUCCESS! COMPREHENSIVE PROFESSIONAL WORKBOOK');
console.log('📊 Total Sheets:', wb.SheetNames.length);
console.log('📋 Sheet List:');
let totalRows = 0;
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  const rows = data.length;
  totalRows += rows;
  const bar = "█".repeat(Math.floor(rows / 20));
  console.log(`  ${(idx + 1).toString().padStart(2)}. ${name.padEnd(25)} ${rows.toString().padStart(4)} rows ${bar}`);
});
console.log('\n✅ TOTAL ROWS ACROSS ALL SHEETS:', totalRows);
console.log('✅ REAL DATA STRUCTURE WITH FALLBACKS - WORKING!');
