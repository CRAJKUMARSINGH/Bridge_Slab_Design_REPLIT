import XLSX from 'xlsx';

const wb = XLSX.readFile('./attached_assets/FINAL_RESULT_1763910680110.xls');

console.log('\n📚 REFERENCE WORKBOOK STRUCTURE - EXAMINING EACH SHEET:\n');
console.log('═════════════════════════════════════════════════════════════\n');

// Look at a few key sheets to understand format
const sheetsToExamine = ['Hydraulics', 'Afflux', 'Pier Stability', 'STEEL IN PIER'];

sheetsToExamine.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    console.log(`❌ Sheet "${sheetName}" not found\n`);
    return;
  }

  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  
  console.log(`📄 SHEET: "${sheetName}" (${data.length} rows)\n`);
  console.log('═══ STRUCTURE (first 30 rows): ═══\n');
  
  data.slice(0, 30).forEach((row, idx) => {
    if (Array.isArray(row)) {
      // Show all non-empty cells
      const content = row
        .map((v, colIdx) => {
          if (!v) return '';
          const str = String(v).substring(0, 45);
          return str.length > 0 ? `[Col${colIdx+1}:${str}]` : '';
        })
        .filter(s => s)
        .join(' ');
      
      if (content) {
        console.log(`Row ${String(idx+1).padStart(2)}: ${content}`);
      }
    }
  });
  
  console.log('\n═════════════════════════════════════════════════════════════\n');
});

