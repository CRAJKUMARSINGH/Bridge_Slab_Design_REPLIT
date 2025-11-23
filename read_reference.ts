import XLSX from 'xlsx';
import fs from 'fs';

// Try to find the reference file
const files = fs.readdirSync('./attached_assets').filter(f => f.endsWith('.xls') || f.endsWith('.xlsx'));
console.log('Available files:', files);

// Look for the reference file mentioned
const refFile = files.find(f => f.includes('FINAL') || f.includes('RESULT')) || files[0];
if (!refFile) {
  console.log('No reference file found');
  process.exit(0);
}

console.log('\n📖 ANALYZING REFERENCE WORKBOOK:', refFile);
console.log('═══════════════════════════════════════════════════════════\n');

const wb = XLSX.readFile(`./attached_assets/${refFile}`);

// Show first 10 sheets
console.log('SHEETS (first 10):\n');
wb.SheetNames.slice(0, 10).forEach((name, idx) => {
  console.log(`${idx + 1}. ${name}`);
});

console.log('\n═══════════════════════════════════════════════════════════\n');

// Pick a key sheet and show its structure
const firstSheet = wb.SheetNames[0];
console.log(`📋 STRUCTURE OF SHEET: "${firstSheet}"\n`);

const ws = wb.Sheets[firstSheet];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];

console.log(`Total rows: ${data.length}`);
console.log('\nFirst 20 rows (raw format):\n');

data.slice(0, 20).forEach((row, idx) => {
  if (Array.isArray(row)) {
    const displayRow = row.slice(0, 5).map((v: any) => {
      const str = String(v || '').substring(0, 40);
      return str.length === 0 ? '[empty]' : str;
    }).join(' | ');
    console.log(`Row ${idx + 1}: ${displayRow}`);
  }
});

