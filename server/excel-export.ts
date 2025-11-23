import ExcelJS from "exceljs";
import { DesignInput, DesignOutput } from "./design-engine";

const COLORS = {
  header: { argb: "FF0066CC" },
  headerFont: { color: { argb: "FFFFFFFF" }, bold: true, size: 11 },
  subheader: { argb: "FFE8F0FF" },
  border: { style: "thin" as const, color: { argb: "FF000000" } },
};

const BORDERS = { top: COLORS.border, bottom: COLORS.border, left: COLORS.border, right: COLORS.border };

function styleHeader(cell: any) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: COLORS.header };
  cell.font = COLORS.headerFont;
  cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  cell.border = BORDERS;
}

function styleSubheader(cell: any) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: COLORS.subheader };
  cell.font = { bold: true, size: 10 };
  cell.alignment = { horizontal: "left", vertical: "middle" };
  cell.border = BORDERS;
}

function styleData(cell: any) {
  cell.border = BORDERS;
  cell.alignment = { horizontal: "left", vertical: "middle" };
}

export async function generateExcelReport(input: DesignInput, design: DesignOutput, projectName: string): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // SHEET 1: COVER PAGE
  {
    const ws = workbook.addWorksheet("INDEX");
    ws.pageSetup = { paperSize: 9, orientation: "portrait" };
    ws.columns = [{ width: 25 }, { width: 50 }, { width: 20 }];

    let row = 2;
    const title = ws.getCell(row, 1);
    title.value = "DESIGN OF SUBMERSIBLE SLAB BRIDGE";
    title.font = { bold: true, size: 14 };
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;

    ws.getCell(row, 1).value = "Project:";
    ws.getCell(row, 2).value = projectName;
    ws.getCell(row, 1).font = { bold: true };
    row += 1;

    ws.getCell(row, 1).value = "Location:";
    ws.getCell(row, 2).value = "As per Design Brief";
    row += 2;

    ws.getCell(row, 1).value = "S.No.";
    ws.getCell(row, 2).value = "Particulars";
    ws.getCell(row, 3).value = "Sheet No.";
    [1, 2, 3].forEach((col) => styleHeader(ws.getCell(row, col)));
    row += 1;

    const contents = [
      ["1", "Hydraulic Calculations", "2-3"],
      ["2", "Stability Checks - Pier", "4-5"],
      ["3", "Pier Design", "6"],
      ["4", "Stability Checks - Abutment", "7-8"],
      ["5", "Abutment Design", "9"],
      ["6", "Slab Design", "10"],
      ["7", "Reinforcement Schedules", "11"],
      ["8", "Quantities & Cost Estimate", "12"],
    ];

    contents.forEach(([num, desc, sheet]) => {
      ws.getCell(row, 1).value = num;
      ws.getCell(row, 2).value = desc;
      ws.getCell(row, 3).value = sheet;
      [1, 2, 3].forEach((col) => styleData(ws.getCell(row, col)));
      row += 1;
    });
  }

  // SHEET 2: DESIGN INPUT
  {
    const ws = workbook.addWorksheet("Design Input");
    ws.pageSetup = { paperSize: 9, orientation: "portrait" };
    ws.columns = [{ width: 35 }, { width: 20 }, { width: 20 }];

    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = "DESIGN INPUT PARAMETERS";
    title.font = { bold: true, size: 12 };
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;

    const headers = ["Parameter", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    ws.getCell(row, 1).value = "Parameter";
    ws.getCell(row, 2).value = "Value";
    ws.getCell(row, 3).value = "Unit";
    row += 1;

    const params = [
      ["Discharge (Q)", input.discharge.toFixed(2), "m³/s"],
      ["Highest Flood Level (HFL)", input.floodLevel.toFixed(2), "m (abs)"],
      ["Bed Level", (input.bedLevel || 96.47).toFixed(2), "m (abs)"],
      ["Bed Slope", input.bedSlope.toFixed(6), "-"],
      ["Effective Span (L)", input.span.toFixed(2), "m"],
      ["Deck Width (W)", input.width.toFixed(2), "m"],
      ["Safe Bearing Capacity", input.soilBearingCapacity.toFixed(0), "kPa"],
      ["Concrete Grade (fck)", input.fck, "MPa"],
      ["Steel Grade (fy)", input.fy, "MPa"],
      ["Load Class", input.loadClass || "Class AA", "-"],
    ];

    params.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });
  }

  // SHEET 3: HYDRAULICS
  {
    const ws = workbook.addWorksheet("Hydraulics");
    ws.pageSetup = { paperSize: 9, orientation: "portrait" };
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];

    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = "DETERMINATION OF DESIGN PARAMETERS - LACEY'S THEORY";
    title.font = { bold: true, size: 11 };
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;

    const headers = ["Parameter", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    ws.getCell(row, 1).value = "Parameter";
    ws.getCell(row, 2).value = "Value";
    ws.getCell(row, 3).value = "Unit";
    row += 1;

    const data = [
      ["Cross-Sectional Area", design.hydraulics.crossSectionalArea.toFixed(2), "m²"],
      ["Flow Velocity", design.hydraulics.velocity.toFixed(3), "m/s"],
      ["Lacey Silt Factor (m)", design.hydraulics.laceysSiltFactor.toFixed(3), "-"],
      ["Afflux (h)", design.hydraulics.afflux.toFixed(3), "m"],
      ["Design Water Level", design.hydraulics.designWaterLevel.toFixed(2), "m (abs)"],
      ["Contraction Loss", design.hydraulics.contraction.toFixed(3), "m"],
      ["Froude Number", design.hydraulics.froudeNumber.toFixed(3), "-"],
    ];

    data.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });
  }

  // SHEET 4: PIER DESIGN
  {
    const ws = workbook.addWorksheet("Pier Design");
    ws.pageSetup = { paperSize: 9, orientation: "landscape" };
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];

    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = "DESIGN OF PIER";
    title.font = { bold: true, size: 12 };
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;

    // Geometry
    ws.getCell(row, 1).value = "PIER GEOMETRY:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const pierGeom = [
      ["Number of Piers", design.pier.numberOfPiers, "nos"],
      ["Pier Width (B)", design.pier.width.toFixed(2), "m"],
      ["Pier Length (D)", design.pier.length.toFixed(2), "m"],
      ["Pier Spacing", design.pier.spacing.toFixed(2), "m"],
      ["Pier Depth", design.pier.depth.toFixed(2), "m"],
      ["Base Width", design.pier.baseWidth.toFixed(2), "m"],
      ["Base Length", design.pier.baseLength.toFixed(2), "m"],
    ];

    pierGeom.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });

    row += 1;
    ws.getCell(row, 1).value = "FORCES:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const forces = [
      ["Hydrostatic Force", design.pier.hydrostaticForce.toFixed(1), "kN"],
      ["Drag Force", design.pier.dragForce.toFixed(1), "kN"],
      ["Total Horizontal Force", design.pier.totalHorizontalForce.toFixed(1), "kN"],
    ];

    forces.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });

    row += 1;
    ws.getCell(row, 1).value = "STABILITY CHECKS (Min FOS: 1.5 / 1.8 / 2.5):";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const stability = [
      ["Sliding FOS", design.pier.slidingFOS.toFixed(2), design.pier.slidingFOS >= 1.5 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Overturning FOS", design.pier.overturningFOS.toFixed(2), design.pier.overturningFOS >= 1.8 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Bearing Capacity FOS", design.pier.bearingFOS.toFixed(2), design.pier.bearingFOS >= 2.5 ? "✓ SAFE" : "✗ UNSAFE"],
    ];

    stability.forEach(([label, val, status]) => {
      styleData(ws.getCell(row, 1));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = status;
      ws.getCell(row, 3).font = { bold: true, color: { argb: status.includes("SAFE") ? "FF00AA00" : "FFAA0000" } };
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      row += 1;
    });
  }

  // SHEET 5: ABUTMENT DESIGN
  {
    const ws = workbook.addWorksheet("Abutment Design");
    ws.pageSetup = { paperSize: 9, orientation: "landscape" };
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];

    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = "DESIGN OF ABUTMENT";
    title.font = { bold: true, size: 12 };
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;

    ws.getCell(row, 1).value = "ABUTMENT GEOMETRY:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const abGeom = [
      ["Abutment Height", design.abutment.height.toFixed(2), "m"],
      ["Abutment Width", design.abutment.width.toFixed(2), "m"],
      ["Abutment Depth", design.abutment.depth.toFixed(2), "m"],
      ["Base Width", design.abutment.baseWidth.toFixed(2), "m"],
      ["Wing Wall Height", design.abutment.wingWallHeight.toFixed(2), "m"],
    ];

    abGeom.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });

    row += 1;
    ws.getCell(row, 1).value = "FORCES:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const abForces = [
      ["Active Earth Pressure", design.abutment.activeEarthPressure.toFixed(1), "kN"],
      ["Vertical Load", design.abutment.verticalLoad.toFixed(1), "kN"],
    ];

    abForces.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });

    row += 1;
    ws.getCell(row, 1).value = "STABILITY CHECKS:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const abStability = [
      ["Sliding FOS", design.abutment.slidingFOS.toFixed(2), design.abutment.slidingFOS >= 1.5 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Overturning FOS", design.abutment.overturningFOS.toFixed(2), design.abutment.overturningFOS >= 2.0 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Bearing Capacity FOS", design.abutment.bearingFOS.toFixed(2), design.abutment.bearingFOS >= 2.5 ? "✓ SAFE" : "✗ UNSAFE"],
    ];

    abStability.forEach(([label, val, status]) => {
      styleData(ws.getCell(row, 1));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = status;
      ws.getCell(row, 3).font = { bold: true, color: { argb: status.includes("SAFE") ? "FF00AA00" : "FFAA0000" } };
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      row += 1;
    });
  }

  // SHEET 6: SLAB DESIGN
  {
    const ws = workbook.addWorksheet("Slab Design");
    ws.pageSetup = { paperSize: 9, orientation: "portrait" };
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];

    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = "DESIGN OF SLAB (PIGEAUD'S METHOD)";
    title.font = { bold: true, size: 12 };
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;

    const headers = ["Parameter", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    ws.getCell(row, 1).value = "Parameter";
    ws.getCell(row, 2).value = "Value";
    ws.getCell(row, 3).value = "Unit";
    row += 1;

    const slabData = [
      ["Slab Thickness", design.slab.thickness.toFixed(0), "mm"],
      ["Wearing Coat", design.slab.wearingCoat.toFixed(2), "m"],
      ["Design Load (1.5DL + 2.0LL × IF)", design.slab.designLoad.toFixed(2), "kN/m²"],
      ["Longitudinal Moment (Mx)", design.slab.longitudinalMoment.toFixed(1), "kN.m/m"],
      ["Transverse Moment (My)", design.slab.transverseMoment.toFixed(1), "kN.m/m"],
      ["Shear Force", design.slab.shearForce.toFixed(1), "kN/m"],
      ["Main Steel Area Required", design.slab.mainSteel.requiredArea ? design.slab.mainSteel.requiredArea.toFixed(0) : "TBD", "mm²/m"],
      ["Main Steel Area Provided", design.slab.mainSteel.area ? design.slab.mainSteel.area.toFixed(0) : "TBD", "mm²/m"],
      ["Distribution Steel Area", design.slab.distributionSteel.area.toFixed(0), "mm²/m"],
    ];

    slabData.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });
  }

  // SHEET 7: REINFORCEMENT
  {
    const ws = workbook.addWorksheet("Reinforcement");
    ws.pageSetup = { paperSize: 9, orientation: "landscape" };
    ws.columns = [{ width: 30 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }];

    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = "REINFORCEMENT SCHEDULES";
    title.font = { bold: true, size: 12 };
    ws.mergeCells(`A${row}:E${row}`);
    row += 2;

    // Slab reinforcement
    ws.getCell(row, 1).value = "SLAB REINFORCEMENT:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const slabHeaders = ["Member", "Bar Diameter", "Spacing", "Area", "Qty"];
    slabHeaders.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    row += 1;

    const slabReinf = [
      ["Main Steel (Bottom)", `Ø${design.slab.mainSteel.diameter}`, design.slab.mainSteel.spacing ? `${design.slab.mainSteel.spacing}mm c/c` : "TBD", design.slab.mainSteel.area ? `${design.slab.mainSteel.area.toFixed(0)} mm²/m` : "TBD", design.slab.mainSteel.quantity || "TBD"],
      ["Distribution Steel", `Ø${design.slab.distributionSteel.diameter}`, `${design.slab.distributionSteel.spacing}mm c/c`, `${design.slab.distributionSteel.area.toFixed(0)} mm²/m`, `${design.slab.distributionSteel.quantity}`],
    ];

    slabReinf.forEach(([member, diam, spacing, area, qty]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      styleData(ws.getCell(row, 4));
      styleData(ws.getCell(row, 5));
      ws.getCell(row, 1).value = member;
      ws.getCell(row, 2).value = diam;
      ws.getCell(row, 3).value = spacing;
      ws.getCell(row, 4).value = area;
      ws.getCell(row, 5).value = qty;
      row += 1;
    });

    row += 2;
    ws.getCell(row, 1).value = "PIER REINFORCEMENT:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const pierHeaders = ["Member", "Bar Diameter", "Spacing", "Qty", "Total Length"];
    pierHeaders.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    row += 1;

    const pierReinf = [
      ["Main Steel", `Ø${design.pier.mainSteel.diameter}mm`, `${design.pier.mainSteel.spacing}mm c/c`, design.pier.mainSteel.quantity, "-"],
      ["Link Steel", `Ø${design.pier.linkSteel.diameter}mm`, `${design.pier.linkSteel.spacing}mm c/c`, design.pier.linkSteel.quantity, "-"],
    ];

    pierReinf.forEach(([member, diam, spacing, qty, length]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      styleData(ws.getCell(row, 4));
      styleData(ws.getCell(row, 5));
      ws.getCell(row, 1).value = member;
      ws.getCell(row, 2).value = diam;
      ws.getCell(row, 3).value = spacing;
      ws.getCell(row, 4).value = qty;
      ws.getCell(row, 5).value = length;
      row += 1;
    });
  }

  // SHEET 8: QUANTITIES
  {
    const ws = workbook.addWorksheet("Quantities");
    ws.pageSetup = { paperSize: 9, orientation: "portrait" };
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];

    let row = 1;
    const title = ws.getCell(row, 1);
    title.value = "MATERIAL QUANTITIES";
    title.font = { bold: true, size: 12 };
    ws.mergeCells(`A${row}:C${row}`);
    row += 2;

    ws.getCell(row, 1).value = "CONCRETE:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const concrete = [
      ["Slab Concrete", design.quantities.slabConcrete.toFixed(2), "m³"],
      ["Pier Concrete", design.quantities.pierConcrete.toFixed(2), "m³"],
      ["Abutment Concrete (2 nos)", design.quantities.abutmentConcrete.toFixed(2), "m³"],
      ["TOTAL CONCRETE", design.quantities.totalConcrete.toFixed(2), "m³"],
    ];

    concrete.forEach(([label, val, unit], idx) => {
      const isBold = idx === concrete.length - 1;
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      if (isBold) {
        ws.getCell(row, 1).font = { bold: true };
        ws.getCell(row, 2).font = { bold: true };
      }
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });

    row += 1;
    ws.getCell(row, 1).value = "STEEL:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const steel = [
      ["Slab Steel", design.quantities.slabSteel.toFixed(2), "tonnes"],
      ["Pier Steel", design.quantities.pierSteel.toFixed(2), "tonnes"],
      ["Abutment Steel (2 nos)", design.quantities.abutmentSteel.toFixed(2), "tonnes"],
      ["TOTAL STEEL", design.quantities.totalSteel.toFixed(2), "tonnes"],
    ];

    steel.forEach(([label, val, unit], idx) => {
      const isBold = idx === steel.length - 1;
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      if (isBold) {
        ws.getCell(row, 1).font = { bold: true };
        ws.getCell(row, 2).font = { bold: true };
      }
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });

    row += 1;
    ws.getCell(row, 1).value = "OTHER:";
    styleSubheader(ws.getCell(row, 1));
    row += 1;

    const other = [["Formwork Area", design.quantities.formwork.toFixed(2), "m²"]];

    other.forEach(([label, val, unit]) => {
      styleData(ws.getCell(row, 1));
      styleData(ws.getCell(row, 2));
      styleData(ws.getCell(row, 3));
      ws.getCell(row, 1).value = label;
      ws.getCell(row, 2).value = val;
      ws.getCell(row, 3).value = unit;
      row += 1;
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
