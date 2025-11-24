/**
 * Excel Formula Generation Engine
 * Generates actual Excel formulas (=B5*C6 style) instead of static values
 * This ensures calculations are dynamic and update when inputs change
 */

import ExcelJS from "exceljs";

// Define cell locations for all input parameters
export const INPUT_CELLS = {
  INPUTS: {
    span: "B3",
    width: "B4",
    discharge: "B5",
    floodLevel: "B6",
    bedLevel: "B7",
    fck: "B8",
    fy: "B9",
    soilBearingCapacity: "B10",
    bedSlope: "B11",
    numberOfLanes: "B12"
  }
};

/**
 * Add an INPUTS sheet with all design parameters
 * Returns the cell references for formulas to use
 */
export function addInputsSheet(
  workbook: ExcelJS.Workbook,
  input: any
): typeof INPUT_CELLS.INPUTS {
  const ws = workbook.addWorksheet("INPUTS", { state: "hidden" });
  ws.columns = [{ width: 25 }, { width: 20 }];

  let row = 1;
  ws.getCell(row, 1).value = "INPUT PARAMETERS (Hidden - used for formulas)";
  ws.getCell(row, 1).font = { bold: true };
  row += 2;

  const inputs = [
    ["Design Span (m)", input.span, "B3"],
    ["Bridge Width (m)", input.width, "B4"],
    ["Design Discharge (m³/s)", input.discharge, "B5"],
    ["Flood Level (m MSL)", input.floodLevel, "B6"],
    ["Bed Level (m MSL)", input.bedLevel || 96.47, "B7"],
    ["Concrete Grade (fck)", input.fck, "B8"],
    ["Steel Grade (fy)", input.fy, "B9"],
    ["Soil Bearing Capacity (kPa)", input.soilBearingCapacity, "B10"],
    ["Bed Slope (m/m)", input.bedSlope, "B11"],
    ["Number of Lanes", input.numberOfLanes || 2, "B12"]
  ];

  inputs.forEach(([label, value]) => {
    ws.getCell(row, 1).value = label;
    ws.getCell(row, 2).value = value;
    row++;
  });

  return INPUT_CELLS.INPUTS;
}

/**
 * Generate formula for flow depth
 * = Flood Level - Bed Level
 */
export function flowDepthFormula(): string {
  return `=INPUTS!${INPUT_CELLS.INPUTS.floodLevel}-INPUTS!${INPUT_CELLS.INPUTS.bedLevel}`;
}

/**
 * Generate formula for velocity (Manning's equation)
 * V = (1/n) × D^(2/3) × S^(1/2)
 * For simplified: V = Discharge / (Width × Depth)
 */
export function velocityFormula(depthCell: string): string {
  return `=INPUTS!${INPUT_CELLS.INPUTS.discharge}/(INPUTS!${INPUT_CELLS.INPUTS.width}*${depthCell})`;
}

/**
 * Generate formula for Lacey's afflux
 * a = V² / (17.9 × √m)
 */
export function affluxFormula(velocityCell: string, silFactor: string = "0.78"): string {
  return `=(${velocityCell}^2)/(17.9*SQRT(${silFactor}))`;
}

/**
 * Generate formula for design water level
 * DWL = HFL + Afflux
 */
export function designWaterLevelFormula(affluxCell: string): string {
  return `=INPUTS!${INPUT_CELLS.INPUTS.floodLevel}+${affluxCell}`;
}

/**
 * Generate formula for Froude number
 * Fr = V / √(g × h)
 */
export function froudeNumberFormula(velocityCell: string, depthCell: string): string {
  return `=${velocityCell}/SQRT(9.81*${depthCell})`;
}

/**
 * Generate formula for number of piers
 * = Span / spacing
 */
export function numberOfPiersFormula(spacingM: number = 5): string {
  return `=ROUND(INPUTS!${INPUT_CELLS.INPUTS.span}/${spacingM},0)`;
}

/**
 * Generate formula for pier spacing
 * = Span / Number of Piers
 */
export function pierSpacingFormula(numberOfPiersCell: string): string {
  return `=INPUTS!${INPUT_CELLS.INPUTS.span}/${numberOfPiersCell}`;
}

/**
 * Generate formula for hydrostatic force
 * F_h = 0.5 × γ × h² × Width × NumPiers
 * γ = 9.81 kN/m³ (water)
 */
export function hydrostaticForceFormula(
  depthCell: string,
  pierWidthCell: string,
  numPiersCell: string
): string {
  return `=0.5*9.81*${depthCell}^2*${pierWidthCell}*${numPiersCell}`;
}

/**
 * Generate formula for drag force
 * F_d = 0.5 × ρ × v² × Cd × Area × NumPiers
 * For rectangular piers: Area = Width × Depth
 * Cd ≈ 1.1 (for rectangular)
 */
export function dragForceFormula(
  velocityCell: string,
  pierWidthCell: string,
  depthCell: string,
  numPiersCell: string,
  cd: number = 1.1,
  rho: number = 1.025
): string {
  return `=0.5*${rho}*${velocityCell}^2*${cd}*${pierWidthCell}*${depthCell}*${numPiersCell}`;
}

/**
 * Generate formula for total horizontal force
 * = Hydrostatic + Drag
 */
export function totalHorizontalForceFormula(
  hydrostaticCell: string,
  dragCell: string
): string {
  return `=${hydrostaticCell}+${dragCell}`;
}

/**
 * Generate formula for pier concrete volume
 * = Width × Length × Depth × NumPiers
 */
export function pierConcreteVolumeFormula(
  widthCell: string,
  lengthCell: string,
  depthCell: string,
  numPiersCell: string
): string {
  return `=${widthCell}*${lengthCell}*${depthCell}*${numPiersCell}`;
}

/**
 * Generate formula for sliding safety factor
 * FOS = (Weight × μ) / H-Force
 * Weight = Pier Concrete × 25 (kN/m³)
 * μ = 0.5 (friction coefficient)
 */
export function slidingFOSFormula(
  concreteVolumeCell: string,
  totalHForceCell: string,
  mu: number = 0.5
): string {
  return `=(${concreteVolumeCell}*25*${mu})/${totalHForceCell}`;
}

/**
 * Generate formula for overturning safety factor
 * FOS = Resisting Moment / Overturning Moment
 */
export function overturbingFOSFormula(
  pierLengthCell: string,
  pierWidthCell: string,
  depthCell: string,
  horizontalForceCell: string
): string {
  // Resisting moment = Weight × (Length/2)
  // Overturning moment = Horizontal Force × (Depth/2)
  const resistingMoment = `(${pierLengthCell}*${pierWidthCell}*${depthCell}*25*(${pierLengthCell}/2))`;
  const overturbingMoment = `(${horizontalForceCell}*(${depthCell}/2))`;
  return `=${resistingMoment}/${overturbingMoment}`;
}

/**
 * Generate formula for bearing safety factor
 * FOS = SBC / Bearing Pressure
 * Bearing Pressure = Weight / (Length × Width)
 */
export function bearingFOSFormula(
  concreteVolumeCell: string,
  pierLengthCell: string,
  pierWidthCell: string,
  sbcCell: string = `INPUTS!${INPUT_CELLS.INPUTS.soilBearingCapacity}`
): string {
  const weight = `${concreteVolumeCell}*25`;
  const bearingPressure = `(${weight}/(${pierLengthCell}*${pierWidthCell}))`;
  return `=${sbcCell}/${bearingPressure}`;
}

/**
 * Create a formula-based row for calculations
 * Instead of writing static values, this creates formula cells
 */
export function addFormulaRow(
  ws: ExcelJS.Worksheet,
  row: number,
  label: string,
  formula: string,
  unit: string,
  decimals: number = 2
): number {
  ws.getCell(row, 1).value = label;
  ws.getCell(row, 2).value = { formula };
  ws.getCell(row, 2).numberFormat = `0.${"0".repeat(decimals)}`;
  ws.getCell(row, 3).value = unit;
  return row + 1;
}

/**
 * Add a static value row (for inputs and labels)
 */
export function addValueRow(
  ws: ExcelJS.Worksheet,
  row: number,
  label: string,
  value: any,
  unit: string
): number {
  ws.getCell(row, 1).value = label;
  ws.getCell(row, 2).value = value;
  ws.getCell(row, 3).value = unit;
  return row + 1;
}
