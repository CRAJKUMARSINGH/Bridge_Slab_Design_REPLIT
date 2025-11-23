import fs from 'fs';
import XLSX from 'xlsx';
import path from 'path';

console.log('\n════════════════════════════════════════════════════════════\n');

// Verify PDF
const pdfPath = './attached_assets/BRIDGE_DESIGN_REPORT_FINAL.pdf';
const pdfStats = fs.statSync(pdfPath);
const pdfContent = fs.readFileSync(pdfPath, 'utf8');

console.log('✅ PDF FILE EXISTS');
console.log(`   Path: ${path.resolve(pdfPath)}`);
console.log(`   Size: ${(pdfStats.size / 1024).toFixed(1)} KB`);
console.log(`   Valid PDF: ${pdfContent.substring(0, 4) === '%PDF' ? 'YES' : 'NO'}`);
console.log(`   First line: ${pdfContent.substring(0, 50)}`);

console.log('\n════════════════════════════════════════════════════════════\n');

// Verify Excel
const xlsxPath = './attached_assets/BRIDGE_DESIGN_REPORT_FINAL.xlsx';
const xlsxStats = fs.statSync(xlsxPath);
const wb = XLSX.readFile(xlsxPath);

console.log('✅ EXCEL FILE EXISTS');
console.log(`   Path: ${path.resolve(xlsxPath)}`);
console.log(`   Size: ${(xlsxStats.size / 1024).toFixed(1)} KB`);
console.log(`   Sheets: ${wb.SheetNames.length}`);
console.log(`   First 10 sheets:`);
wb.SheetNames.slice(0, 10).forEach((name, i) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`      ${i+1}. ${name.padEnd(25)} ${data.length} rows`);
});

console.log('\n════════════════════════════════════════════════════════════');
console.log('BOTH FILES SAVED AND VERIFIED IN attached_assets/');
console.log('════════════════════════════════════════════════════════════\n');
