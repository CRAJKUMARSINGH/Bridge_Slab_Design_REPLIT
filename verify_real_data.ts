import XLSX from 'xlsx';

const wb = XLSX.readFile('./attached_assets/REAL_IRC_DESIGN.xlsx');
console.log('\n════════════════════════════════════════════════════════════');
console.log('✅ REAL IRC:6-2016 DESIGN - DATA VERIFICATION');
console.log('════════════════════════════════════════════════════════════\n');

console.log(`📊 TOTAL SHEETS: ${wb.SheetNames.length}\n`);

let totalRows = 0;
let realDataCount = 0;

wb.SheetNames.forEach((name) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  totalRows += data.length;
  
  if (data.length > 3) realDataCount++;
});

console.log(`📈 TOTAL ROWS: ${totalRows}`);
console.log(`📋 SHEETS WITH REAL DATA: ${realDataCount}\n`);

// Check key sheets
const keySheets = ['STABILITY CHECK FOR PIER', 'LLOAD', 'STEEL IN PIER', 'TYPE1-STABILITY CHECK ABUTMENT'];
console.log('KEY SHEETS DATA:\n');

keySheets.forEach((sheetName) => {
  const ws = wb.Sheets[sheetName];
  if (ws) {
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
    console.log(`📄 ${sheetName}: ${data.length} rows`);
    if (data.length > 5) {
      console.log(`   Row 3 (sample): ${JSON.stringify(data[2]).substring(0, 100)}...`);
      console.log(`   Row 4 (sample): ${JSON.stringify(data[3]).substring(0, 100)}...`);
    }
  }
});

console.log('\n════════════════════════════════════════════════════════════\n');
