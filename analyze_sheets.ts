import XLSX from 'xlsx';

const file = './attached_assets/FINAL_RESULT_1763907681327.xls';
const wb = XLSX.readFile(file);

// Read key sheets
const keySheetsToRead = [
  'INSERT- HYDRAULICS',
  'HYDRAULICS',
  'STABILITY CHECK FOR PIER',
  'STEEL IN PIER',
  'FOOTING DESIGN',
  'TYPE1-ABUTMENT Drawing',
  'ESTIMATION_INPUT_DATA'
];

keySheetsToRead.forEach(sheetName => {
  if (!wb.SheetNames.includes(sheetName)) return;
  
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SHEET: ${sheetName}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total rows: ${data.length}`);
  
  // Show first 20 rows
  data.slice(0, 20).forEach((row, idx) => {
    const rowStr = row.map((v: any) => {
      if (v === undefined || v === null) return '';
      return String(v).substring(0, 15);
    }).join(' | ');
    console.log(`${idx.toString().padEnd(3)} | ${rowStr}`);
  });
});
