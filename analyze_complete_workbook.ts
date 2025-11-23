import XLSX from 'xlsx';

const file = './attached_assets/FINAL_RESULT_1763907681327.xls';
const wb = XLSX.readFile(file);

console.log('=== COMPLETE WORKBOOK ANALYSIS ===');
console.log('Total Sheets:', wb.SheetNames.length);
console.log('\nAll Sheets:');
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`${idx + 1}. ${name} (${data.length} rows)`);
});

// Detailed structure of first 10 sheets
console.log('\n=== DETAILED CONTENT FIRST 10 SHEETS ===');
wb.SheetNames.slice(0, 10).forEach((name) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`\n--- ${name} (${data.length} rows) ---`);
  data.slice(0, 12).forEach((row, idx) => {
    const cells = row.slice(0, 6).map(v => String(v || '').substring(0, 12)).join(' | ');
    console.log(`${idx}: ${cells}`);
  });
});
