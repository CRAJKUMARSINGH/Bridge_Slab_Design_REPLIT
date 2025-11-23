import XLSX from 'xlsx';

const wb = XLSX.readFile('/tmp/narrative_test.xlsx');

console.log('\n📊 NARRATIVE DESIGN EXPORT ANALYSIS:\n');
console.log('═════════════════════════════════════════════════════════════\n');

console.log(`Total Sheets: ${wb.SheetNames.length}\n`);

wb.SheetNames.forEach((sheetName, idx) => {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`${idx + 1}. ${sheetName}: ${data.length} rows`);
});

console.log('\n═════════════════════════════════════════════════════════════\n');

// Check key narrative sheets
const narrativeSheets = ['DESIGN ASSUMPTIONS', 'HYDRAULICS', 'PIER STABILITY', 'CONCLUSION'];

console.log('CHECKING FOR NARRATIVE CONTENT:\n');

narrativeSheets.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    console.log(`❌ ${sheetName}: NOT FOUND`);
    return;
  }
  
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`✅ ${sheetName}: ${data.length} rows`);
  
  // Show first 5 rows to check for actual narrative text
  console.log(`   Sample content:`);
  data.slice(0, 5).forEach((row, i) => {
    if (Array.isArray(row)) {
      const content = row.filter(v => v).map(v => String(v).substring(0, 50)).join(' | ');
      console.log(`   Row ${i+1}: ${content}`);
    }
  });
  console.log();
});

