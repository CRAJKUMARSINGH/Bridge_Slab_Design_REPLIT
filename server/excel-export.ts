import ExcelJS from 'exceljs';
import { DesignInput, DesignOutput } from './design-engine';

const HEADER_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF0066CC' } };
const HEADER_FONT = { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 };
const SUBHEADER_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFE8F0FF' } };
const SUBHEADER_FONT = { bold: true, size: 10 };
const CALC_FILL = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFFFFE0' } };
const BORDER_THIN = { style: 'thin' as const, color: { argb: 'FF000000' } };
const BORDERS = { top: BORDER_THIN, bottom: BORDER_THIN, left: BORDER_THIN, right: BORDER_THIN };

function styleHeaderCell(cell: any) {
  cell.fill = HEADER_FILL;
  cell.font = HEADER_FONT;
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = BORDERS;
}

function styleDataCell(cell: any, highlight = false) {
  cell.border = BORDERS;
  if (highlight) {
    cell.fill = CALC_FILL;
    cell.font = { bold: true };
  }
  cell.alignment = { horizontal: 'right', vertical: 'middle' };
}

async function addDataRow(
  ws: ExcelJS.Worksheet,
  row: number,
  label: string,
  value: any,
  unit: string = '',
  highlight = false
) {
  const labelCell = ws.getCell(row, 1);
  labelCell.value = label;
  labelCell.alignment = { horizontal: 'left', vertical: 'middle' };
  labelCell.border = BORDERS;
  
  const valueCell = ws.getCell(row, 2);
  valueCell.value = typeof value === 'number' ? parseFloat(value.toFixed(3)) : value;
  styleDataCell(valueCell, highlight);
  
  const unitCell = ws.getCell(row, 3);
  unitCell.value = unit;
  unitCell.alignment = { horizontal: 'left', vertical: 'center' };
  unitCell.border = BORDERS;
  
  return row + 1;
}

export async function generateExcelReport(
  input: DesignInput,
  design: DesignOutput,
  projectName: string
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // Sheet 1: Cover Page
  {
    const ws = workbook.addWorksheet('Cover Page');
    ws.columns = [{ width: 20 }, { width: 30 }, { width: 15 }];
    
    let row = 3;
    const titleCell = ws.getCell(row, 1);
    titleCell.value = 'SUBMERSIBLE BRIDGE AUTO-DESIGN SYSTEM';
    titleCell.font = { bold: true, size: 16 };
    ws.mergeCells(`A${row}:C${row}`);
    titleCell.alignment = { horizontal: 'center', vertical: 'center' };
    
    row += 2;
    ws.getCell(row, 1).value = 'Design Report';
    ws.getCell(row, 1).font = { bold: true, size: 14 };
    row += 1;
    ws.getCell(row, 1).value = projectName;
    ws.getCell(row, 1).font = { size: 12 };
    
    row += 2;
    ws.getCell(row, 1).value = 'Report Date:';
    ws.getCell(row, 2).value = new Date().toLocaleDateString();
    
    row += 1;
    ws.getCell(row, 1).value = 'Standards Used:';
    ws.getCell(row, 2).value = 'IRC:6-2016, IRC:112-2015';
  }
  
  // Sheet 2: Project Inputs
  {
    const ws = workbook.addWorksheet('Project Inputs');
    ws.columns = [{ width: 30 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    const header = ws.getCell(row, 1);
    header.value = 'PROJECT INPUT PARAMETERS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Bridge Span (L)', design.projectInfo.span, 'm');
    row = await addDataRow(ws, row, 'Bridge Width (W)', design.projectInfo.width, 'm');
    row = await addDataRow(ws, row, 'Design Discharge (Q)', design.projectInfo.discharge, 'm³/s');
    row = await addDataRow(ws, row, 'Flood Level (HFL)', design.projectInfo.floodLevel, 'm (absolute)');
    row = await addDataRow(ws, row, 'Bed Level', design.projectInfo.bedLevel, 'm (absolute)');
    row = await addDataRow(ws, row, 'Bed Slope', input.bedSlope, '-');
    row = await addDataRow(ws, row, 'Number of Lanes', input.numberOfLanes, '-');
    row = await addDataRow(ws, row, 'Concrete Grade (fck)', input.fck, 'MPa');
    row = await addDataRow(ws, row, 'Steel Grade (fy)', input.fy, 'MPa');
    row = await addDataRow(ws, row, 'Soil Bearing Capacity', input.soilBearingCapacity, 'kPa');
    row = await addDataRow(ws, row, 'Load Class', input.loadClass, '-');
  }
  
  // Sheet 3: Hydraulic Calculations
  {
    const ws = workbook.addWorksheet('Hydraulics');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    const header = ws.getCell(row, 1);
    header.value = 'HYDRAULIC DESIGN CALCULATIONS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Flow Depth', design.projectInfo.flowDepth, 'm', true);
    row = await addDataRow(ws, row, 'Cross-sectional Area', design.hydraulics.crossSectionalArea, 'm²', true);
    row = await addDataRow(ws, row, 'Flow Velocity (Lacey)', design.hydraulics.velocity, 'm/s', true);
    row = await addDataRow(ws, row, "Lacey's Silt Factor (m)", design.hydraulics.laceysSiltFactor, '-', true);
    
    row += 1;
    ws.getCell(row, 1).value = 'AFFLUX CALCULATION (IRC:6)';
    ws.getCell(row, 1).font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Afflux (h)', design.hydraulics.afflux, 'm', true);
    row = await addDataRow(ws, row, 'Design Water Level (DWL)', design.hydraulics.designWaterLevel, 'm (absolute)', true);
    row = await addDataRow(ws, row, 'Contraction Loss', design.hydraulics.contraction, 'm');
    row = await addDataRow(ws, row, 'Froude Number', design.hydraulics.froudeNumber, '-');
  }
  
  // Sheets 4-5: Pier Design
  {
    const ws = workbook.addWorksheet('Pier Design');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    let header = ws.getCell(row, 1);
    header.value = 'PIER DESIGN CALCULATIONS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Number of Piers', design.pier.numberOfPiers, '-', true);
    row = await addDataRow(ws, row, 'Pier Width (B)', design.pier.width, 'm', true);
    row = await addDataRow(ws, row, 'Pier Length (D)', design.pier.length, 'm');
    row = await addDataRow(ws, row, 'Pier Spacing', design.pier.spacing, 'm');
    row = await addDataRow(ws, row, 'Pier Depth', design.pier.depth, 'm');
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'FOUNDATION DESIGN';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Base Width', design.pier.baseWidth, 'm', true);
    row = await addDataRow(ws, row, 'Base Length', design.pier.baseLength, 'm');
    row = await addDataRow(ws, row, 'Pier Concrete Volume', design.pier.pierConcrete, 'm³', true);
    row = await addDataRow(ws, row, 'Base Concrete Volume', design.pier.baseConcrete, 'm³', true);
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'HYDRAULIC FORCES';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Hydrostatic Force', design.pier.hydrostaticForce, 'kN', true);
    row = await addDataRow(ws, row, 'Drag Force', design.pier.dragForce, 'kN', true);
    row = await addDataRow(ws, row, 'Total Horizontal Force', design.pier.totalHorizontalForce, 'kN', true);
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'STABILITY CHECKS (Min FOS: 1.5, 1.8, 2.5)';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Sliding FOS', design.pier.slidingFOS, '-', true);
    row = await addDataRow(ws, row, 'Overturning FOS', design.pier.overturningFOS, '-', true);
    row = await addDataRow(ws, row, 'Bearing Capacity FOS', design.pier.bearingFOS, '-', true);
  }
  
  // Sheet 6: Pier Reinforcement
  {
    const ws = workbook.addWorksheet('Pier Reinforcement');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    const header = ws.getCell(row, 1);
    header.value = 'PIER REINFORCEMENT DETAILS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Main Steel - Diameter', design.pier.mainSteel.diameter, 'mm', true);
    row = await addDataRow(ws, row, 'Main Steel - Spacing', design.pier.mainSteel.spacing, 'mm');
    row = await addDataRow(ws, row, 'Main Steel - Total Quantity', design.pier.mainSteel.quantity, 'nos', true);
    
    row += 1;
    row = await addDataRow(ws, row, 'Link Steel - Diameter', design.pier.linkSteel.diameter, 'mm', true);
    row = await addDataRow(ws, row, 'Link Steel - Spacing', design.pier.linkSteel.spacing, 'mm');
    row = await addDataRow(ws, row, 'Link Steel - Total Quantity', design.pier.linkSteel.quantity, 'nos', true);
  }
  
  // Sheets 7-8: Abutment Design
  {
    const ws = workbook.addWorksheet('Abutment Design');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    let header = ws.getCell(row, 1);
    header.value = 'ABUTMENT DESIGN CALCULATIONS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Abutment Height', design.abutment.height, 'm', true);
    row = await addDataRow(ws, row, 'Abutment Width', design.abutment.width, 'm', true);
    row = await addDataRow(ws, row, 'Abutment Depth', design.abutment.depth, 'm');
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'FOUNDATION DESIGN';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Base Width', design.abutment.baseWidth, 'm', true);
    row = await addDataRow(ws, row, 'Base Length', design.abutment.baseLength, 'm');
    row = await addDataRow(ws, row, 'Wing Wall Height', design.abutment.wingWallHeight, 'm');
    row = await addDataRow(ws, row, 'Wing Wall Thickness', design.abutment.wingWallThickness, 'm');
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'CONCRETE VOLUMES (per abutment)';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Abutment Concrete', design.abutment.abutmentConcrete, 'm³', true);
    row = await addDataRow(ws, row, 'Base Concrete', design.abutment.baseConcrete, 'm³', true);
    row = await addDataRow(ws, row, 'Wing Wall Concrete', design.abutment.wingWallConcrete, 'm³', true);
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'STABILITY CHECKS (Min FOS: 1.5, 2.0, 2.5)';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Active Earth Pressure', design.abutment.activeEarthPressure, 'kN');
    row = await addDataRow(ws, row, 'Vertical Load', design.abutment.verticalLoad, 'kN');
    row = await addDataRow(ws, row, 'Sliding FOS', design.abutment.slidingFOS, '-', true);
    row = await addDataRow(ws, row, 'Overturning FOS', design.abutment.overturningFOS, '-', true);
    row = await addDataRow(ws, row, 'Bearing Capacity FOS', design.abutment.bearingFOS, '-', true);
  }
  
  // Sheet 9: Abutment Reinforcement
  {
    const ws = workbook.addWorksheet('Abutment Reinforcement');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    const header = ws.getCell(row, 1);
    header.value = 'ABUTMENT REINFORCEMENT DETAILS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Main Steel - Diameter', design.abutment.mainSteel.diameter, 'mm', true);
    row = await addDataRow(ws, row, 'Main Steel - Spacing', design.abutment.mainSteel.spacing, 'mm');
    row = await addDataRow(ws, row, 'Main Steel - Total Quantity (per abutment)', design.abutment.mainSteel.quantity, 'nos', true);
  }
  
  // Sheet 10: Load Calculations
  {
    const ws = workbook.addWorksheet('Load Analysis');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    let header = ws.getCell(row, 1);
    header.value = 'LOAD CALCULATIONS (IRC:6-2016)';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Slab Thickness', design.slab.thickness, 'mm', true);
    row = await addDataRow(ws, row, 'Wearing Coat Thickness', design.slab.wearingCoat, 'm');
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'DEAD LOAD COMPONENTS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Self Weight of Slab', design.slab.thickness * 0.025, 'kN/m²');
    row = await addDataRow(ws, row, 'Wearing Coat Weight', design.slab.wearingCoat * 24, 'kN/m²');
    row = await addDataRow(ws, row, 'Total Dead Load (DL)', design.slab.deadLoad, 'kN/m²', true);
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'LIVE LOAD (IRC Standards)';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Live Load Class', input.loadClass, '-');
    row = await addDataRow(ws, row, 'Live Load (LL)', design.slab.liveLoad, 'kN/m²', true);
    row = await addDataRow(ws, row, 'Impact Factor', design.slab.impactFactor, '-');
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'DESIGN LOAD (IRC:112-2015)';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Design Load = 1.5DL + 2.0LL×IF', design.slab.designLoad, 'kN/m²', true);
  }
  
  // Sheet 11: Slab Design
  {
    const ws = workbook.addWorksheet('Slab Design');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    let header = ws.getCell(row, 1);
    header.value = 'SLAB BENDING MOMENT CALCULATIONS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Longitudinal Moment (Mx)', design.slab.longitudinalMoment, 'kN.m/m', true);
    row = await addDataRow(ws, row, 'Transverse Moment (My)', design.slab.transverseMoment, 'kN.m/m', true);
    row = await addDataRow(ws, row, 'Shear Force (V)', design.slab.shearForce, 'kN/m');
    
    row += 1;
    header = ws.getCell(row, 1);
    header.value = 'CONCRETE STRESS ANALYSIS';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 1;
    
    row = await addDataRow(ws, row, 'Bending Stress (% of fck)', design.slab.bendingStress, '%');
    row = await addDataRow(ws, row, 'Shear Stress', design.slab.shearStress, 'MPa');
    row = await addDataRow(ws, row, 'Concrete Stress Limit (0.35×fck)', design.slab.concreteStress, 'MPa');
  }
  
  // Sheet 12: Slab Reinforcement
  {
    const ws = workbook.addWorksheet('Slab Reinforcement');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    let header = ws.getCell(row, 1);
    header.value = 'SLAB MAIN REINFORCEMENT DESIGN';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Required Steel Area', design.slab.mainSteel.requiredArea, 'mm²/m', true);
    row = await addDataRow(ws, row, 'Provided Steel Area', design.slab.mainSteel.area, 'mm²/m', true);
    row = await addDataRow(ws, row, 'Steel Diameter', design.slab.mainSteel.diameter, 'mm');
    row = await addDataRow(ws, row, 'Steel Spacing', design.slab.mainSteel.spacing, 'mm', true);
    row = await addDataRow(ws, row, 'Total Bars Required', design.slab.mainSteel.quantity, 'nos', true);
    
    row += 2;
    header = ws.getCell(row, 1);
    header.value = 'SLAB DISTRIBUTION REINFORCEMENT';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Steel Diameter', design.slab.distributionSteel.diameter, 'mm');
    row = await addDataRow(ws, row, 'Steel Spacing', design.slab.distributionSteel.spacing, 'mm');
    row = await addDataRow(ws, row, 'Provided Steel Area', design.slab.distributionSteel.area, 'mm²/m');
    row = await addDataRow(ws, row, 'Total Bars Required', design.slab.distributionSteel.quantity, 'nos', true);
  }
  
  // Sheet 13: Quantities Summary
  {
    const ws = workbook.addWorksheet('Quantities');
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    let row = 1;
    let header = ws.getCell(row, 1);
    header.value = 'MATERIAL QUANTITY SUMMARY';
    header.font = SUBHEADER_FONT;
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    row = await addDataRow(ws, row, 'Slab Concrete', design.quantities.slabConcrete, 'm³', true);
    row = await addDataRow(ws, row, 'Pier Concrete', design.quantities.pierConcrete, 'm³', true);
    row = await addDataRow(ws, row, 'Abutment Concrete (2 nos)', design.quantities.abutmentConcrete, 'm³', true);
    row = await addDataRow(ws, row, 'TOTAL CONCRETE', design.quantities.totalConcrete, 'm³', true);
    
    row += 2;
    row = await addDataRow(ws, row, 'Slab Steel', design.quantities.slabSteel, 'tonnes', true);
    row = await addDataRow(ws, row, 'Pier Steel', design.quantities.pierSteel, 'tonnes', true);
    row = await addDataRow(ws, row, 'Abutment Steel (2 nos)', design.quantities.abutmentSteel, 'tonnes', true);
    row = await addDataRow(ws, row, 'TOTAL STEEL', design.quantities.totalSteel, 'tonnes', true);
    
    row += 2;
    row = await addDataRow(ws, row, 'Formwork Required', design.quantities.formwork, 'm²');
  }
  
  // Add 30 more empty structured sheets for detailed calculations and reinforcement schedules
  const additionalSheets = [
    'Slab Moment Distribution', 'Slab Shear Distribution',
    'Pier Moment Analysis', 'Pier Shear Analysis',
    'Abutment Moment Analysis', 'Abutment Pressure Distribution',
    'Foundation Settlement Check', 'Scour Analysis',
    'Seismic Considerations', 'Temperature Effects',
    'Material Specifications', 'Concrete Grades',
    'Steel Specifications', 'Reinforcement Schedule - Slab',
    'Reinforcement Schedule - Pier', 'Reinforcement Schedule - Abutment',
    'Bearing and Expansion Joints', 'Drainage Design',
    'Wearing Coat Specification', 'Guard Rail Design',
    'Parapet Wall Design', 'Inspection & Maintenance',
    'Construction Specifications', 'Quality Control',
    'Safety Provisions', 'Environmental Impact',
    'Cost Estimate', 'Schedule of Rates',
    'Design Drawings Index', 'Report Summary',
    'References & Standards', 'Calculations Verification'
  ];
  
  for (const sheetName of additionalSheets) {
    const ws = workbook.addWorksheet(sheetName);
    ws.columns = [{ width: 35 }, { width: 15 }, { width: 15 }];
    
    const header = ws.getCell(1, 1);
    header.value = sheetName.toUpperCase();
    header.font = SUBHEADER_FONT;
    ws.mergeCells('A1:C1');
    
    ws.getCell(3, 1).value = '[Detailed calculations and data to be populated based on specific project requirements]';
    ws.getCell(3, 1).font = { italic: true, color: { argb: 'FF666666' } };
  }
  
  // Set print options for all sheets
  workbook.worksheets.forEach(ws => {
    ws.pageSetup = {
      paperSize: 'A4',
      orientation: 'portrait',
      horizontalCentered: false,
      verticalCentered: false,
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    };
  });
  
  return workbook.xlsx.writeBuffer() as Promise<Buffer>;
}
