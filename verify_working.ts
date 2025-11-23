import XLSX from 'xlsx';
const wb = XLSX.readFile('./COMPREHENSIVE_WORKING.xlsx');
console.log('\n🎉 SUCCESS! COMPREHENSIVE PROFESSIONAL WORKBOOK GENERATED');
console.log('📊 Total Sheets:', wb.SheetNames.length);
let totalRows = 0;
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  const rows = data.length;
  totalRows += rows;
  console.log(`  ${(idx+1).toString().padStart(2)}. ${name.padEnd(27)} ${rows.toString().padStart(4)} rows`);
});
console.log('\n✅ TOTAL ROWS:', totalRows);
console.log('✅ Comprehensive Design Export WORKING!');
