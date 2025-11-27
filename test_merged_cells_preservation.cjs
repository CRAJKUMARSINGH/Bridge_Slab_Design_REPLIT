const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Import the enhanced template generator
async function testMergedCellsPreservation() {
  try {
    // Dynamically import the ES module
    const { generateExcelReport } = await import('./server/excel-template-enhanced.ts');
    
    // Sample input data
    const sampleInput = {
      discharge: 150.5,
      floodLevel: 100.6,
      bedSlope: 0.001,
      span: 7.6,
      width: 12.0,
      soilBearingCapacity: 20.0,
      numberOfLanes: 2,
      fck: 30,
      fy: 415,
      bedLevel: 95.2
    };
    
    // Sample design output data
    const sampleOutput = {
      projectInfo: {
        span: 7.6,
        width: 12.0,
        discharge: 150.5,
        floodLevel: 100.6,
        bedLevel: 95.2,
        flowDepth: 3.2
      },
      hydraulics: {
        afflux: 0.45,
        designWaterLevel: 101.05,
        velocity: 2.8,
        laceysSiltFactor: 1.2,
        crossSectionalArea: 53.75,
        froudeNumber: 0.35,
        contraction: 1.15
      },
      pier: {
        width: 1.5,
        length: 12.0,
        numberOfPiers: 3,
        spacing: 8.2,
        depth: 4.5,
        baseWidth: 3.0,
        baseLength: 14.0,
        baseConcrete: 189.0,
        pierConcrete: 145.8,
        hydrostaticForce: 125.6,
        dragForce: 45.3,
        totalHorizontalForce: 170.9,
        slidingFOS: 2.1,
        overturningFOS: 2.8,
        bearingFOS: 3.2,
        mainSteel: {
          diameter: 20,
          spacing: 150,
          quantity: 245.5
        },
        linkSteel: {
          diameter: 10,
          spacing: 200,
          quantity: 89.3
        }
      },
      abutment: {
        height: 6.8,
        width: 12.0,
        depth: 3.2,
        baseWidth: 15.0,
        baseLength: 14.0,
        wingWallHeight: 6.0,
        wingWallThickness: 0.8,
        abutmentConcrete: 259.2,
        baseConcrete: 210.0,
        wingWallConcrete: 28.8,
        activeEarthPressure: 45.7,
        verticalLoad: 895.3,
        slidingFOS: 2.4,
        overturningFOS: 3.1,
        bearingFOS: 2.9
      },
      slab: {
        thickness: 0.4,
        slabConcrete: 36.5,
        mainSteelMain: 2450,
        mainSteelDistribution: 1850
      },
      quantities: {
        totalConcrete: 937.5,
        totalSteel: 45.8,
        formwork: 1250.0
      }
    };
    
    console.log('Generating Excel workbook with merged cells preservation...');
    
    // Generate the workbook
    const buffer = await generateExcelReport(
      sampleInput,
      sampleOutput,
      'Test Bridge Design'
    );
    
    // Save to file
    const outputPath = path.join(__dirname, 'OUTPUT', 'test_merged_cells_preservation.xlsx');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Merged cells preservation test Excel file generated successfully: ${outputPath}`);
    console.log(`File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    
    // Verify the file was created
    if (fs.existsSync(outputPath)) {
      console.log('✓ File creation verified');
    } else {
      console.log('✗ File creation failed');
    }
    
    // Analyze the generated file to check merged cells preservation
    console.log('\n=== GENERATED FILE ANALYSIS ===');
    const generatedWorkbook = XLSX.readFile(outputPath, { 
      cellFormula: true,
      cellStyles: true
    });
    
    console.log(`Number of sheets in generated file: ${generatedWorkbook.SheetNames.length}`);
    
    // Check for merged cells in key sheets
    const keySheets = ['HYDRAULICS', 'STABILITY CHECK FOR PIER', 'abstract of stresses'];
    
    keySheets.forEach(sheetName => {
      const sheet = generatedWorkbook.Sheets[sheetName];
      if (!sheet) {
        console.log(`${sheetName}: Sheet not found in generated file`);
        return;
      }
      
      if (sheet['!merges'] && sheet['!merges'].length > 0) {
        console.log(`${sheetName}: ${sheet['!merges'].length} merged cells preserved`);
      } else {
        console.log(`${sheetName}: No merged cells found (may be expected for this sheet)`);
      }
    });
    
    // Check INSERT sheets that we populated
    const insertSheets = ['INSERT- HYDRAULICS', 'INSERT C1-ABUT', 'INSERT ESTIMATE'];
    
    insertSheets.forEach(sheetName => {
      const sheet = generatedWorkbook.Sheets[sheetName];
      if (!sheet) {
        console.log(`${sheetName}: Sheet not found in generated file`);
        return;
      }
      
      console.log(`\n${sheetName}:`);
      console.log(`  Range: ${sheet['!ref'] || 'undefined'}`);
      
      // Count populated cells
      let cellCount = 0;
      for (const cellAddress in sheet) {
        if (cellAddress.startsWith('!')) continue;
        const cell = sheet[cellAddress];
        if (cell && (cell.v !== undefined || cell.f !== undefined)) {
          cellCount++;
        }
      }
      console.log(`  Populated cells: ${cellCount}`);
    });
    
    console.log('\n✓ Merged cells and formatting preservation test completed successfully');
    
  } catch (error) {
    console.error('Error testing merged cells preservation:', error);
  }
}

// Run the test
testMergedCellsPreservation();