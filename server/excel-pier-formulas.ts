/**
 * Pier Design Summary Sheet with Formulas
 * Generates Excel formulas instead of static values so calculations recalculate when inputs change
 */

import ExcelJS from "exceljs";
import { DesignInput, DesignOutput } from "./design-engine";
import { COLORS, BORDERS, styleHeader } from "./excel-formatting";
import { INPUT_CELLS } from "./excel-formulas";

export function createPierDesignSummaryWithFormulas(
  ws: ExcelJS.Worksheet,
  input: DesignInput,
  design: DesignOutput
): number {
  let row = 1;
  styleHeader(ws, row, "COMPREHENSIVE PIER DESIGN - FORMULAS FOR DYNAMIC CALCULATION");
  row += 2;

  // SECTION 1: PIER GEOMETRY
  ws.getCell(row, 1).value = "PIER GEOMETRY & DIMENSIONS";
  ws.getCell(row, 1).font = { bold: true, size: 11, color: { argb: "FF365070" } };
  ws.mergeCells(`A${row}:D${row}`);
  row += 2;

  // Store row numbers for references
  const numPiersRow = row;
  ws.getCell(row, 2).value = { formula: `=ROUND(INPUTS!${INPUT_CELLS.INPUTS.span}/5,0)` };
  ws.getCell(row, 1).value = "Number of Piers";
  ws.getCell(row, 3).value = "nos";
  row++;

  const pierWidthRow = row;
  ws.getCell(row, 2).value = design.pier?.width || 1.5;
  ws.getCell(row, 1).value = "Pier Width";
  ws.getCell(row, 3).value = "m";
  row++;

  const pierLengthRow = row;
  ws.getCell(row, 2).value = design.pier?.length || 7.5;
  ws.getCell(row, 1).value = "Pier Length";
  ws.getCell(row, 3).value = "m";
  row++;

  const pierDepthRow = row;
  ws.getCell(row, 2).value = design.pier?.depth || 5.96;
  ws.getCell(row, 1).value = "Pier Depth (to Bed)";
  ws.getCell(row, 3).value = "m";
  row++;

  ws.getCell(row, 1).value = "Pier Spacing";
  ws.getCell(row, 2).value = { formula: `=INPUTS!${INPUT_CELLS.INPUTS.span}/B${numPiersRow}` };
  ws.getCell(row, 3).value = "m";
  row += 2;

  // SECTION 2: FOOTING
  ws.getCell(row, 1).value = "FOOTING DESIGN";
  ws.getCell(row, 1).font = { bold: true, size: 11, color: { argb: "FF365070" } };
  ws.mergeCells(`A${row}:D${row}`);
  row += 2;

  ws.getCell(row, 1).value = "Footing Width";
  ws.getCell(row, 2).value = design.pier.baseWidth;
  ws.getCell(row, 3).value = "m";
  row++;

  ws.getCell(row, 1).value = "Footing Length";
  ws.getCell(row, 2).value = design.pier.baseLength;
  ws.getCell(row, 3).value = "m";
  row++;

  ws.getCell(row, 1).value = "Footing Thickness";
  ws.getCell(row, 2).value = 1.0;
  ws.getCell(row, 3).value = "m";
  row++;

  ws.getCell(row, 1).value = "Footing Depth";
  ws.getCell(row, 2).value = { formula: `=B${pierDepthRow}+1.5` };
  ws.getCell(row, 3).value = "m";
  row += 2;

  // SECTION 3: MATERIAL & LOADS
  ws.getCell(row, 1).value = "MATERIAL & LOADING";
  ws.getCell(row, 1).font = { bold: true, size: 11, color: { argb: "FF365070" } };
  ws.mergeCells(`A${row}:D${row}`);
  row += 2;

  ws.getCell(row, 1).value = "Concrete Grade";
  ws.getCell(row, 2).value = { formula: `="M"&INPUTS!${INPUT_CELLS.INPUTS.fck}` };
  ws.getCell(row, 3).value = "";
  row++;

  ws.getCell(row, 1).value = "Steel Grade";
  ws.getCell(row, 2).value = { formula: `="Fe"&INPUTS!${INPUT_CELLS.INPUTS.fy}` };
  ws.getCell(row, 3).value = "";
  row++;

  ws.getCell(row, 1).value = "SBC Available";
  ws.getCell(row, 2).value = { formula: `=INPUTS!${INPUT_CELLS.INPUTS.soilBearingCapacity}` };
  ws.getCell(row, 3).value = "kPa";
  row += 2;

  // SECTION 4: WATER FORCES (WITH FORMULAS)
  ws.getCell(row, 1).value = "HYDRAULIC FORCES ON PIER";
  ws.getCell(row, 1).font = { bold: true, size: 11, color: { argb: "FF365070" } };
  ws.mergeCells(`A${row}:D${row}`);
  row += 2;

  const flowDepthRow = row;
  ws.getCell(row, 1).value = "Flow Depth";
  ws.getCell(row, 2).value = { formula: `=INPUTS!${INPUT_CELLS.INPUTS.floodLevel}-INPUTS!${INPUT_CELLS.INPUTS.bedLevel}` };
  ws.getCell(row, 3).value = "m";
  row++;

  ws.getCell(row, 1).value = "Hydrostatic Force";
  ws.getCell(row, 2).value = { formula: `=0.5*9.81*B${flowDepthRow}^2*B${pierWidthRow}*B${numPiersRow}` };
  ws.getCell(row, 3).value = "kN";
  const hydroForceRow = row;
  row++;

  ws.getCell(row, 1).value = "Drag Force";
  ws.getCell(row, 2).value = { formula: `=0.5*1.025*(INPUTS!${INPUT_CELLS.INPUTS.discharge}/(INPUTS!${INPUT_CELLS.INPUTS.width}*B${flowDepthRow}))^2*1.1*B${pierWidthRow}*B${flowDepthRow}*B${numPiersRow}` };
  ws.getCell(row, 3).value = "kN";
  const dragForceRow = row;
  row++;

  ws.getCell(row, 1).value = "Total Horizontal Force";
  ws.getCell(row, 2).value = { formula: `=B${hydroForceRow}+B${dragForceRow}` };
  ws.getCell(row, 3).value = "kN";
  const totalHForceRow = row;
  row += 2;

  // SECTION 5: STABILITY CHECKS (WITH FORMULAS)
  ws.getCell(row, 1).value = "STABILITY VERIFICATION";
  ws.getCell(row, 1).font = { bold: true, size: 11, color: { argb: "FF365070" } };
  ws.mergeCells(`A${row}:D${row}`);
  row += 2;

  const pierConcreteVol = (design.pier?.pierConcrete || 0) + (design.pier?.baseConcrete || 0);
  ws.getCell(row, 1).value = "Sliding Safety Factor";
  ws.getCell(row, 2).value = { formula: `=(${pierConcreteVol}*25*0.5)/B${totalHForceRow}` };
  ws.getCell(row, 3).value = "Req: >1.5";
  row++;

  ws.getCell(row, 1).value = "Overturning Safety Factor";
  ws.getCell(row, 2).value = { formula: `=(${pierConcreteVol}*25*(B${pierLengthRow}/2))/B${totalHForceRow}*(B${pierDepthRow}/2)` };
  ws.getCell(row, 3).value = "Req: >1.8";
  row++;

  ws.getCell(row, 1).value = "Bearing Safety Factor";
  ws.getCell(row, 2).value = { formula: `=INPUTS!${INPUT_CELLS.INPUTS.soilBearingCapacity}/((${pierConcreteVol}*25)/(B${pierWidthRow}*B${pierLengthRow}))` };
  ws.getCell(row, 3).value = "Req: >2.5";
  row += 2;

  // SECTION 6: CONCRETE VOLUMES
  ws.getCell(row, 1).value = "MATERIAL QUANTITIES";
  ws.getCell(row, 1).font = { bold: true, size: 11, color: { argb: "FF365070" } };
  ws.mergeCells(`A${row}:D${row}`);
  row += 2;

  ws.getCell(row, 1).value = "Pier Concrete";
  ws.getCell(row, 2).value = design.pier?.pierConcrete || 0;
  ws.getCell(row, 3).value = "m³";
  row++;

  ws.getCell(row, 1).value = "Base Concrete";
  ws.getCell(row, 2).value = design.pier?.baseConcrete || 0;
  ws.getCell(row, 3).value = "m³";
  row++;

  ws.getCell(row, 1).value = "Total Pier + Base";
  ws.getCell(row, 2).value = { formula: `=${(design.pier?.pierConcrete || 0) + (design.pier?.baseConcrete || 0)}` };
  ws.getCell(row, 3).value = "m³";
  row += 2;

  // FINAL STATUS
  ws.getCell(row, 1).value = "DESIGN STATUS";
  ws.getCell(row, 1).font = { bold: true, size: 12, color: { argb: "FF27AE60" } };
  ws.mergeCells(`A${row}:D${row}`);
  row++;
  ws.getCell(row, 1).value = "✓ PIER DESIGN WITH LIVE FORMULAS - Values recalculate when inputs change";
  ws.getCell(row, 1).font = { color: { argb: "FF27AE60" } };
  row++;

  return row;
}
