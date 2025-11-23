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

function styleData(cell: any) {
  cell.border = BORDERS;
  cell.alignment = { horizontal: "left", vertical: "middle" };
}

export async function generateExcelReport(input: DesignInput, design: DesignOutput, projectName: string): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // SHEET 1: COVER
  {
    const ws = workbook.addWorksheet("Cover");
    ws.columns = [{ width: 25 }, { width: 50 }];
    let row = 2;
    
    const title = ws.getCell(row, 1);
    title.value = "BRIDGE DESIGN REPORT";
    title.font = { bold: true, size: 14 };
    ws.mergeCells(`A${row}:B${row}`);
    row += 2;
    
    ws.getCell(row, 1).value = "Project:";
    ws.getCell(row, 2).value = projectName;
    ws.getCell(row, 1).font = { bold: true };
    row += 1;
    
    ws.getCell(row, 1).value = "Standards:";
    ws.getCell(row, 2).value = "IRC:6-2016, IRC:112-2015, IS:456-2000";
  }

  // SHEET 2: INPUT
  {
    const ws = workbook.addWorksheet("Input Parameters");
    ws.columns = [{ width: 35 }, { width: 20 }, { width: 20 }];
    let row = 1;
    
    const headers = ["Parameter", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    ws.getCell(row, 1).value = "Parameter";
    ws.getCell(row, 2).value = "Value";
    ws.getCell(row, 3).value = "Unit";
    row += 1;

    const params = [
      ["Discharge", input.discharge.toFixed(2), "m³/s"],
      ["HFL", input.floodLevel.toFixed(2), "m"],
      ["Bed Level", (input.bedLevel || 96.47).toFixed(2), "m"],
      ["Bed Slope", input.bedSlope.toFixed(6), "-"],
      ["Span", input.span.toFixed(2), "m"],
      ["Width", input.width.toFixed(2), "m"],
      ["Bearing Capacity", input.soilBearingCapacity.toFixed(0), "kPa"],
      ["fck", input.fck, "MPa"],
      ["fy", input.fy, "MPa"],
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
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    let row = 1;

    const headers = ["Parameter", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    ws.getCell(row, 1).value = "Parameter";
    ws.getCell(row, 2).value = "Value";
    ws.getCell(row, 3).value = "Unit";
    row += 1;

    const data = [
      ["Velocity", design.hydraulics.velocity.toFixed(3), "m/s"],
      ["Afflux", design.hydraulics.afflux.toFixed(3), "m"],
      ["Design WL", design.hydraulics.designWaterLevel.toFixed(2), "m"],
      ["Lacey Factor", design.hydraulics.laceysSiltFactor.toFixed(3), "-"],
      ["Froude Number", design.hydraulics.froudeNumber.toFixed(3), "-"],
      ["Cross-Section", design.hydraulics.crossSectionalArea.toFixed(2), "m²"],
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

  // SHEET 4: PIER
  {
    const ws = workbook.addWorksheet("Pier Design");
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    let row = 1;

    const headers = ["Property", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    row += 1;

    const data = [
      ["Width", design.pier.width.toFixed(2), "m"],
      ["Length", design.pier.length.toFixed(2), "m"],
      ["Number", design.pier.numberOfPiers, "nos"],
      ["Spacing", design.pier.spacing.toFixed(2), "m"],
      ["Depth", design.pier.depth.toFixed(2), "m"],
      ["Hydrostatic Force", design.pier.hydrostaticForce.toFixed(1), "kN"],
      ["Drag Force", design.pier.dragForce.toFixed(1), "kN"],
      ["Sliding FOS", design.pier.slidingFOS.toFixed(2), design.pier.slidingFOS >= 1.5 ? "SAFE" : "UNSAFE"],
      ["Overturning FOS", design.pier.overturningFOS.toFixed(2), design.pier.overturningFOS >= 1.8 ? "SAFE" : "UNSAFE"],
      ["Bearing FOS", design.pier.bearingFOS.toFixed(2), design.pier.bearingFOS >= 2.5 ? "SAFE" : "UNSAFE"],
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

  // SHEET 5: ABUTMENT
  {
    const ws = workbook.addWorksheet("Abutment Design");
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    let row = 1;

    const headers = ["Property", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    row += 1;

    const data = [
      ["Height", design.abutment.height.toFixed(2), "m"],
      ["Width", design.abutment.width.toFixed(2), "m"],
      ["Base Width", design.abutment.baseWidth.toFixed(2), "m"],
      ["Active Earth Pressure", design.abutment.activeEarthPressure.toFixed(1), "kN"],
      ["Vertical Load", design.abutment.verticalLoad.toFixed(1), "kN"],
      ["Sliding FOS", design.abutment.slidingFOS.toFixed(2), design.abutment.slidingFOS >= 1.5 ? "SAFE" : "UNSAFE"],
      ["Overturning FOS", design.abutment.overturningFOS.toFixed(2), design.abutment.overturningFOS >= 2.0 ? "SAFE" : "UNSAFE"],
      ["Bearing FOS", design.abutment.bearingFOS.toFixed(2), design.abutment.bearingFOS >= 2.5 ? "SAFE" : "UNSAFE"],
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

  // SHEET 6: SLAB
  {
    const ws = workbook.addWorksheet("Slab Design");
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    let row = 1;

    const headers = ["Property", "Value", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    row += 1;

    const data = [
      ["Thickness", (design.slab.thickness ?? 0).toFixed(0), "mm"],
      ["Wearing Coat", (design.slab.wearingCoat ?? 0).toFixed(2), "m"],
      ["Design Load", (design.slab.designLoad ?? 0).toFixed(2), "kN/m²"],
      ["Longitudinal Moment", (design.slab.longitudinalMoment ?? 0).toFixed(1), "kN.m/m"],
      ["Transverse Moment", (design.slab.transverseMoment ?? 0).toFixed(1), "kN.m/m"],
      ["Shear Force", (design.slab.shearForce ?? 0).toFixed(1), "kN/m"],
      ["Distribution Steel Area", (design.slab.distributionSteel?.area ?? 0).toFixed(0), "mm²/m"],
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

  // SHEET 7: QUANTITIES
  {
    const ws = workbook.addWorksheet("Quantities");
    ws.columns = [{ width: 40 }, { width: 20 }, { width: 20 }];
    let row = 1;

    const headers = ["Item", "Quantity", "Unit"];
    headers.forEach((h, i) => styleHeader(ws.getCell(row, i + 1)));
    row += 1;

    const data = [
      ["Concrete (Total)", (design.quantities.totalConcrete ?? 0).toFixed(2), "m³"],
      ["Slab Concrete", (design.quantities.slabConcrete ?? 0).toFixed(2), "m³"],
      ["Pier Concrete", (design.quantities.pierConcrete ?? 0).toFixed(2), "m³"],
      ["Abutment Concrete", (design.quantities.abutmentConcrete ?? 0).toFixed(2), "m³"],
      ["Steel (Total)", (design.quantities.totalSteel ?? 0).toFixed(2), "tonnes"],
      ["Slab Steel", (design.quantities.slabSteel ?? 0).toFixed(2), "tonnes"],
      ["Pier Steel", (design.quantities.pierSteel ?? 0).toFixed(2), "tonnes"],
      ["Abutment Steel", (design.quantities.abutmentSteel ?? 0).toFixed(2), "tonnes"],
      ["Formwork", (design.quantities.formwork ?? 0).toFixed(2), "m²"],
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

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
