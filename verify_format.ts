import XLSX from 'xlsx';

const wb = XLSX.readFile('/tmp/test_format.xlsx');

console.log('\n✅ CHECKING IF FORMULAS AND STEP-BY-STEP SHOWN:\n');

// Check HYDRAULICS sheet
const hydraulicsWs = wb.Sheets['HYDRAULICS'];
const hydraulicsData = XLSX.utils.sheet_to_json(hydraulicsWs, { header: 1 }) as any[];

console.log('📄 HYDRAULICS SHEET:\n');
hydraulicsData.slice(0, 25).forEach((row, idx) => {
  if (Array.isArray(row) && row.some(v => v)) {
    const cells = row.map((v, i) => v ? `[${String.fromCharCode(65+i)}:${v}]` : '').filter(s => s).join('');
    console.log(`Row ${String(idx+1).padStart(2)}: ${cells}`);
  }
});

console.log('\n\n📋 STEEL IN PIER SHEET:\n');
const steelWs = wb.Sheets['STEEL IN PIER'];
const steelData = XLSX.utils.sheet_to_json(steelWs, { header: 1 }) as any[];

steelData.slice(0, 40).forEach((row, idx) => {
  if (Array.isArray(row) && row.some(v => v)) {
    const cells = row.map((v, i) => v ? `[${String.fromCharCode(65+i)}:${v}]` : '').filter(s => s).join('');
    console.log(`Row ${String(idx+1).padStart(2)}: ${cells}`);
  }
});

console.log('\n\n✅ All sheets present:\n');
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`${String(idx+1).padStart(2)}. ${name} (${data.length} rows)`);
});

