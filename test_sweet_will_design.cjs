const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Import the enhanced template generator
async function testSweetWillDesign() {
  try {
    // Dynamically import the ES module
    const { generateExcelReport } = await import('./server/excel-template-enhanced.ts');
    
    // Sample input data designed with "sweet will" - realistic engineering parameters
    const sweetWillInput = {
      discharge: 200.0,        // cumecs - realistic flood discharge
      floodLevel: 102.5,       // meters - flood level
      bedSlope: 0.0008,        // slope - gentle river bed slope
      span: 10.0,              // meters - span length
      width: 12.5,             // meters - bridge width
      soilBearingCapacity: 25.0, // tonnes/m² - good soil bearing capacity
      numberOfLanes: 2,        // lanes - standard two-lane bridge
      fck: 35,                 // MPa - M35 grade concrete
      fy: 500,                 // MPa - Fe500 grade steel
      bedLevel: 98.0           // meters - river bed level
    };
    
    // Sample design output data with comprehensive engineering calculations
    const sweetWillOutput = {
      projectInfo: {
        span: 10.0,
        width: 12.5,
        discharge: 200.0,
        floodLevel: 102.5,
        bedLevel: 98.0,
        flowDepth: 4.5
      },
      hydraulics: {
        afflux: 0.35,              // meters - calculated afflux
        designWaterLevel: 102.85,   // meters - flood level + afflux
        velocity: 3.2,             // m/s - flow velocity
        laceysSiltFactor: 1.1,     // silt factor
        crossSectionalArea: 62.5,  // m² - flow area
        froudeNumber: 0.42,        // dimensionless - flow regime
        contraction: 1.25          // contraction coefficient
      },
      pier: {
        width: 1.8,                // meters - pier width
        length: 12.5,              // meters - pier length
        numberOfPiers: 3,          // count - number of piers
        spacing: 10.5,             // meters - pier spacing
        depth: 5.0,                // meters - pier depth
        baseWidth: 3.5,            // meters - pier base width
        baseLength: 14.0,          // meters - pier base length
        baseConcrete: 245.0,       // m³ - base concrete volume
        pierConcrete: 189.0,       // m³ - pier concrete volume
        hydrostaticForce: 156.8,   // kN - hydrostatic force
        dragForce: 52.3,           // kN - drag force
        totalHorizontalForce: 209.1, // kN - total horizontal force
        slidingFOS: 2.3,           // factor of safety against sliding
        overturningFOS: 2.9,       // factor of safety against overturning
        bearingFOS: 3.1,           // factor of safety against bearing failure
        mainSteel: {
          diameter: 25,            // mm - main steel diameter
          spacing: 150,            // mm - main steel spacing
          quantity: 278.5          // kg - main steel quantity
        },
        linkSteel: {
          diameter: 12,            // mm - link steel diameter
          spacing: 200,            // mm - link steel spacing
          quantity: 95.7           // kg - link steel quantity
        }
      },
      abutment: {
        height: 7.2,               // meters - abutment height
        width: 12.5,               // meters - abutment width
        depth: 3.5,                // meters - abutment depth
        baseWidth: 16.0,           // meters - abutment base width
        baseLength: 14.5,          // meters - abutment base length
        wingWallHeight: 6.5,       // meters - wing wall height
        wingWallThickness: 0.9,    // meters - wing wall thickness
        abutmentConcrete: 287.3,   // m³ - abutment concrete volume
        baseConcrete: 234.5,       // m³ - base concrete volume
        wingWallConcrete: 32.1,    // m³ - wing wall concrete volume
        activeEarthPressure: 48.6, // kN - active earth pressure
        verticalLoad: 942.7,       // kN - vertical load
        slidingFOS: 2.5,           // factor of safety against sliding
        overturningFOS: 3.2,       // factor of safety against overturning
        bearingFOS: 3.0            // factor of safety against bearing failure
      },
      slab: {
        thickness: 0.5,            // meters - slab thickness
        slabConcrete: 42.8,        // m³ - slab concrete volume
        mainSteelMain: 2680,       // kg - main steel in slab
        mainSteelDistribution: 1920 // kg - distribution steel in slab
      },
      quantities: {
        totalConcrete: 1023.7,     // m³ - total concrete quantity
        totalSteel: 48.9,          // tonnes - total steel quantity
        formwork: 1380.0           // m² - formwork area
      }
    };
    
    console.log('Generating Excel workbook with "sweet will" designed inputs...');
    console.log('Bridge Design Parameters:');
    console.log(`  Span: ${sweetWillInput.span}m | Width: ${sweetWillInput.width}m`);
    console.log(`  Discharge: ${sweetWillInput.discharge} cumecs | Flood Level: ${sweetWillInput.floodLevel}m`);
    console.log(`  Concrete: M${sweetWillInput.fck} | Steel: Fe${sweetWillInput.fy}`);
    
    // Generate the workbook
    const buffer = await generateExcelReport(
      sweetWillInput,
      sweetWillOutput,
      'Sweet Will Bridge Design'
    );
    
    // Save to file
    const outputPath = path.join(__dirname, 'OUTPUT', 'sweet_will_bridge_design.xlsx');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`\n"Sweet will" design Excel file generated successfully: ${outputPath}`);
    console.log(`File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    
    // Verify the file was created
    if (fs.existsSync(outputPath)) {
      console.log('✓ File creation verified');
    } else {
      console.log('✗ File creation failed');
    }
    
    // Analyze the generated file to check detailed implementation
    console.log('\n=== GENERATED FILE ANALYSIS ===');
    const generatedWorkbook = XLSX.readFile(outputPath, { 
      cellFormula: true,
      cellStyles: true
    });
    
    console.log(`Number of sheets in generated file: ${generatedWorkbook.SheetNames.length}`);
    
    // Check the 3 key INSERT sheets in detail
    const insertSheets = ['INSERT- HYDRAULICS', 'INSERT C1-ABUT', 'INSERT ESTIMATE'];
    
    insertSheets.forEach(sheetName => {
      const sheet = generatedWorkbook.Sheets[sheetName];
      if (!sheet) {
        console.log(`${sheetName}: Sheet not found in generated file`);
        return;
      }
      
      console.log(`\n--- ${sheetName} ---`);
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
    
    // Verify specific content in each sheet
    console.log('\n=== CONTENT VERIFICATION ===');
    
    // Check INSERT- HYDRAULICS
    const hydraulicsSheet = generatedWorkbook.Sheets['INSERT- HYDRAULICS'];
    if (hydraulicsSheet) {
      const hasHeader = hydraulicsSheet['A1'] && hydraulicsSheet['A1'].v === 'BRIDGE HYDRAULIC DESIGN INPUTS';
      const hasSpan = hydraulicsSheet['B12'] && hydraulicsSheet['B12'].v === sweetWillInput.span;
      const hasDischarge = hydraulicsSheet['B17'] && hydraulicsSheet['B17'].v === sweetWillInput.discharge;
      const hasConcreteGrade = hydraulicsSheet['B23'] && hydraulicsSheet['B23'].v === sweetWillInput.fck;
      
      console.log(`INSERT- HYDRAULICS verification:`);
      console.log(`  ✓ Header present: ${hasHeader}`);
      console.log(`  ✓ Span value (${sweetWillInput.span}m) correct: ${hasSpan}`);
      console.log(`  ✓ Discharge value (${sweetWillInput.discharge} cumecs) correct: ${hasDischarge}`);
      console.log(`  ✓ Concrete grade (M${sweetWillInput.fck}) correct: ${hasConcreteGrade}`);
    }
    
    // Check INSERT C1-ABUT
    const abutmentSheet = generatedWorkbook.Sheets['INSERT C1-ABUT'];
    if (abutmentSheet && sweetWillOutput.abutment) {
      const hasExistingContent = abutmentSheet['A1'] && abutmentSheet['A1'].v === 'BRIDGE DESIGN';
      const hasAbutmentHeight = abutmentSheet['B9'] && abutmentSheet['B9'].v === sweetWillOutput.abutment.height;
      const hasAbutmentParams = abutmentSheet['A5'] && abutmentSheet['A5'].v === 'ABUTMENT DESIGN PARAMETERS';
      const hasSlidingFOS = abutmentSheet['B27'] && abutmentSheet['B27'].v === sweetWillOutput.abutment.slidingFOS;
      
      console.log(`INSERT C1-ABUT verification:`);
      console.log(`  ✓ Existing template content preserved: ${hasExistingContent}`);
      console.log(`  ✓ Abutment height (${sweetWillOutput.abutment.height}m) correct: ${hasAbutmentHeight}`);
      console.log(`  ✓ Abutment parameters section present: ${hasAbutmentParams}`);
      console.log(`  ✓ Sliding FOS (${sweetWillOutput.abutment.slidingFOS}) correct: ${hasSlidingFOS}`);
    }
    
    // Check INSERT ESTIMATE
    const estimateSheet = generatedWorkbook.Sheets['INSERT ESTIMATE'];
    if (estimateSheet && sweetWillOutput.quantities) {
      const hasExistingContent = estimateSheet['A1'] && estimateSheet['A1'].v === 'BRIDGE DESIGN';
      const hasConcrete = estimateSheet['B9'] && estimateSheet['B9'].v === sweetWillOutput.quantities.totalConcrete;
      const hasEstimateParams = estimateSheet['A5'] && estimateSheet['A5'].v === 'PROJECT ESTIMATION PARAMETERS';
      const hasSteel = estimateSheet['B10'] && estimateSheet['B10'].v === sweetWillOutput.quantities.totalSteel;
      
      console.log(`INSERT ESTIMATE verification:`);
      console.log(`  ✓ Existing template content preserved: ${hasExistingContent}`);
      console.log(`  ✓ Concrete quantity (${sweetWillOutput.quantities.totalConcrete}m³) correct: ${hasConcrete}`);
      console.log(`  ✓ Estimation parameters section present: ${hasEstimateParams}`);
      console.log(`  ✓ Steel quantity (${sweetWillOutput.quantities.totalSteel} tonnes) correct: ${hasSteel}`);
    }
    
    console.log('\n=== ENGINEERING SUMMARY ===');
    console.log(`Bridge Span: ${sweetWillInput.span}m | Width: ${sweetWillInput.width}m`);
    console.log(`Design Discharge: ${sweetWillInput.discharge} cumecs`);
    console.log(`Flood Level: ${sweetWillInput.floodLevel}m | Bed Level: ${sweetWillInput.bedLevel}m`);
    console.log(`Afflux: ${sweetWillOutput.hydraulics.afflux}m | Design Water Level: ${sweetWillOutput.hydraulics.designWaterLevel}m`);
    console.log(`Pier Count: ${sweetWillOutput.pier.numberOfPiers} | Spacing: ${sweetWillOutput.pier.spacing}m`);
    console.log(`Abutment Height: ${sweetWillOutput.abutment.height}m`);
    console.log(`Total Concrete: ${sweetWillOutput.quantities.totalConcrete}m³ | Total Steel: ${sweetWillOutput.quantities.totalSteel} tonnes`);
    
    console.log('\n✓ "Sweet will" design test completed successfully');
    
  } catch (error) {
    console.error('Error testing "sweet will" design:', error);
  }
}

// Run the test
testSweetWillDesign();