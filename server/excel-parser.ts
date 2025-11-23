import XLSX from "xlsx";
import type { DesignInput, DesignOutput } from "./design-engine";

export interface HydraulicData {
  discharge: number;
  floodLevel: number;
  bedSlope: number;
  riverWidth: number;
  channelRoughness: number;
}

export interface BridgeGeometryData {
  proposedSpan: number;
  proposedWidth: number;
  numberOfLanes: number;
  soilBearingCapacity: number;
}

export interface ComprehensiveWorkbookData {
  projectInfo: {
    name: string;
    location: string;
    engineer: string;
  };
  hydraulics: {
    [key: string]: any;
  };
  pier: {
    [key: string]: any;
  };
  abutment: {
    [key: string]: any;
  };
  slab: {
    [key: string]: any;
  };
  quantities: {
    [key: string]: any;
  };
  allSheets: {
    [sheetName: string]: (string | number)[][];
  };
}

/**
 * Parse comprehensive Excel design workbook (44+ sheets)
 * Extracts all calculation data, reinforcement schedules, quantities
 */
export function parseComprehensiveWorkbook(buffer: Buffer): ComprehensiveWorkbookData | null {
  try {
    const workbook = XLSX.read(buffer);
    const result: ComprehensiveWorkbookData = {
      projectInfo: {
        name: "",
        location: "",
        engineer: "",
      },
      hydraulics: {},
      pier: {},
      abutment: {},
      slab: {},
      quantities: {},
      allSheets: {},
    };

    // Read all sheets and store data
    for (const sheetName of workbook.SheetNames) {
      const ws = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (string | number)[][];
      result.allSheets[sheetName] = data;

      // Parse specific sheets for key data
      const lowerSheetName = sheetName.toLowerCase();

      if (lowerSheetName.includes("input") || lowerSheetName.includes("project")) {
        parseProjectInputSheet(data, result);
      } else if (lowerSheetName.includes("hydraulic")) {
        parseHydraulicSheet(data, result);
      } else if (lowerSheetName.includes("pier")) {
        parsePierSheet(data, result);
      } else if (lowerSheetName.includes("abutment")) {
        parseAbutmentSheet(data, result);
      } else if (lowerSheetName.includes("slab") || lowerSheetName.includes("deck")) {
        parseSlabSheet(data, result);
      } else if (lowerSheetName.includes("quantit")) {
        parseQuantitiesSheet(data, result);
      }
    }

    return result;
  } catch (error) {
    console.error("Error parsing comprehensive workbook:", error);
    return null;
  }
}

function parseProjectInputSheet(data: (string | number)[][], result: ComprehensiveWorkbookData) {
  data.forEach((row) => {
    const label = String(row[0] || "").toLowerCase();
    const value = row[1];

    if (label.includes("project") && label.includes("name")) {
      result.projectInfo.name = String(value || "");
    }
    if (label.includes("location")) {
      result.projectInfo.location = String(value || "");
    }
    if (label.includes("engineer")) {
      result.projectInfo.engineer = String(value || "");
    }
  });
}

function parseHydraulicSheet(data: (string | number)[][], result: ComprehensiveWorkbookData) {
  data.forEach((row) => {
    const label = String(row[0] || "").toLowerCase().trim();
    const value = row[1];

    if (label && value !== undefined) {
      // Store numeric values
      if (!isNaN(Number(value))) {
        result.hydraulics[label] = parseFloat(String(value));
      } else {
        result.hydraulics[label] = value;
      }
    }
  });
}

function parsePierSheet(data: (string | number)[][], result: ComprehensiveWorkbookData) {
  data.forEach((row) => {
    const label = String(row[0] || "").toLowerCase().trim();
    const value = row[1];

    if (label && value !== undefined) {
      if (!isNaN(Number(value))) {
        result.pier[label] = parseFloat(String(value));
      } else {
        result.pier[label] = value;
      }
    }
  });
}

function parseAbutmentSheet(data: (string | number)[][], result: ComprehensiveWorkbookData) {
  data.forEach((row) => {
    const label = String(row[0] || "").toLowerCase().trim();
    const value = row[1];

    if (label && value !== undefined) {
      if (!isNaN(Number(value))) {
        result.abutment[label] = parseFloat(String(value));
      } else {
        result.abutment[label] = value;
      }
    }
  });
}

function parseSlabSheet(data: (string | number)[][], result: ComprehensiveWorkbookData) {
  data.forEach((row) => {
    const label = String(row[0] || "").toLowerCase().trim();
    const value = row[1];

    if (label && value !== undefined) {
      if (!isNaN(Number(value))) {
        result.slab[label] = parseFloat(String(value));
      } else {
        result.slab[label] = value;
      }
    }
  });
}

function parseQuantitiesSheet(data: (string | number)[][], result: ComprehensiveWorkbookData) {
  data.forEach((row) => {
    const label = String(row[0] || "").toLowerCase().trim();
    const value = row[1];

    if (label && value !== undefined) {
      if (!isNaN(Number(value))) {
        result.quantities[label] = parseFloat(String(value));
      } else {
        result.quantities[label] = value;
      }
    }
  });
}

/**
 * Extract design input parameters from workbook
 * For auto-design generation
 */
export function parseExcelForDesignInput(buffer: Buffer): DesignInput | null {
  try {
    const workbook = XLSX.read(buffer);

    // Try to find hydraulics sheet
    let hydraulicData: HydraulicData = {
      discharge: 902.15,
      floodLevel: 100.6,
      bedSlope: 0.0008,
      riverWidth: 490.3,
      channelRoughness: 0.035,
    };

    let bridgeData: BridgeGeometryData = {
      proposedSpan: 30,
      proposedWidth: 7.5,
      numberOfLanes: 2,
      soilBearingCapacity: 150,
    };

    let fck = 25;
    let fy = 415;
    let loadClass = "Class AA";
    let bedLevel: number | undefined;

    // Search for data in all sheets
    for (const sheetName of workbook.SheetNames) {
      const ws = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (string | number)[][];

      data.forEach((row) => {
        const label = String(row[0] || "").toLowerCase().trim();
        const value = parseFloat(String(row[1] || "0"));
        const stringValue = String(row[1] || "").trim();

        // Hydraulics parameters
        if (label.includes("discharge") || label.includes("q") || label.includes("design discharge")) {
          hydraulicData.discharge = value || hydraulicData.discharge;
        }
        if (
          label.includes("flood") ||
          label.includes("hfl") ||
          label.includes("highest") ||
          label.includes("flood level")
        ) {
          hydraulicData.floodLevel = value || hydraulicData.floodLevel;
        }
        if (label.includes("bed level")) {
          bedLevel = value || bedLevel;
        }
        if (label.includes("slope") && label.includes("bed")) {
          hydraulicData.bedSlope = value || hydraulicData.bedSlope;
        }
        if (label.includes("width") && !label.includes("bridge") && !label.includes("deck")) {
          hydraulicData.riverWidth = value || hydraulicData.riverWidth;
        }
        if (label.includes("roughness") || label.includes("manning")) {
          hydraulicData.channelRoughness = value || hydraulicData.channelRoughness;
        }

        // Bridge geometry
        if (label.includes("span") || label.includes("effective span")) {
          bridgeData.proposedSpan = value || bridgeData.proposedSpan;
        }
        if (
          label.includes("deck width") ||
          label.includes("carriage") ||
          label.includes("bridge width") ||
          label.includes("width (w)")
        ) {
          bridgeData.proposedWidth = value || bridgeData.proposedWidth;
        }
        if (label.includes("lane")) {
          bridgeData.numberOfLanes = Math.round(value) || bridgeData.numberOfLanes;
        }
        if (label.includes("bearing") || label.includes("sbc") || label.includes("soil bearing")) {
          bridgeData.soilBearingCapacity = value || bridgeData.soilBearingCapacity;
        }

        // Material properties
        if (label.includes("fck") || label.includes("concrete grade")) {
          fck = Math.round(value) || fck;
        }
        if (label.includes("fy") || label.includes("steel grade")) {
          fy = Math.round(value) || fy;
        }
        if (label.includes("load class")) {
          loadClass = stringValue || loadClass;
        }
      });
    }

    // Generate DesignInput from parsed data
    const designInput: DesignInput = {
      discharge: hydraulicData.discharge,
      floodLevel: hydraulicData.floodLevel,
      bedSlope: hydraulicData.bedSlope,
      span: bridgeData.proposedSpan,
      width: bridgeData.proposedWidth,
      numberOfLanes: bridgeData.numberOfLanes,
      fck,
      fy,
      soilBearingCapacity: bridgeData.soilBearingCapacity,
      bedLevel,
      loadClass,
    };

    return designInput;
  } catch (error) {
    console.error("Error parsing Excel:", error);
    return null;
  }
}

export function extractSheetData(buffer: Buffer, sheetName: string): (string | number)[][] | null {
  try {
    const workbook = XLSX.read(buffer);
    const ws = workbook.Sheets[sheetName];
    if (!ws) return null;

    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (string | number)[][];
    return data;
  } catch (error) {
    console.error("Error extracting sheet:", error);
    return null;
  }
}

export function getSheetNames(buffer: Buffer): string[] {
  try {
    const workbook = XLSX.read(buffer);
    return workbook.SheetNames;
  } catch (error) {
    console.error("Error reading sheets:", error);
    return [];
  }
}
