const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Proper comprehensive analysis that handles all sheets correctly
async function properComprehensiveAnalysis() {
  try {
    console.log('=== PROPER COMPREHENSIVE TEMPLATE ANALYSIS ===');
    console.log('Analyzing all 46 sheets in master template...\n');
    
    // Path to master template file
    const templatePath = path.join(__dirname, 'attached_assets', 'master_bridge_Design.xlsx');
    
    if (!fs.existsSync(templatePath)) {
      console.error(`❌ Master template file not found: ${templatePath}`);
      return;
    }
    
    console.log(`✅ Found template file: ${templatePath}`);
    
    // Read template with full options to preserve all features
    const template = XLSX.readFile(templatePath, { 
      cellFormula: true,
      cellStyles: true,
      bookVBA: true,
      bookFiles: true,
      bookProps: true
    });
    
    console.log(`✅ Template loaded successfully`);
    console.log(`📊 Total Sheets: ${template.SheetNames.length}`);
    
    // Create detailed analysis report
    const analysisReport = {
      summary: {
        totalSheets: template.SheetNames.length,
        sheetsWithFormulas: 0,
        sheetsWithMergedCells: 0,
        sheetsWithData: 0,
        totalFormulas: 0,
        totalMergedRanges: 0
      },
      sheets: {}
    };
    
    // Analyze each sheet individually
    console.log('\n=== DETAILED SHEET ANALYSIS ===');
    
    for (let i = 0; i < template.SheetNames.length; i++) {
      const sheetName = template.SheetNames[i];
      const sheet = template.Sheets[sheetName];
      
      // Handle special case for INDEX sheet and other potential issues
      if (!sheet) {
        console.log(`\n--- Sheet ${i + 1}/${template.SheetNames.length}: ${sheetName} ---`);
        console.log(`  ❌ SKIPPED - Sheet object is null/undefined`);
        continue;
      }
      
      console.log(`\n--- Sheet ${i + 1}/${template.SheetNames.length}: ${sheetName} ---`);
      
      // Initialize sheet analysis
      const sheetAnalysis = {
        name: sheetName,
        range: sheet['!ref'] || 'undefined',
        hasFormulas: false,
        hasMergedCells: false,
        hasData: false,
        formulaCount: 0,
        mergedCellCount: 0,
        dataCellCount: 0,
        sampleHeaders: [],
        sampleFormulas: [],
        sampleValues: []
      };
      
      // Check for merged cells
      if (sheet['!merges'] && sheet['!merges'].length > 0) {
        sheetAnalysis.hasMergedCells = true;
        sheetAnalysis.mergedCellCount = sheet['!merges'].length;
        analysisReport.summary.sheetsWithMergedCells++;
        analysisReport.summary.totalMergedRanges += sheet['!merges'].length;
        
        console.log(`  📐 Merged Cells: ${sheet['!merges'].length} ranges`);
        
        // Show first 5 merged ranges
        sheet['!merges'].slice(0, 5).forEach((range, index) => {
          console.log(`    ${index + 1}. ${XLSX.utils.encode_range(range)}`);
        });
        
        if (sheet['!merges'].length > 5) {
          console.log(`    ... and ${sheet['!merges'].length - 5} more`);
        }
      }
      
      // Analyze cells
      let formulaCount = 0;
      let dataCellCount = 0;
      const headers = [];
      const formulas = [];
      const values = [];
      
      for (const cellAddress in sheet) {
        // Skip metadata properties
        if (cellAddress.startsWith('!')) continue;
        
        const cell = sheet[cellAddress];
        if (!cell) continue;
        
        dataCellCount++;
        
        // Check for formulas
        if (cell.f !== undefined) {
          formulaCount++;
          if (formulas.length < 5) {
            formulas.push({
              address: cellAddress,
              formula: cell.f.substring(0, 50) + (cell.f.length > 50 ? '...' : '')
            });
          }
        }
        
        // Check for values
        if (cell.v !== undefined) {
          // Collect headers (typically in first few rows)
          const rowNum = parseInt(cellAddress.replace(/^[A-Z]+/g, ''));
          if (rowNum <= 5 && headers.length < 5) {
            headers.push({
              address: cellAddress,
              value: String(cell.v).substring(0, 30) + (String(cell.v).length > 30 ? '...' : '')
            });
          }
          
          // Collect sample values
          if (values.length < 5 && rowNum > 5) {
            values.push({
              address: cellAddress,
              value: String(cell.v).substring(0, 30) + (String(cell.v).length > 30 ? '...' : '')
            });
          }
        }
      }
      
      sheetAnalysis.dataCellCount = dataCellCount;
      if (dataCellCount > 0) {
        sheetAnalysis.hasData = true;
        analysisReport.summary.sheetsWithData++;
      }
      
      sheetAnalysis.formulaCount = formulaCount;
      if (formulaCount > 0) {
        sheetAnalysis.hasFormulas = true;
        analysisReport.summary.sheetsWithFormulas++;
        analysisReport.summary.totalFormulas += formulaCount;
        
        console.log(`  Σ Formulas: ${formulaCount}`);
        
        // Show sample formulas
        formulas.forEach((formula, index) => {
          console.log(`    ${index + 1}. ${formula.address}: ${formula.formula}`);
        });
      }
      
      sheetAnalysis.sampleHeaders = headers;
      sheetAnalysis.sampleFormulas = formulas;
      sheetAnalysis.sampleValues = values;
      
      analysisReport.sheets[sheetName] = sheetAnalysis;
      
      console.log(`  📊 Data Cells: ${dataCellCount}`);
      console.log(`  📏 Sheet Range: ${sheetAnalysis.range}`);
      
      // Show sample headers
      if (headers.length > 0) {
        console.log(`  📋 Sample Headers:`);
        headers.forEach((header, index) => {
          console.log(`    ${index + 1}. ${header.address}: "${header.value}"`);
        });
      }
    }
    
    // Generate summary report
    console.log('\n=== ANALYSIS SUMMARY ===');
    console.log(`📈 Total Sheets: ${analysisReport.summary.totalSheets}`);
    console.log(`🧮 Sheets with Formulas: ${analysisReport.summary.sheetsWithFormulas}`);
    console.log(`📐 Sheets with Merged Cells: ${analysisReport.summary.sheetsWithMergedCells}`);
    console.log(`📊 Sheets with Data: ${analysisReport.summary.sheetsWithData}`);
    console.log(`Σ Total Formulas: ${analysisReport.summary.totalFormulas}`);
    console.log(`📐 Total Merged Ranges: ${analysisReport.summary.totalMergedRanges}`);
    
    // Identify key sheets
    console.log('\n=== KEY SHEETS IDENTIFICATION ===');
    const keySheets = [
      'INSERT- HYDRAULICS',
      'INSERT C1-ABUT', 
      'INSERT ESTIMATE',
      'STABILITY CHECK FOR PIER',
      'HYDRAULICS',
      'abstract of stresses'
    ];
    
    keySheets.forEach(sheetName => {
      if (template.Sheets[sheetName]) {
        const analysis = analysisReport.sheets[sheetName];
        console.log(`\n📄 ${sheetName}:`);
        console.log(`  Range: ${analysis.range}`);
        console.log(`  Formulas: ${analysis.formulaCount}`);
        console.log(`  Merged Cells: ${analysis.mergedCellCount}`);
        console.log(`  Data Cells: ${analysis.dataCellCount}`);
      } else {
        console.log(`\n❓ ${sheetName}: NOT FOUND`);
      }
    });
    
    // Create detailed HTML report
    createDetailedHTMLReport(analysisReport, template);
    
    // Verify template preservation capabilities
    console.log('\n=== TEMPLATE PRESERVATION VERIFICATION ===');
    verifyTemplatePreservation(template);
    
    console.log('\n✅ Comprehensive template analysis completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in comprehensive template analysis:', error);
  }
}

function createDetailedHTMLReport(analysisReport, template) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Comprehensive Template Analysis Report</title>
    <style>
        body { 
            font-family: Calibri, Arial, sans-serif; 
            margin: 20px; 
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header { 
            background: #1f497d; 
            color: white; 
            padding: 20px; 
            text-align: center;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .summary-box {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        .sheet-section {
            border: 1px solid #ddd;
            border-radius: 5px;
            margin: 15px 0;
            background: white;
        }
        .sheet-header {
            background: #4f81bd;
            color: white;
            padding: 10px 15px;
            font-weight: bold;
            border-radius: 5px 5px 0 0;
        }
        .sheet-content {
            padding: 15px;
        }
        .metric {
            display: inline-block;
            background: #f0f8ff;
            padding: 8px 12px;
            margin: 5px;
            border-radius: 3px;
            border: 1px solid #4f81bd;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background: #f2f2f2;
        }
        .success { color: #2e7d32; }
        .warning { color: #ef6c00; }
        .error { color: #c62828; }
        .code { font-family: monospace; background: #f5f5f5; padding: 2px 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>COMPREHENSIVE TEMPLATE ANALYSIS REPORT</h1>
            <p>Detailed Analysis of All 46 Sheets in master_bridge_Design.xlsx</p>
        </div>
        
        <div class="summary-box">
            <h2>📊 EXECUTIVE SUMMARY</h2>
            <div class="metric"><strong>Total Sheets:</strong> ${analysisReport.summary.totalSheets}</div>
            <div class="metric"><strong>Sheets with Formulas:</strong> ${analysisReport.summary.sheetsWithFormulas}</div>
            <div class="metric"><strong>Sheets with Merged Cells:</strong> ${analysisReport.summary.sheetsWithMergedCells}</div>
            <div class="metric"><strong>Sheets with Data:</strong> ${analysisReport.summary.sheetsWithData}</div>
            <div class="metric"><strong>Total Formulas:</strong> ${analysisReport.summary.totalFormulas}</div>
            <div class="metric"><strong>Total Merged Ranges:</strong> ${analysisReport.summary.totalMergedRanges}</div>
        </div>
        
        <h2>📋 ALL SHEETS LIST</h2>
        <table>
            <tr>
                <th>#</th>
                <th>Sheet Name</th>
                <th>Range</th>
                <th>Formulas</th>
                <th>Merged Cells</th>
                <th>Data Cells</th>
            </tr>
            ${Object.keys(analysisReport.sheets).map((sheetName, index) => {
              const sheet = analysisReport.sheets[sheetName];
              return `
              <tr>
                  <td>${index + 1}</td>
                  <td><span class="code">${sheetName}</span></td>
                  <td>${sheet.range}</td>
                  <td class="${sheet.formulaCount > 0 ? 'success' : ''}">${sheet.formulaCount}</td>
                  <td class="${sheet.mergedCellCount > 0 ? 'success' : ''}">${sheet.mergedCellCount}</td>
                  <td>${sheet.dataCellCount}</td>
              </tr>
              `;
            }).join('')}
        </table>
        
        <h2>🔑 KEY SHEETS DETAILED ANALYSIS</h2>
        ${['INSERT- HYDRAULICS', 'INSERT C1-ABUT', 'INSERT ESTIMATE', 'STABILITY CHECK FOR PIER', 'HYDRAULICS', 'abstract of stresses'].map(sheetName => {
          if (template.Sheets[sheetName]) {
            const sheet = analysisReport.sheets[sheetName];
            return `
            <div class="sheet-section">
                <div class="sheet-header">${sheetName}</div>
                <div class="sheet-content">
                    <table>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td>Sheet Range</td>
                            <td>${sheet.range}</td>
                        </tr>
                        <tr>
                            <td>Has Formulas</td>
                            <td class="${sheet.hasFormulas ? 'success' : 'error'}">${sheet.hasFormulas ? 'YES' : 'NO'} (${sheet.formulaCount} formulas)</td>
                        </tr>
                        <tr>
                            <td>Has Merged Cells</td>
                            <td class="${sheet.hasMergedCells ? 'success' : 'error'}">${sheet.hasMergedCells ? 'YES' : 'NO'} (${sheet.mergedCellCount} ranges)</td>
                        </tr>
                        <tr>
                            <td>Data Cells</td>
                            <td>${sheet.dataCellCount}</td>
                        </tr>
                    </table>
                    
                    ${sheet.mergedCellCount > 0 ? `
                    <h3>📐 Merged Cell Ranges</h3>
                    <ul>
                        ${template.Sheets[sheetName]['!merges'].slice(0, 5).map(range => `<li><span class="code">${XLSX.utils.encode_range(range)}</span></li>`).join('')}
                        ${template.Sheets[sheetName]['!merges'].length > 5 ? `<li>... and ${template.Sheets[sheetName]['!merges'].length - 5} more</li>` : ''}
                    </ul>
                    ` : ''}
                    
                    ${sheet.formulaCount > 0 ? `
                    <h3>🧮 Sample Formulas</h3>
                    <ul>
                        ${sheet.sampleFormulas.map(formula => `<li><span class="code">${formula.address}</span>: =${formula.formula}</li>`).join('')}
                    </ul>
                    ` : ''}
                    
                    ${sheet.sampleHeaders.length > 0 ? `
                    <h3>📋 Sample Headers</h3>
                    <ul>
                        ${sheet.sampleHeaders.map(header => `<li><span class="code">${header.address}</span>: "${header.value}"</li>`).join('')}
                    </ul>
                    ` : ''}
                </div>
            </div>
            `;
          }
          return '';
        }).join('')}
    </div>
</body>
</html>
  `;
  
  // Save the HTML report
  const outputPath = path.join(__dirname, 'OUTPUT', 'proper_comprehensive_analysis.html');
  fs.writeFileSync(outputPath, htmlContent);
  
  console.log(`\n📊 Detailed HTML Report generated: ${outputPath}`);
}

function verifyTemplatePreservation(template) {
  console.log('🔍 Verifying template preservation capabilities...');
  
  // Test preservation by writing and re-reading
  try {
    // Write template to buffer with full preservation options
    const buffer = XLSX.write(template, { 
      type: 'buffer', 
      bookType: 'xlsx',
      bookSST: true,
      compression: true,
      cellStyles: true
    });
    
    console.log('✅ Template write operation successful');
    console.log(`📊 Buffer size: ${(buffer.length / 1024).toFixed(2)} KB`);
    
    // Read it back
    const reReadTemplate = XLSX.read(buffer, { 
      cellFormula: true,
      cellStyles: true
    });
    
    console.log('✅ Template read-back operation successful');
    console.log(`📊 Sheets preserved: ${reReadTemplate.SheetNames.length}`);
    
    // Verify key sheets are preserved
    const keySheets = ['INSERT- HYDRAULICS', 'INSERT C1-ABUT', 'INSERT ESTIMATE', 'STABILITY CHECK FOR PIER'];
    keySheets.forEach(sheetName => {
      if (reReadTemplate.Sheets[sheetName]) {
        console.log(`✅ ${sheetName}: Preserved`);
      } else {
        console.log(`❌ ${sheetName}: NOT FOUND after preservation`);
      }
    });
    
    // Save verification file
    const verificationPath = path.join(__dirname, 'OUTPUT', 'template_preservation_verification_proper.xlsx');
    fs.writeFileSync(verificationPath, buffer);
    console.log(`💾 Verification file saved: ${verificationPath}`);
    
  } catch (error) {
    console.error('❌ Template preservation verification failed:', error);
  }
}

// Run the proper comprehensive analysis
properComprehensiveAnalysis();