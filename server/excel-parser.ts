import XLSX from "xlsx";
import type { DesignInput } from "./design-engine";

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

export function parseExcelForDesignInput(
  buffer: Buffer
): DesignInput | null {
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

    // Search for hydraulics data in sheets
    for (const sheetName of workbook.SheetNames) {
      const ws = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (string | number)[][];

      // Look for key hydraulic parameters
      data.forEach((row) => {
        const label = String(row[0] || "").toLowerCase();
        const value = parseFloat(String(row[1] || "0"));

        if (label.includes("discharge") || label.includes("q")) {
          hydraulicData.discharge = value || hydraulicData.discharge;
        }
        if (label.includes("flood") || label.includes("hfl") || label.includes("highest")) {
          hydraulicData.floodLevel = value || hydraulicData.floodLevel;
        }
        if (label.includes("slope") || label.includes("bed")) {
          hydraulicData.bedSlope = value || hydraulicData.bedSlope;
        }
        if (label.includes("width") && !label.includes("bridge")) {
          hydraulicData.riverWidth = value || hydraulicData.riverWidth;
        }
        if (label.includes("roughness") || label.includes("manning")) {
          hydraulicData.channelRoughness = value || hydraulicData.channelRoughness;
        }

        // Bridge geometry
        if (label.includes("span")) {
          bridgeData.proposedSpan = value || bridgeData.proposedSpan;
        }
        if (label.includes("deck width") || label.includes("carriage")) {
          bridgeData.proposedWidth = value || bridgeData.proposedWidth;
        }
        if (label.includes("lane")) {
          bridgeData.numberOfLanes = Math.round(value) || bridgeData.numberOfLanes;
        }
        if (label.includes("bearing") || label.includes("sbc")) {
          bridgeData.soilBearingCapacity = value || bridgeData.soilBearingCapacity;
        }
      });
    }

    // Generate DesignInput from parsed data
    const designInput: DesignInput = {
      discharge: hydraulicData.discharge,
      floodLevel: hydraulicData.floodLevel,
      span: bridgeData.proposedSpan,
      width: bridgeData.proposedWidth,
      numberOfLanes: bridgeData.numberOfLanes,
      fck: 25,
      fy: 415,
      soilBearingCapacity: bridgeData.soilBearingCapacity,
      loadClass: "Class AA",
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
