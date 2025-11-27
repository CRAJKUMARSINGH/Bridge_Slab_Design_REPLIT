import XLSX from 'xlsx';

const workbook = XLSX.readFile('TEMPLATE_1.xls');
const sheet = workbook.Sheets['Abstract'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('Abstract sheet rows:', data.length);

// Show rows 30-60
for(let i = 30; i < Math.min(60, data.length); i++) {
  console.log('Row ' + (i+1) + ':', JSON.stringify(data[i]).substring(0, 100));
}