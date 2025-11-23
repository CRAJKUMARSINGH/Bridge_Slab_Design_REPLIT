import ExcelJS from 'exceljs';
import { DesignInput, DesignOutput } from './design-engine';

const COLORS = {
  header: { argb: 'FF0066CC' },
  headerFont: { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 },
  subheader: { argb: 'FFE8F0FF' },
  subheaderFont: { bold: true, size: 10 },
  highlight: { argb: 'FFFFFFE0' },
  border: { style: 'thin' as const, color: { argb: 'FF000000' } },
};

const BORDERS = { top: COLORS.border, bottom: COLORS.border, left: COLORS.border, right: COLORS.border };

function styleCell(cell: any, options: { header?: boolean; subheader?: boolean; highlight?: boolean; border?: boolean } = {}) {
  if (options.border) cell.border = BORDERS;
  if (options.header) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: COLORS.header };
    cell.font = COLORS.headerFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  }
  if (options.subheader) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: COLORS.subheader };
    cell.font = COLORS.subheaderFont;
  }
  if (options.highlight) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: COLORS.highlight };
    cell.font = { bold: true };
  }
}

export async function generateExcelReport(
  input: DesignInput,
  design: DesignOutput,
  projectName: string
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // SHEET 1: COVER & PROJECT INFO
  {
    const ws = workbook.addWorksheet('Cover Page');
    ws.columns = [{ width: 20 }, { width: 40 }, { width: 20 }];
    
    let row = 3;
    const titleCell = ws.getCell(row, 1);
    titleCell.value = 'IRC CODE COMPLIANT SUBMERSIBLE BRIDGE AUTO-DESIGN SYSTEM';
    titleCell.font = { bold: true, size: 16 };
    ws.mergeCells(`A${row}:C${row}`);
    titleCell.alignment = { horizontal: 'center', vertical: 'center' };
    
    row += 2;
    ws.getCell(row, 1).value = 'Project Name:';
    ws.getCell(row, 2).value = projectName;
    ws.getCell(row, 1).font = { bold: true };
    row += 1;
    
    ws.getCell(row, 1).value = 'Span:';
    ws.getCell(row, 2).value = `${input.span}m`;
    row += 1;
    
    ws.getCell(row, 1).value = 'Width:';
    ws.getCell(row, 2).value = `${input.width}m`;
    row += 1;
    
    ws.getCell(row, 1).value = 'Discharge:';
    ws.getCell(row, 2).value = `${input.discharge}m³/s`;
    row += 1;
    
    ws.getCell(row, 1).value = 'HFL:';
    ws.getCell(row, 2).value = `${input.floodLevel}m`;
    row += 1;
    
    ws.getCell(row, 1).value = 'fck:';
    ws.getCell(row, 2).value = `M${input.fck}`;
    row += 1;
    
    ws.getCell(row, 1).value = 'fy:';
    ws.getCell(row, 2).value = `Fe${input.fy}`;
    row += 2;
    
    ws.getCell(row, 1).value = 'Standards:';
    ws.getCell(row, 2).value = 'IRC:6-2016, IRC:112-2015, IS:456-2000';
    ws.getCell(row, 1).font = { bold: true };
  }
  
  // SHEET 2: DESIGN INPUT SUMMARY
  {
    const ws = workbook.addWorksheet('Design Input');
    ws.columns = [{ width: 30 }, { width: 15 }, { width: 25 }];
    
    let row = 1;
    const header = ws.getCell(row, 1);
    header.value = 'DESIGN INPUT PARAMETERS';
    styleCell(header, { header: true });
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    const paramHeader = ['Parameter', 'Value', 'Unit/Remarks'];
    paramHeader.forEach((val, i) => {
      const cell = ws.getCell(row, i + 1);
      cell.value = val;
      styleCell(cell, { subheader: true, border: true });
    });
    row += 1;
    
    const params = [
      ['Effective Span (L)', input.span, 'm'],
      ['Clear Width (W)', input.width, 'm'],
      ['Design Discharge', input.discharge, 'm³/s'],
      ['Bed Slope', input.bedSlope, '-'],
      ['Highest Flood Level', input.floodLevel, 'm (absolute)'],
      ['Bed Level', input.bedLevel || input.floodLevel - 5, 'm (absolute)'],
      ['Number of Lanes', input.numberOfLanes, '-'],
      ['Concrete Grade (fck)', input.fck, 'MPa'],
      ['Steel Grade (fy)', input.fy, 'MPa'],
      ['Soil Bearing Capacity', input.soilBearingCapacity, 'kPa'],
      ['Load Class', input.loadClass || 'Class AA', 'IRC:6-2016'],
    ];
    
    params.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      [1, 2, 3].forEach(col => styleCell(ws.getCell(row, col), { border: true }));
      row += 1;
    });
  }
  
  // SHEET 3: HYDRAULIC CALCULATIONS
  {
    const ws = workbook.addWorksheet('Hydraulics');
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    
    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = 'HYDRAULIC DESIGN CALCULATIONS (LACEY\'S METHOD)';
    styleCell(title, { header: true });
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    const headers = ['Parameter', 'Value', 'Unit'];
    headers.forEach((val, i) => {
      styleCell(ws.getCell(row, i + 1), { subheader: true, border: true });
      ws.getCell(row, i + 1).value = val;
    });
    row += 1;
    
    const data = [
      ['Cross-Sectional Area (A)', design.hydraulics.crossSectionalArea, 'm²'],
      ['Flow Velocity (V)', design.hydraulics.velocity, 'm/s'],
      ["Lacey's Silt Factor (m)", design.hydraulics.laceysSiltFactor, '-'],
      ['Afflux (Calculated)', design.hydraulics.afflux, 'm'],
      ['Design Water Level', design.hydraulics.designWaterLevel, 'm (absolute)'],
      ['Contraction Loss', design.hydraulics.contraction, 'm'],
      ['Froude Number', design.hydraulics.froudeNumber, '-'],
      ['Submerged Status', design.hydraulics.afflux < 0.5 ? 'Fully Submerged' : 'Semi-submerged', '-'],
    ];
    
    data.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(3) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'FORMULAS USED:';
    ws.getCell(row, 1).font = { bold: true };
    row += 1;
    
    const formulas = [
      'Velocity (V) = Q / A',
      'Lacey Silt Factor (m) = 1.76 × √(Q/W)',
      'Afflux = V² / (17.9 × √m)',
      'Design Water Level = HFL + Afflux',
      'Froude Number = V / √(g × D)',
    ];
    
    formulas.forEach(formula => {
      ws.getCell(row, 1).value = formula;
      ws.getCell(row, 1).font = { italic: true, size: 9 };
      row += 1;
    });
  }
  
  // SHEET 4: PIER DESIGN
  {
    const ws = workbook.addWorksheet('Pier Design');
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    
    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = 'PIER STRUCTURAL DESIGN';
    styleCell(title, { header: true });
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    // Geometry section
    ws.getCell(row, 1).value = 'PIER GEOMETRY:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const pierGeom = [
      ['Number of Piers', design.pier.numberOfPiers, '-'],
      ['Pier Width (B)', design.pier.width, 'm'],
      ['Pier Length (D)', design.pier.length, 'm'],
      ['Pier Spacing', design.pier.spacing, 'm'],
      ['Pier Depth', design.pier.depth, 'm'],
      ['Base Width', design.pier.baseWidth, 'm'],
      ['Base Length', design.pier.baseLength, 'm'],
      ['Pier Concrete Volume', design.pier.pierConcrete, 'm³'],
      ['Base Concrete Volume', design.pier.baseConcrete, 'm³'],
    ];
    
    pierGeom.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(3) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'HYDRAULIC FORCES:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const forces = [
      ['Hydrostatic Force', design.pier.hydrostaticForce, 'kN'],
      ['Drag Force (Cd=1.2)', design.pier.dragForce, 'kN'],
      ['Total Horizontal Force', design.pier.totalHorizontalForce, 'kN'],
    ];
    
    forces.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(2) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'STABILITY CHECKS (Min FOS: 1.5, 1.8, 2.5):';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const stability = [
      ['Sliding FOS', design.pier.slidingFOS, '-', design.pier.slidingFOS >= 1.5 ? '✓ SAFE' : '✗ UNSAFE'],
      ['Overturning FOS', design.pier.overturningFOS, '-', design.pier.overturningFOS >= 1.8 ? '✓ SAFE' : '✗ UNSAFE'],
      ['Bearing Capacity FOS', design.pier.bearingFOS, '-', design.pier.bearingFOS >= 2.5 ? '✓ SAFE' : '✗ UNSAFE'],
    ];
    
    stability.forEach(([label, val, unit, status]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(2) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 4).value = status;
      ws.getCell(row, 4).font = { bold: true, color: { argb: status.includes('SAFE') ? 'FF00AA00' : 'FFAA0000' } };
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      ws.getCell(row, 4).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'REINFORCEMENT:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const reinf = [
      ['Main Steel Diameter', design.pier.mainSteel.diameter, 'mm'],
      ['Main Steel Spacing', design.pier.mainSteel.spacing, 'mm'],
      ['Main Steel Quantity', design.pier.mainSteel.quantity, 'nos'],
      ['Link Steel Diameter', design.pier.linkSteel.diameter, 'mm'],
      ['Link Steel Spacing', design.pier.linkSteel.spacing, 'mm'],
      ['Link Steel Quantity', design.pier.linkSteel.quantity, 'nos'],
    ];
    
    reinf.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val : val;
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 2).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
  }
  
  // SHEET 5: ABUTMENT DESIGN
  {
    const ws = workbook.addWorksheet('Abutment Design');
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    
    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = 'ABUTMENT STRUCTURAL DESIGN';
    styleCell(title, { header: true });
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    ws.getCell(row, 1).value = 'ABUTMENT GEOMETRY:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const abGeom = [
      ['Abutment Height', design.abutment.height, 'm'],
      ['Abutment Width', design.abutment.width, 'm'],
      ['Abutment Depth', design.abutment.depth, 'm'],
      ['Base Width', design.abutment.baseWidth, 'm'],
      ['Base Length', design.abutment.baseLength, 'm'],
      ['Wing Wall Height', design.abutment.wingWallHeight, 'm'],
      ['Wing Wall Thickness', design.abutment.wingWallThickness, 'm'],
    ];
    
    abGeom.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(3) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'CONCRETE VOLUMES (per abutment):';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const abConcrete = [
      ['Abutment Concrete', design.abutment.abutmentConcrete, 'm³'],
      ['Base Concrete', design.abutment.baseConcrete, 'm³'],
      ['Wing Wall Concrete', design.abutment.wingWallConcrete, 'm³'],
      ['Subtotal (per abutment)', design.abutment.abutmentConcrete + design.abutment.baseConcrete + design.abutment.wingWallConcrete, 'm³'],
    ];
    
    abConcrete.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(2) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'STABILITY CHECKS (Min FOS: 1.5, 2.0, 2.5):';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const abStability = [
      ['Active Earth Pressure', design.abutment.activeEarthPressure, 'kN', '-'],
      ['Vertical Load', design.abutment.verticalLoad, 'kN', '-'],
      ['Sliding FOS', design.abutment.slidingFOS, '-', design.abutment.slidingFOS >= 1.5 ? '✓ SAFE' : '✗ UNSAFE'],
      ['Overturning FOS', design.abutment.overturningFOS, '-', design.abutment.overturningFOS >= 2.0 ? '✓ SAFE' : '✗ UNSAFE'],
      ['Bearing Capacity FOS', design.abutment.bearingFOS, '-', design.abutment.bearingFOS >= 2.5 ? '✓ SAFE' : '✗ UNSAFE'],
    ];
    
    abStability.forEach(([label, val, unit, status]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(3) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      if (status) {
        ws.getCell(row, 4).value = status;
        ws.getCell(row, 4).font = { bold: true, color: { argb: status.includes('SAFE') ? 'FF00AA00' : 'FFAA0000' } };
        ws.getCell(row, 4).border = BORDERS;
      }
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
  }
  
  // SHEET 6: SLAB DESIGN & LOADS
  {
    const ws = workbook.addWorksheet('Slab Design');
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    
    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = 'SLAB STRUCTURAL DESIGN (IRC:112-2015)';
    styleCell(title, { header: true });
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    ws.getCell(row, 1).value = 'SLAB PROPERTIES:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const slabProp = [
      ['Slab Thickness', design.slab.thickness, 'mm'],
      ['Wearing Coat Thickness', design.slab.wearingCoat, 'm'],
    ];
    
    slabProp.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(3) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'LOAD CALCULATIONS:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const loads = [
      ['Dead Load (DL)', design.slab.deadLoad, 'kN/m²'],
      ['Live Load (LL)', design.slab.liveLoad, 'kN/m²'],
      ['Impact Factor', design.slab.impactFactor, '-'],
      ['Design Load (1.5DL+2.0LL×IF)', design.slab.designLoad, 'kN/m²'],
    ];
    
    loads.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(3) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'BENDING MOMENTS (Pigeaud\'s Method):';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const moments = [
      ['Longitudinal Moment (Mx)', design.slab.longitudinalMoment, 'kN.m/m'],
      ['Transverse Moment (My)', design.slab.transverseMoment, 'kN.m/m'],
      ['Shear Force (V)', design.slab.shearForce, 'kN/m'],
    ];
    
    moments.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(2) : val;
      styleCell(valCell, { highlight: true, border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'REINFORCEMENT DESIGN:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const slabReinf = [
      ['Main Steel Diameter', design.slab.mainSteel.diameter, 'mm'],
      ['Main Steel Spacing', design.slab.mainSteel.spacing, 'mm'],
      ['Required Area', design.slab.mainSteel.requiredArea, 'mm²/m'],
      ['Provided Area', design.slab.mainSteel.area, 'mm²/m'],
      ['Main Steel Quantity', design.slab.mainSteel.quantity, 'nos'],
      ['Distribution Steel Diameter', design.slab.distributionSteel.diameter, 'mm'],
      ['Distribution Steel Spacing', design.slab.distributionSteel.spacing, 'mm'],
      ['Distribution Steel Area', design.slab.distributionSteel.area, 'mm²/m'],
      ['Distribution Steel Quantity', design.slab.distributionSteel.quantity, 'nos'],
    ];
    
    slabReinf.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' && val ? val.toFixed(val > 100 ? 0 : 3) : val || 'N/A';
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 2).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
  }
  
  // SHEET 7: QUANTITIES & COST
  {
    const ws = workbook.addWorksheet('Quantities');
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    
    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = 'MATERIAL QUANTITY ESTIMATE';
    styleCell(title, { header: true });
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;
    
    ws.getCell(row, 1).value = 'CONCRETE QUANTITIES:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const concrete = [
      ['Slab Concrete', design.quantities.slabConcrete, 'm³'],
      ['Pier Concrete', design.quantities.pierConcrete, 'm³'],
      ['Abutment Concrete (2 nos)', design.quantities.abutmentConcrete, 'm³'],
      ['TOTAL CONCRETE', design.quantities.totalConcrete, 'm³'],
    ];
    
    concrete.forEach(([label, val, unit], idx) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(2) : val;
      if (idx === concrete.length - 1) styleCell(valCell, { highlight: true, border: true });
      else styleCell(valCell, { border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'STEEL QUANTITIES:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const steel = [
      ['Slab Steel', design.quantities.slabSteel, 'tonnes'],
      ['Pier Steel', design.quantities.pierSteel, 'tonnes'],
      ['Abutment Steel (2 nos)', design.quantities.abutmentSteel, 'tonnes'],
      ['TOTAL STEEL', design.quantities.totalSteel, 'tonnes'],
    ];
    
    steel.forEach(([label, val, unit], idx) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' && val ? val.toFixed(2) : val || 0;
      if (idx === steel.length - 1) styleCell(valCell, { highlight: true, border: true });
      else styleCell(valCell, { border: true });
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
    
    row += 2;
    ws.getCell(row, 1).value = 'OTHER ITEMS:';
    styleCell(ws.getCell(row, 1), { subheader: true });
    row += 1;
    
    const others = [
      ['Formwork Required', design.quantities.formwork, 'm²'],
    ];
    
    others.forEach(([label, val, unit]) => {
      ws.getCell(row, 1).value = label;
      const valCell = ws.getCell(row, 2);
      valCell.value = typeof val === 'number' ? val.toFixed(2) : val;
      ws.getCell(row, 3).value = unit;
      ws.getCell(row, 1).border = BORDERS;
      ws.getCell(row, 2).border = BORDERS;
      ws.getCell(row, 3).border = BORDERS;
      row += 1;
    });
  }
  
  // Add print settings for all sheets
  workbook.worksheets.forEach(ws => {
    ws.pageSetup = { paperSize: 9, orientation: 'portrait' }; // A4
    ws.margins = { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75 };
  });
  
  return workbook.xlsx.writeBuffer() as Promise<Buffer>;
}
