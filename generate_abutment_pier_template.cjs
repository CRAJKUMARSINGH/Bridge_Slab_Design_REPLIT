const ExcelJS = require('exceljs');
const path = require('path');

async function generateAbutmentPierTemplate() {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // ==================== SHEET 1: ABUTMENT LEVELS & GEOMETRY ====================
    const abutmentSheet = workbook.addWorksheet('ABUTMENT LEVELS & GEOMETRY');
    
    // Set column widths
    abutmentSheet.columns = [
      { width: 15 }, // ABUTMENT NO.
      { width: 15 }, // CHAINAGE (m)
      { width: 20 }, // ABUTMENT HEIGHT (m)
      { width: 20 }, // FOUNDATION LEVEL (m)
      { width: 15 }, // GL LEVEL (m)
      { width: 12 }, // HFL (m)
      { width: 15 }, // DECK LEVEL (m)
      { width: 15 }, // SOFFIT LEVEL (m)
      { width: 25 }, // FOOTING SIZE (LxBxH) m
      { width: 20 }  // REMARKS
    ];
    
    // Header row for abutment data
    const abutmentHeaderRow = abutmentSheet.addRow([
      'ABUTMENT NO.', 'CHAINAGE (m)', 'ABUTMENT HEIGHT (m)', 'FOUNDATION LEVEL (m)', 
      'GL LEVEL (m)', 'HFL (m)', 'DECK LEVEL (m)', 'SOFFIT LEVEL (m)', 
      'FOOTING SIZE (LxBxH) m', 'REMARKS'
    ]);
    abutmentHeaderRow.font = { bold: true, size: 12 };
    abutmentHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Abutment data
    abutmentSheet.addRow([1, 0.0, 8.0, 93.47, 96.6, 100.6, 101.6, 100.6, '10x5x1.2', '']);
    abutmentSheet.addRow([2, 100.0, 8.0, 93.47, 96.6, 100.6, 101.6, 100.6, '10x5x1.2', '']);
    
    // Add spacing
    abutmentSheet.addRow([]);
    
    // Title for component geometry
    const componentTitleRow = abutmentSheet.addRow(['ABUTMENT COMPONENT GEOMETRY']);
    componentTitleRow.font = { bold: true, size: 14 };
    
    // Header for component geometry
    const componentHeaderRow = abutmentSheet.addRow([
      'COMPONENT', 'DESCRIPTION', 'LEVEL (m)', 'DIMENSIONS (m)', 'MATERIAL', 'MATERIAL GRADE', 'REMARKS'
    ]);
    componentHeaderRow.font = { bold: true, size: 12 };
    componentHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Component data
    const components = [
      ['Abutment Body', 'Reinforced concrete structure', '93.47 to 101.47', 'Variable', 'RCC', 'M30', ''],
      ['Wing Walls', 'Approach retaining walls', '93.47 to 98.47', 'Variable', 'RCC', 'M30', ''],
      ['Return Walls', 'Side retaining walls', '93.47 to 101.47', 'Variable', 'RCC', 'M30', ''],
      ['Footing', 'Footing slab', '93.47', '10x5x1.2', 'RCC', 'M30', ''],
      ['Abutment Cap', 'Pier cap structure', '101.47', '12x1.5x1.0', 'RCC', 'M35', ''],
      ['Dirt Wall', 'Backfill retaining wall', '96.6 to 98.1', '1.5m height', 'RCC', 'M25', ''],
      ['Wearing Coat', 'Protective surface layer', '101.6', '0.075m thick', 'Concrete', 'M30', ''],
      ['Approach Slab', 'Approach transition slab', '101.6', 'Variable', 'RCC', 'M30', '']
    ];
    
    components.forEach(component => {
      abutmentSheet.addRow(component);
    });
    
    // Add spacing
    abutmentSheet.addRow([]);
    
    // Title for hydraulic parameters
    const hydraulicTitleRow = abutmentSheet.addRow(['HYDRAULIC PARAMETERS']);
    hydraulicTitleRow.font = { bold: true, size: 14 };
    
    // Header for hydraulic parameters
    const hydraulicHeaderRow = abutmentSheet.addRow([
      'PARAMETER', 'VALUE', 'UNIT', 'DESCRIPTION'
    ]);
    hydraulicHeaderRow.font = { bold: true, size: 12 };
    hydraulicHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Hydraulic parameter data
    const hydraulicParams = [
      ['Highest Flood Level (HFL)', '100.6', 'm', 'Maximum flood level during design event'],
      ['Ordinary Flood Level (OFL)', '97.6', 'm', 'Normal flood level'],
      ['Lowest Nala Bed Level (NBL)', '96.47', 'm', 'Minimum channel bed elevation'],
      ['Average Ground Level (AGL)', '96.6', 'm', 'Average ground elevation along alignment'],
      ['Foundation Level (FL)', '93.47', 'm', 'Level of foundation elements'],
      ['Afflux', '0.23', 'm', 'Increase in water level due to bridge obstruction'],
      ['Afflux Flood Level', '100.83', 'm', 'HFL + Afflux'],
      ['Deck Clearance', '1.0', 'm', 'Vertical clearance between HFL and deck']
    ];
    
    hydraulicParams.forEach(param => {
      abutmentSheet.addRow(param);
    });
    
    // Add spacing
    abutmentSheet.addRow([]);
    
    // Title for design criteria
    const criteriaTitleRow = abutmentSheet.addRow(['DESIGN CRITERIA']);
    criteriaTitleRow.font = { bold: true, size: 14 };
    
    // Header for design criteria
    const criteriaHeaderRow = abutmentSheet.addRow([
      'CHECK', 'REQUIRED', 'ACTUAL', 'STATUS', 'COMMENTS'
    ]);
    criteriaHeaderRow.font = { bold: true, size: 12 };
    criteriaHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Design criteria data
    const criteria = [
      ['Sliding Check', '1.5', '1.67', 'SAFE', 'Friction coefficient = 0.5'],
      ['Overturning Check', '1.8', '2.5', 'SAFE', 'Lever arm = 2.25m'],
      ['Bearing Pressure Check', '2.5', '3.0', 'SAFE', 'SBC = 150 kPa'],
      ['Hydraulic Clearance', '0.5m', '1.0m', 'SAFE', 'Adequate for submersible bridge']
    ];
    
    criteria.forEach(criterion => {
      abutmentSheet.addRow(criterion);
    });
    
    // ==================== SHEET 2: PIER LEVELS & GEOMETRY ====================
    const pierSheet = workbook.addWorksheet('PIER LEVELS & GEOMETRY');
    
    // Set column widths
    pierSheet.columns = [
      { width: 12 }, // PIER NO.
      { width: 15 }, // CHAINAGE (m)
      { width: 18 }, // PIER HEIGHT (m)
      { width: 20 }, // FOUNDATION LEVEL (m)
      { width: 15 }, // BED LEVEL (m)
      { width: 12 }, // HFL (m)
      { width: 15 }, // DECK LEVEL (m)
      { width: 15 }, // SOFFIT LEVEL (m)
      { width: 25 }, // PIER DIMENSIONS (LxB) m
      { width: 20 }  // REMARKS
    ];
    
    // Header row for pier data
    const pierHeaderRow = pierSheet.addRow([
      'PIER NO.', 'CHAINAGE (m)', 'PIER HEIGHT (m)', 'FOUNDATION LEVEL (m)', 
      'BED LEVEL (m)', 'HFL (m)', 'DECK LEVEL (m)', 'SOFFIT LEVEL (m)', 
      'PIER DIMENSIONS (LxB) m', 'REMARKS'
    ]);
    pierHeaderRow.font = { bold: true, size: 12 };
    pierHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Pier data (11 piers as in the template)
    const piers = [
      [1, 7.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [2, 15.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [3, 23.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [4, 31.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [5, 39.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [6, 47.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [7, 55.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [8, 63.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [9, 71.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [10, 79.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', ''],
      [11, 87.6, 15.0, 93.47, 96.6, 100.6, 101.6, 100.6, '3.5x1.2', '']
    ];
    
    piers.forEach(pier => {
      pierSheet.addRow(pier);
    });
    
    // Add spacing
    pierSheet.addRow([]);
    
    // Title for pier component geometry
    const pierComponentTitleRow = pierSheet.addRow(['PIER COMPONENT GEOMETRY']);
    pierComponentTitleRow.font = { bold: true, size: 14 };
    
    // Header for pier component geometry
    const pierComponentHeaderRow = pierSheet.addRow([
      'COMPONENT', 'DESCRIPTION', 'LEVEL (m)', 'DIMENSIONS (m)', 'MATERIAL', 'MATERIAL GRADE', 'REMARKS'
    ]);
    pierComponentHeaderRow.font = { bold: true, size: 12 };
    pierComponentHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Pier component data
    const pierComponents = [
      ['Pier Shaft', 'Main vertical structure', '93.47 to 101.47', '3.5x1.2', 'RCC', 'M30', ''],
      ['Pier Cap', 'Load distribution element', '101.47', '12x3.5x1.5', 'RCC', 'M35', ''],
      ['Footing', 'Footing slab', '93.47', '4.5x2.5x1.2', 'RCC', 'M30', ''],
      ['Flared Base', 'Base enlargement', '93.47 to 94.67', 'Variable', 'RCC', 'M30', ''],
      ['Wearing Coat', 'Protective surface layer', '101.6', '0.075m thick', 'Concrete', 'M30', '']
    ];
    
    pierComponents.forEach(component => {
      pierSheet.addRow(component);
    });
    
    // Add spacing
    pierSheet.addRow([]);
    
    // Title for hydraulic loads on pier
    const pierLoadsTitleRow = pierSheet.addRow(['HYDRAULIC LOADS ON PIER']);
    pierLoadsTitleRow.font = { bold: true, size: 14 };
    
    // Header for hydraulic loads
    const pierLoadsHeaderRow = pierSheet.addRow([
      'LOAD TYPE', 'DESCRIPTION', 'VALUE', 'UNIT', 'DIRECTION'
    ]);
    pierLoadsHeaderRow.font = { bold: true, size: 12 };
    pierLoadsHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Hydraulic load data
    const pierLoads = [
      ['Hydrostatic Pressure', 'Water pressure on pier', '137.44', 'kN', 'Horizontal'],
      ['Drag Force', 'Flow induced force', '60.97', 'kN', 'Horizontal'],
      ['Buoyancy Effect', 'Upward force reduction', '15%', 'Vertical', ''],
      ['Live Load', 'Surfacing traffic load', '300', 'kN', 'Vertical'],
      ['Dead Load', 'Self weight + superstructure', '1200', 'kN', 'Vertical']
    ];
    
    pierLoads.forEach(load => {
      pierSheet.addRow(load);
    });
    
    // Add spacing
    pierSheet.addRow([]);
    
    // Title for pier stability checks
    const pierStabilityTitleRow = pierSheet.addRow(['PIER STABILITY CHECKS']);
    pierStabilityTitleRow.font = { bold: true, size: 14 };
    
    // Header for pier stability checks
    const pierStabilityHeaderRow = pierSheet.addRow([
      'CHECK', 'REQUIRED', 'ACTUAL', 'STATUS', 'COMMENTS'
    ]);
    pierStabilityHeaderRow.font = { bold: true, size: 12 };
    pierStabilityHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Pier stability check data
    const pierStability = [
      ['Sliding Check', '1.5', '2.0', 'SAFE', 'Friction coefficient = 0.5'],
      ['Overturning Check', '1.8', '2.8', 'SAFE', 'Moment arm = 1.75m'],
      ['Bearing Pressure Check', '2.5', '3.2', 'SAFE', 'SBC = 150 kPa'],
      ['Foundation Depth Check', '2.0m', '3.13m', 'SAFE', 'Below scour level']
    ];
    
    pierStability.forEach(check => {
      pierSheet.addRow(check);
    });
    
    // ==================== SHEET 3: HYDRAULIC LEVELS REFERENCE ====================
    const hydraulicSheet = workbook.addWorksheet('HYDRAULIC LEVELS REFERENCE');
    
    // Set column widths
    hydraulicSheet.columns = [
      { width: 25 }, // LEVEL PARAMETER
      { width: 35 }, // DESCRIPTION
      { width: 15 }, // VALUE
      { width: 10 }, // UNIT
      { width: 25 }  // SOURCE
    ];
    
    // Title for hydraulic levels
    const hydraulicLevelsTitleRow = hydraulicSheet.addRow(['HYDRAULIC LEVEL PARAMETERS']);
    hydraulicLevelsTitleRow.font = { bold: true, size: 14 };
    
    // Header for hydraulic levels
    const hydraulicLevelsHeaderRow = hydraulicSheet.addRow([
      'LEVEL PARAMETER', 'DESCRIPTION', 'VALUE', 'UNIT', 'SOURCE'
    ]);
    hydraulicLevelsHeaderRow.font = { bold: true, size: 12 };
    hydraulicLevelsHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Hydraulic level data
    const hydraulicLevels = [
      ['HFL', 'Highest Flood Level', '100.600', 'm', 'HYDRAULICS Sheet F4'],
      ['OFL', 'Ordinary Flood Level', '97.600', 'm', 'HYDRAULICS Sheet E44'],
      ['NBL', 'Lowest Nala Bed Level', '96.470', 'm', 'HYDRAULICS Sheet E43'],
      ['AGL', 'Average Ground Level', '96.600', 'm', 'HYDRAULICS Sheet E41'],
      ['FL', 'Foundation Level', '93.470', 'm', 'HYDRAULICS Sheet E45'],
      ['RTL', 'Road Top Level', '101.600', 'm', 'HYDRAULICS Sheet E40'],
      ['Deck Level', 'Top of wearing coat', '101.600', 'm', 'STABILITY Sheet E21'],
      ['Soffit Level', 'Bottom of deck slab', '100.600', 'm', 'Deck Anchorage D24'],
      ['Afflux', 'Water level increase', '0.230', 'm', 'Afflux Calculation B78'],
      ['Afflux Flood Level', 'HFL + Afflux', '100.830', 'm', 'Afflux Calculation F79']
    ];
    
    hydraulicLevels.forEach(level => {
      hydraulicSheet.addRow(level);
    });
    
    // Add spacing
    hydraulicSheet.addRow([]);
    
    // Title for level relationships
    const relationshipsTitleRow = hydraulicSheet.addRow(['LEVEL RELATIONSHIPS']);
    relationshipsTitleRow.font = { bold: true, size: 14 };
    
    // Header for level relationships
    const relationshipsHeaderRow = hydraulicSheet.addRow([
      'RELATIONSHIP', 'FORMULA', 'CALCULATION', 'RESULT'
    ]);
    relationshipsHeaderRow.font = { bold: true, size: 12 };
    relationshipsHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Level relationship data
    const relationships = [
      ['Deck Level', 'HFL + Slab Thickness + Wearing Coat', '100.6 + 0.85 + 0.075', '101.525 ≈ 101.6m'],
      ['Soffit Level', 'Defined as HFL', '', '100.6m'],
      ['Foundation Depth', 'FL to Bed Level', '96.6 - 93.47', '3.13m'],
      ['Hydraulic Clearance', 'HFL to Deck', '101.6 - 100.6', '1.0m'],
      ['Structural Soffit', 'HFL - Slab Thickness', '100.6 - 0.85', '99.75m']
    ];
    
    relationships.forEach(relationship => {
      hydraulicSheet.addRow(relationship);
    });
    
    // ==================== SHEET 4: STRUCTURAL PARAMETERS ====================
    const structuralSheet = workbook.addWorksheet('STRUCTURAL PARAMETERS');
    
    // Set column widths
    structuralSheet.columns = [
      { width: 25 }, // STRUCTURAL ELEMENT
      { width: 25 }, // MEMBER
      { width: 20 }, // SIZE (mm)
      { width: 15 }, // MATERIAL
      { width: 18 }, // MATERIAL GRADE
      { width: 40 }  // REINFORCEMENT
    ];
    
    // Title for structural parameters
    const structuralTitleRow = structuralSheet.addRow(['STRUCTURAL PARAMETERS']);
    structuralTitleRow.font = { bold: true, size: 14 };
    
    // Header for structural parameters
    const structuralHeaderRow = structuralSheet.addRow([
      'STRUCTURAL ELEMENT', 'MEMBER', 'SIZE (mm)', 'MATERIAL', 'MATERIAL GRADE', 'REINFORCEMENT'
    ]);
    structuralHeaderRow.font = { bold: true, size: 12 };
    structuralHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Structural parameter data for abutment
    const abutmentStructural = [
      ['Abutment', 'Vertical Members', '400x600', 'RCC', 'M30', '16φ@150mm c/c'],
      ['', 'Horizontal Members', '300x500', 'RCC', 'M30', '12φ@200mm c/c'],
      ['', 'Footing', '10000x5000x1200', 'RCC', 'M30', '20φ@150mm c/c main, 16φ@200mm c/c distribution'],
      ['', 'Abutment Cap', '12000x1500x1000', 'RCC', 'M35', '20φ@150mm c/c'],
      ['', 'Dirt Wall', '1500 height', 'RCC', 'M25', '12φ@150mm c/c vertical, 10φ@200mm c/c horizontal'],
      ['', 'Wearing Coat', '75 thick', 'Concrete', 'M30', 'Mesh reinforcement'],
      ['Approach Slab', 'Transition Element', 'Variable', 'RCC', 'M30', '16φ@150mm c/c']
    ];
    
    abutmentStructural.forEach(param => {
      structuralSheet.addRow(param);
    });
    
    // Add spacing
    structuralSheet.addRow([]);
    
    // Structural parameter data for pier
    const pierStructuralHeaderRow = structuralSheet.addRow([
      'Pier', 'Shaft', '3500x1200', 'RCC', 'M30', '16φ@150mm c/c main, 12φ@200mm c/c distribution'
    ]);
    pierStructuralHeaderRow.font = { bold: true };
    
    const pierStructural = [
      ['', 'Footing', '4500x2500x1200', 'RCC', 'M30', '20φ@150mm c/c main, 16φ@200mm c/c distribution'],
      ['', 'Pier Cap', '12000x3500x1500', 'RCC', 'M35', '25φ@150mm c/c main'],
      ['', 'Flared Base', 'Variable', 'RCC', 'M30', '16φ@150mm c/c']
    ];
    
    pierStructural.forEach(param => {
      structuralSheet.addRow(param);
    });
    
    // Add spacing
    structuralSheet.addRow([]);
    
    // Title for load combinations
    const loadCombTitleRow = structuralSheet.addRow(['LOAD COMBINATIONS']);
    loadCombTitleRow.font = { bold: true, size: 14 };
    
    // Header for load combinations
    const loadCombHeaderRow = structuralSheet.addRow([
      'LOAD CASE', 'DESCRIPTION', 'DL FACTOR', 'LL FACTOR', 'HL FACTOR'
    ]);
    loadCombHeaderRow.font = { bold: true, size: 12 };
    loadCombHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Load combination data
    const loadCombinations = [
      [1, 'Service Condition', '1.0', '1.0', '1.0'],
      [2, 'Flood Condition', '1.0', '0.0', '1.0'],
      [3, 'Seismic Condition', '1.0', '0.25', '1.0'],
      [4, 'Construction Stage', '1.0', '0.0', '0.5'],
      [5, 'Ultimate Limit State', '1.35', '1.5', '1.0']
    ];
    
    loadCombinations.forEach(combination => {
      structuralSheet.addRow(combination);
    });
    
    // Add spacing
    structuralSheet.addRow([]);
    
    // Title for design standards
    const standardsTitleRow = structuralSheet.addRow(['DESIGN STANDARDS']);
    standardsTitleRow.font = { bold: true, size: 14 };
    
    // Header for design standards
    const standardsHeaderRow = structuralSheet.addRow([
      'STANDARD', 'DESCRIPTION', 'APPLICATION'
    ]);
    standardsHeaderRow.font = { bold: true, size: 12 };
    standardsHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Design standard data
    const standards = [
      ['IRC 6', 'Standard Specifications for Road Bridges - Loads and Stresses', 'All structural elements'],
      ['IRC 21', 'Design of Composite Bridges', 'Deck system'],
      ['IRC 22', 'Cement Concrete in Road Bridges', 'Concrete elements'],
      ['IRC 45', 'Roads in Hill Areas', 'Foundation design'],
      ['IRC 78', 'Design of Submersible Bridges', 'Hydraulic design'],
      ['IS 456', 'Plain and Reinforced Concrete Code', 'All RCC elements'],
      ['IS 800', 'Steel Structures Code', 'Steel elements (if any)'],
      ['IS 1893', 'Earthquake Resistant Design', 'Seismic considerations']
    ];
    
    standards.forEach(standard => {
      structuralSheet.addRow(standard);
    });
    
    // ==================== SAVE WORKBOOK ====================
    const filePath = path.join(__dirname, 'abutment_pier_level_geometry_template.xlsx');
    await workbook.xlsx.writeFile(filePath);
    
    console.log(`✅ Abutment and Pier Level & Geometry Template created successfully!`);
    console.log(`📁 File saved at: ${filePath}`);
    
  } catch (error) {
    console.error('❌ Error creating template:', error);
  }
}

// Run the template generation
generateAbutmentPierTemplate();