import XLSX from 'xlsx';

const wb = XLSX.readFile('./attached_assets/BRIDGE_DESIGN_REPORT_FINAL.xlsx');

// Examine Hydraulics sheet - this should show the narrative format
const hydraulicsWs = wb.Sheets['Hydraulics'];
const hydraulicsData = XLSX.utils.sheet_to_json(hydraulicsWs, { header: 1 }) as any[];

console.log('\n💧 HYDRAULICS SHEET NARRATIVE FORMAT:\n');
console.log('════════════════════════════════════════════════════════════\n');

// Print first 40 rows to see structure
hydraulicsData.slice(0, 40).forEach((row: any[], idx: number) => {
  // Concatenate all cells in the row
  const fullRow = row.map((cell: any) => cell !== undefined ? cell : '').join(' | ');
  console.log(`${String(idx + 1).padStart(3, ' ')}: ${fullRow}`);
});

console.log('\n════════════════════════════════════════════════════════════\n');

// Now check "Afflux" sheet
const affluxWs = wb.Sheets['Afflux'];
const affluxData = XLSX.utils.sheet_to_json(affluxWs, { header: 1 }) as any[];

console.log('\n📍 AFFLUX SHEET FORMAT:\n');
console.log('════════════════════════════════════════════════════════════\n');

affluxData.slice(0, 35).forEach((row: any[], idx: number) => {
  const fullRow = row.map((cell: any) => cell !== undefined ? cell : '').join(' | ');
  console.log(`${String(idx + 1).padStart(3, ' ')}: ${fullRow}`);
});

