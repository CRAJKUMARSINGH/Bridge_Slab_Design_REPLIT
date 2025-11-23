import XLSX from "xlsx";
import type { DesignInput } from "./design-engine";

export function parseExcelForDesignInput(buffer: Buffer): DesignInput | null {
  try {
    const workbook = XLSX.read(buffer);

    // Default values
    let discharge = 900;
    let floodLevel = 100.6;
    let bedSlope = 0.001;
    let span = 30;
    let width = 8.4;
    let bedLevel = 96.47;
    let soilBearingCapacity = 200;
    let numberOfLanes = 2;
    let fck = 25;
    let fy = 415;

    // Search through all sheets for design parameters
    for (const sheetName of workbook.SheetNames) {
      const ws = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];

      data.forEach((row) => {
        const col0 = String(row[0] || "").toLowerCase().trim();
        const col4 = row[4];

        // From STABILITY CHECK FOR PIER or similar sheets
        if (col0.includes("right effective") || col0.includes("effective")) {
          const val = parseFloat(col4);
          if (!isNaN(val)) span = val;
        }
        if (col0.includes("overall width") || col0.includes("deck width")) {
          const val = parseFloat(col4);
          if (!isNaN(val)) width = val;
        }
        if (col0.includes("flood discharge") || col0.includes("discharge")) {
          const val = parseFloat(col4);
          if (!isNaN(val)) discharge = val;
        }
        if (col0.includes("bed slope") || col0.includes("slope")) {
          const val = parseFloat(col4);
          if (!isNaN(val)) bedSlope = 1 / val;
        }
        if (col0.includes("h.f.l.") || col0.includes("hfl") || col0.includes("highest flood")) {
          const val = parseFloat(col4);
          if (!isNaN(val)) floodLevel = val;
        }
        if (col0.includes("bed level")) {
          const val = parseFloat(col4);
          if (!isNaN(val)) bedLevel = val;
        }
        if (col0.includes("safe bearing") || col0.includes("bearing capacity")) {
          const val = parseFloat(col4);
          if (!isNaN(val)) soilBearingCapacity = val * 10; // Convert t/m² to kPa
        }

        // From ESTIMATION_INPUT_DATA sheet
        const col1 = String(row[1] || "").toLowerCase().trim();
        if (col0.includes("number of piers") || col1.includes("number of piers")) {
          const val = parseFloat(col4 || row[2]);
          if (!isNaN(val)) {
            // Number of piers affects design but we'll calculate from span
          }
        }
      });
    }

    return {
      discharge: Math.max(discharge, 50),
      floodLevel: floodLevel,
      bedSlope: Math.max(bedSlope, 0.0005),
      span: span,
      width: width,
      soilBearingCapacity: soilBearingCapacity,
      numberOfLanes: numberOfLanes,
      fck: fck,
      fy: fy,
      bedLevel: bedLevel,
      loadClass: "Class AA",
    };
  } catch (error) {
    console.error("Error parsing Excel:", error);
    return null;
  }
}

export function extractAllSheets(buffer: Buffer): { [sheetName: string]: any[] } {
  try {
    const workbook = XLSX.read(buffer);
    const result: { [sheetName: string]: any[] } = {};

    for (const sheetName of workbook.SheetNames) {
      const ws = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
      result[sheetName] = data;
    }

    return result;
  } catch (error) {
    console.error("Error extracting sheets:", error);
    return {};
  }
}
