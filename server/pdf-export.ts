import { jsPDF } from "jspdf";
import { Project } from "@shared/schema";
import { DesignOutput } from "./design-engine";

const COLORS = { primary: [54, 96, 146], light: [236, 240, 241], dark: [44, 62, 80] };
const PAGE_WIDTH = 210, PAGE_HEIGHT = 297, MARGIN = 15, CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

function addSection(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.primary);
  doc.setFillColor(...COLORS.light);
  doc.rect(MARGIN, y - 5, CONTENT_WIDTH, 8, "F");
  doc.text(title, MARGIN + 2, y + 1);
  return y + 12;
}

function addTable(doc: jsPDF, headers: string[], rows: (string | number)[][], startY: number): number {
  const colWidths = headers.map(() => CONTENT_WIDTH / headers.length);
  let y = startY;
  const lineHeight = 6;

  doc.setFillColor(...COLORS.primary);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, "bold");
  doc.setFontSize(9);

  let x = MARGIN;
  headers.forEach((header, i) => {
    doc.text(header, x + 1, y + lineHeight / 2, { maxWidth: colWidths[i] - 2 });
    x += colWidths[i];
  });

  y += lineHeight;

  doc.setTextColor(...COLORS.dark);
  doc.setFont(undefined, "normal");
  doc.setFontSize(8);

  rows.forEach((row, idx) => {
    if (y > PAGE_HEIGHT - MARGIN - 15) {
      doc.addPage();
      y = MARGIN;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(...COLORS.light);
      doc.rect(MARGIN, y - lineHeight / 2 + 1, CONTENT_WIDTH, lineHeight, "F");
    }

    x = MARGIN;
    row.forEach((cell, i) => {
      doc.text(String(cell || ""), x + 1, y + 1, { maxWidth: colWidths[i] - 2 });
      x += colWidths[i];
    });
    y += lineHeight;
  });

  return y + 5;
}

export async function generatePDF(project: Project, design: DesignOutput): Promise<Buffer> {
  try {
    const doc = new jsPDF();
    let y = MARGIN;

    // PAGE 1: COVER
    doc.setFontSize(28);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLORS.primary);
    doc.text("BRIDGE DESIGN REPORT", PAGE_WIDTH / 2, 40, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.dark);
    doc.text("IRC:6-2016 & IRC:112-2015", PAGE_WIDTH / 2, 60, { align: "center" });

    y = 100;
    doc.setFontSize(11);
    doc.text(`Project: ${project.name}`, MARGIN, y);
    y += 10;
    doc.text(`Span: ${design.projectInfo.span}m | Width: ${design.projectInfo.width}m | Discharge: ${design.projectInfo.discharge}m³/s`, MARGIN, y);

    // PAGE 2: HYDRAULICS
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "HYDRAULIC DESIGN", y);
    
    const hydRows = [
      ["Velocity", design.hydraulics.velocity.toFixed(2), "m/s"],
      ["Afflux", design.hydraulics.afflux.toFixed(3), "m"],
      ["Design Water Level", design.hydraulics.designWaterLevel.toFixed(2), "m"],
      ["Froude Number", design.hydraulics.froudeNumber.toFixed(3), "-"],
      ["Cross-Sectional Area", design.hydraulics.crossSectionalArea.toFixed(2), "m²"],
    ];
    y = addTable(doc, ["Parameter", "Value", "Unit"], hydRows, y);

    // PAGE 3: PIER
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "PIER DESIGN", y);
    
    const pierRows = [
      ["Width", design.pier.width.toFixed(2), "m"],
      ["Length", design.pier.length.toFixed(2), "m"],
      ["Number", design.pier.numberOfPiers, "nos"],
      ["Spacing", design.pier.spacing.toFixed(2), "m"],
      ["Sliding FOS", design.pier.slidingFOS.toFixed(2), design.pier.slidingFOS >= 1.5 ? "✓ SAFE" : "✗"],
      ["Overturning FOS", design.pier.overturningFOS.toFixed(2), design.pier.overturningFOS >= 1.8 ? "✓ SAFE" : "✗"],
      ["Bearing FOS", design.pier.bearingFOS.toFixed(2), design.pier.bearingFOS >= 2.5 ? "✓ SAFE" : "✗"],
    ];
    y = addTable(doc, ["Property", "Value", "Status"], pierRows, y);

    // PAGE 4: ABUTMENT
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "ABUTMENT DESIGN", y);
    
    const abRows = [
      ["Height", design.abutment.height.toFixed(2), "m"],
      ["Width", design.abutment.width.toFixed(2), "m"],
      ["Base Width", design.abutment.baseWidth.toFixed(2), "m"],
      ["Sliding FOS", design.abutment.slidingFOS.toFixed(2), design.abutment.slidingFOS >= 1.5 ? "✓ SAFE" : "✗"],
      ["Overturning FOS", design.abutment.overturningFOS.toFixed(2), design.abutment.overturningFOS >= 2.0 ? "✓ SAFE" : "✗"],
      ["Bearing FOS", design.abutment.bearingFOS.toFixed(2), design.abutment.bearingFOS >= 2.5 ? "✓ SAFE" : "✗"],
    ];
    y = addTable(doc, ["Property", "Value", "Status"], abRows, y);

    // PAGE 5: SLAB
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "SLAB DESIGN", y);
    
    const slabRows = [
      ["Thickness", (design.slab.thickness ?? 0).toFixed(0), "mm"],
      ["Design Load", (design.slab.designLoad ?? 0).toFixed(2), "kN/m²"],
      ["Longitudinal Moment", (design.slab.longitudinalMoment ?? 0).toFixed(1), "kN.m/m"],
      ["Transverse Moment", (design.slab.transverseMoment ?? 0).toFixed(1), "kN.m/m"],
      ["Shear Force", (design.slab.shearForce ?? 0).toFixed(1), "kN/m"],
      ["Main Steel Area", design.slab.mainSteel?.area ? design.slab.mainSteel.area.toFixed(0) : "TBD", "mm²/m"],
      ["Distribution Area", (design.slab.distributionSteel?.area ?? 0).toFixed(0), "mm²/m"],
    ];
    y = addTable(doc, ["Parameter", "Value", "Unit"], slabRows, y);

    // PAGE 6: QUANTITIES
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "MATERIAL QUANTITIES", y);
    
    const qtyRows = [
      ["Concrete (Total)", (design.quantities.totalConcrete ?? 0).toFixed(2), "m³"],
      ["Steel (Total)", (design.quantities.totalSteel ?? 0).toFixed(2), "tonnes"],
      ["Formwork", (design.quantities.formwork ?? 0).toFixed(2), "m²"],
      ["Slab Concrete", (design.quantities.slabConcrete ?? 0).toFixed(2), "m³"],
      ["Pier Concrete", (design.quantities.pierConcrete ?? 0).toFixed(2), "m³"],
      ["Abutment Concrete", (design.quantities.abutmentConcrete ?? 0).toFixed(2), "m³"],
    ];
    y = addTable(doc, ["Item", "Quantity", "Unit"], qtyRows, y);

    const buffer = doc.output("arraybuffer");
    return Buffer.from(buffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
