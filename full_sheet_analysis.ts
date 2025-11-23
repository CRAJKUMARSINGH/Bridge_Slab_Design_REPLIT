import XLSX from 'xlsx';

const wb = XLSX.readFile('./attached_assets/FINAL_RESULT_1763910680110.xls');

console.log('📊 ALL SHEETS IN REFERENCE:\n');
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`${idx+1}. ${name} (${data.length} rows)`);
});

console.log('\n\n═══ EXAMINING "STEEL IN PIER" FORMAT IN DETAIL ═══\n');

const ws = wb.Sheets['STEEL IN PIER'];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];

// Show every single row to understand complete format
data.slice(0, 50).forEach((row, idx) => {
  if (Array.isArray(row)) {
    const cells = row.map((v, i) => v ? `${String.fromCharCode(65+i)}:${v}` : '').filter(s => s).join(' | ');
    console.log(`${String(idx+1).padStart(2)}: ${cells}`);
  }
});

