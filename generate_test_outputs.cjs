/**
 * Script to generate timestamped test outputs using the test templates
 * 
 * This script creates copies of the test templates with date-time stamps
 * and places them in the OUTPUT folder.
 */

const fs = require('fs');
const path = require('path');

// Get current date-time stamp
function getDateTimeStamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Create output directory if it doesn't exist
const outputDir = './OUTPUT';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Template files in root directory
const templateFiles = [
    'TEMPLATE_1.xls',
    'TEMPLATE_2.xls',
    'TEMPLATE_3.xls'
];

// Generate timestamped outputs
const timeStamp = getDateTimeStamp();
console.log(`Generating test outputs with timestamp: ${timeStamp}\n`);

templateFiles.forEach((templateFile, index) => {
    const sourcePath = `./${templateFile}`;
    const outputFileName = `OUTPUT_${index + 1}_${timeStamp}.xls`;
    const destinationPath = path.join(outputDir, outputFileName);
    
    // Check if template file exists
    if (fs.existsSync(sourcePath)) {
        // Copy template to output folder with timestamp
        fs.copyFileSync(sourcePath, destinationPath);
        console.log(`✓ Created: ${outputFileName}`);
    } else {
        console.log(`✗ Template not found: ${templateFile}`);
    }
});

console.log(`\nAll outputs generated in: ${outputDir}/`);