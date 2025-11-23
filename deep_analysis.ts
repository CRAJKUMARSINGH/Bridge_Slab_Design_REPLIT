import XLSX from 'xlsx';

const file = './attached_assets/FINAL_RESULT_1763910680110.xls';
const wb = XLSX.readFile(file);

console.log('\n🔍 DEEP ANALYSIS - WHAT DATA SHOULD BE THERE:\n');

// Pier Stability
const ws = wb.Sheets['STABILITY CHECK FOR PIER'];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
console.log('📋 PIER STABILITY SHEET (468 rows):');
console.log(`   Headers: ${JSON.stringify(data[0])}`);
console.log(`   Row 2: ${JSON.stringify(data[1])}`);
console.log(`   Row 3: ${JSON.stringify(data[2])}`);
console.log(`   ...`);
console.log(`   Row 10: ${JSON.stringify(data[9])}`);

// Steel in Pier
const steelWs = wb.Sheets['STEEL IN PIER'];
const steelData = XLSX.utils.sheet_to_json(steelWs, { header: 1 }) as any[];
console.log('\n📋 STEEL IN PIER SHEET (170 rows):');
console.log(`   Headers: ${JSON.stringify(steelData[0])}`);
console.log(`   Row 2: ${JSON.stringify(steelData[1])}`);
console.log(`   Row 3: ${JSON.stringify(steelData[2])}`);

// Live Load
const llWs = wb.Sheets['LLOAD'];
const llData = XLSX.utils.sheet_to_json(llWs, { header: 1 }) as any[];
console.log('\n📋 LIVE LOAD SHEET (334 rows):');
console.log(`   Headers: ${JSON.stringify(llData[0])}`);
console.log(`   Row 2: ${JSON.stringify(llData[1])}`);
console.log(`   Row 3: ${JSON.stringify(llData[2])}`);

