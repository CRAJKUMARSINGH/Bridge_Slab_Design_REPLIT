import XLSX from 'xlsx';
import fs from 'fs';

const file = './attached_assets/FINAL_RESULT_1763910680110.xls';
console.log('\n════════════════════════════════════════════════════════════');
console.log('ANALYZING 49-SHEET REFERENCE WORKBOOK');
console.log('════════════════════════════════════════════════════════════\n');

const wb = XLSX.readFile(file);

console.log(`📊 TOTAL SHEETS: ${wb.SheetNames.length}\n`);
console.log('SHEET STRUCTURE:\n');

let totalRows = 0;
const sheetInfo: any[] = [];

wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  const rows = data.length;
  totalRows += rows;
  
  sheetInfo.push({ name, rows });
  
  console.log(`${String(idx + 1).padStart(2, '0')}. ${name.padEnd(40, ' ')} | Rows: ${String(rows).padStart(4, ' ')}`);
});

console.log(`\n════════════════════════════════════════════════════════════`);
console.log(`📈 TOTAL ROWS ACROSS ALL SHEETS: ${totalRows}`);
console.log(`════════════════════════════════════════════════════════════\n`);

// Show largest sheets
console.log('TOP 10 LARGEST SHEETS:\n');
sheetInfo.sort((a, b) => b.rows - a.rows).slice(0, 10).forEach((s, i) => {
  console.log(`${i + 1}. ${s.name.padEnd(40, ' ')} | ${s.rows} rows`);
});

// Show sample data from key sheets
console.log('\n════════════════════════════════════════════════════════════');
console.log('SAMPLE DATA FROM KEY SHEETS:\n');

['Pier Stability', 'Live Load', 'Steel in Pier', 'Footing Design'].forEach((sheetName) => {
  const ws = wb.Sheets[sheetName];
  if (ws) {
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
    console.log(`\n📄 ${sheetName} (${data.length} rows):`);
    console.log(`   Header: ${JSON.stringify(data[0])}`);
    console.log(`   Sample rows: ${data.length > 2 ? `${data.length - 2} data rows` : 'No data rows'}`);
  }
});

