import XLSX from 'xlsx';

console.log('\n════════════════════════════════════════════════════════════\n');
console.log('READING ACTUAL EXCEL FILE - REALITY CHECK:\n');

const wb = XLSX.readFile('./attached_assets/BRIDGE_DESIGN_REPORT_FINAL.xlsx');

wb.SheetNames.forEach((name) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  
  console.log(`\n📋 SHEET: ${name}`);
  console.log(`   Rows: ${data.length}`);
  
  if (data.length > 0) {
    console.log(`   First 3 rows:`);
    data.slice(0, 3).forEach((row, i) => {
      console.log(`      Row ${i+1}: ${JSON.stringify(row)}`);
    });
  }
});

console.log('\n════════════════════════════════════════════════════════════\n');
