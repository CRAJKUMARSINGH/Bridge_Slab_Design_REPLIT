import XLSX from 'xlsx';
const wb = XLSX.readFile('./FINAL_EXCEL_REPORT.xlsx');
console.log('Sheets:', wb.SheetNames.length);
console.log('Total Rows:', wb.SheetNames.reduce((sum, name) => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
  return sum + data.length;
}, 0));
