import XLSX from 'xlsx';
const wb = XLSX.readFile('./MASSIVE_WORKBOOK.xlsx');
console.log('✓ Total Sheets:', wb.SheetNames.length);
wb.SheetNames.forEach((name, idx) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  console.log(`${(idx + 1).toString().padStart(2)}. ${name.padEnd(25)} - ${data.length.toString().padStart(4)} rows`);
});
