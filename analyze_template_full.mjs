import XLSX from 'xlsx';

const workbook = XLSX.readFile('TEMPLATE_1.xls');
const sheet = workbook.Sheets['Abstract'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('Abstract sheet rows:', data.length);

// Show all rows with item numbers (rows that start with a number)
for(let i = 0; i < data.length; i++) {
  const row = data[i];
  if (row && row[0] && typeof row[0] === 'number' || (typeof row[0] === 'string' && /^\d+(\s*\([^)]*\))?/.test(row[0]))) {
    console.log('Row ' + (i+1) + ':', JSON.stringify(row).substring(0, 150));
  }
}