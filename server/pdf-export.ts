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
      doc.text(String(cell), x + 1, y + 1, { maxWidth: colWidths[i] - 2 });
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

    // PAGE 1: COVER PAGE
    doc.setFontSize(28);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLORS.primary);
    doc.text("SUBMERSIBLE BRIDGE DESIGN REPORT", PAGE_WIDTH / 2, 40, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.dark);
    doc.text("IRC:6-2016 & IRC:112-2015 Compliant", PAGE_WIDTH / 2, 60, { align: "center" });

    y = 100;
    doc.setFontSize(11);
    doc.text(`Project: ${project.name}`, MARGIN, y);
    y += 10;
    doc.text(`Span: ${design.projectInfo.span}m | Width: ${design.projectInfo.width}m`, MARGIN, y);
    y += 10;
    doc.text(`Discharge: ${design.projectInfo.discharge}m³/s | Design WL: ${design.projectInfo.flowDepth}m`, MARGIN, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("Design Code References:", MARGIN, y);
    y += 8;
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.text("• IRC:6-2016: Standard Specifications for Road Bridges", MARGIN + 5, y);
    y += 7;
    doc.text("• IRC:112-2015: Code of Practice for Concrete Roads", MARGIN + 5, y);
    y += 7;
    doc.text("• IS:456-2000: Code of Practice for Plain and RCC", MARGIN + 5, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("Report Structure:", MARGIN, y);
    y += 8;
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    const sections = [
      "1. Design Input & Hydraulic Analysis",
      "2. Pier Structural Design & Stability Checks",
      "3. Abutment Design & Verification",
      "4. Slab Design (Pigeaud's Method)",
      "5. Reinforcement Schedules & Details",
      "6. Material Quantities & Cost Estimate",
    ];
    sections.forEach(section => {
      doc.text(section, MARGIN + 5, y);
      y += 7;
    });

    // PAGE 2: HYDRAULIC CALCULATIONS
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "HYDRAULIC DESIGN ANALYSIS (LACEY'S METHOD)", y);
    
    const hydRows = [
      ["Cross-Sectional Area", design.hydraulics.crossSectionalArea.toFixed(2), "m²"],
      ["Flow Velocity", design.hydraulics.velocity.toFixed(2), "m/s"],
      ["Lacey Silt Factor", design.hydraulics.laceysSiltFactor.toFixed(2), "-"],
      ["Afflux", design.hydraulics.afflux.toFixed(3), "m"],
      ["Design Water Level", design.hydraulics.designWaterLevel.toFixed(2), "m (abs)"],
      ["Contraction Loss", design.hydraulics.contraction.toFixed(3), "m"],
      ["Froude Number", design.hydraulics.froudeNumber.toFixed(3), "-"],
    ];
    y = addTable(doc, ["Parameter", "Value", "Unit"], hydRows, y);

    y += 5;
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Hydraulic Design Data:", MARGIN, y);
    y += 6;
    doc.setFont(undefined, "normal");
    doc.setFontSize(8);
    const hydInfo = [
      `Design Discharge (Q): ${design.projectInfo.discharge} m³/s`,
      `HFL: ${design.projectInfo.floodLevel.toFixed(2)}m (absolute)`,
      `Bed Level: ${design.projectInfo.bedLevel.toFixed(2)}m (absolute)`,
      `Flow Depth: ${design.projectInfo.flowDepth.toFixed(2)}m`,
    ];
    hydInfo.forEach(info => {
      doc.text(info, MARGIN + 2, y);
      y += 4;
    });

    // PAGE 3: PIER DESIGN
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "PIER STRUCTURAL DESIGN & STABILITY", y);

    const pierRows = [
      ["Pier Width", design.pier.width.toFixed(2), "m"],
      ["Pier Length", design.pier.length.toFixed(2), "m"],
      ["Pier Depth", design.pier.depth.toFixed(2), "m"],
      ["Number of Piers", design.pier.numberOfPiers, "nos"],
      ["Pier Spacing", design.pier.spacing.toFixed(2), "m"],
      ["Base Width", design.pier.baseWidth.toFixed(2), "m"],
      ["Hydrostatic Force", design.pier.hydrostaticForce.toFixed(1), "kN"],
      ["Drag Force", design.pier.dragForce.toFixed(1), "kN"],
      ["Total Horizontal Force", design.pier.totalHorizontalForce.toFixed(1), "kN"],
    ];
    y = addTable(doc, ["Parameter", "Value", "Unit"], pierRows, y);

    y += 5;
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Stability Checks (Minimum FOS: 1.5, 1.8, 2.5):", MARGIN, y);
    y += 6;

    const stabRows = [
      ["Sliding FOS", design.pier.slidingFOS.toFixed(2), design.pier.slidingFOS >= 1.5 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Overturning FOS", design.pier.overturningFOS.toFixed(2), design.pier.overturningFOS >= 1.8 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Bearing Capacity FOS", design.pier.bearingFOS.toFixed(2), design.pier.bearingFOS >= 2.5 ? "✓ SAFE" : "✗ UNSAFE"],
    ];
    y = addTable(doc, ["Check", "FOS Value", "Status"], stabRows, y);

    y += 5;
    doc.setFont(undefined, "bold");
    doc.text("Reinforcement:", MARGIN, y);
    y += 5;
    doc.setFont(undefined, "normal");
    doc.text(`Main Steel: Ø${design.pier.mainSteel.diameter}mm @ ${design.pier.mainSteel.spacing}mm c/c (${design.pier.mainSteel.quantity} bars)`, MARGIN + 2, y);
    y += 4;
    doc.text(`Link Steel: Ø${design.pier.linkSteel.diameter}mm @ ${design.pier.linkSteel.spacing}mm c/c (${design.pier.linkSteel.quantity} bars)`, MARGIN + 2, y);

    // PAGE 4: ABUTMENT DESIGN
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "ABUTMENT STRUCTURAL DESIGN", y);

    const abRows = [
      ["Abutment Height", design.abutment.height.toFixed(2), "m"],
      ["Abutment Width", design.abutment.width.toFixed(2), "m"],
      ["Abutment Depth", design.abutment.depth.toFixed(2), "m"],
      ["Base Width", design.abutment.baseWidth.toFixed(2), "m"],
      ["Wing Wall Height", design.abutment.wingWallHeight.toFixed(2), "m"],
      ["Active Earth Pressure", design.abutment.activeEarthPressure.toFixed(1), "kN"],
      ["Vertical Load", design.abutment.verticalLoad.toFixed(1), "kN"],
    ];
    y = addTable(doc, ["Parameter", "Value", "Unit"], abRows, y);

    y += 5;
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Stability Checks (Minimum FOS: 1.5, 2.0, 2.5):", MARGIN, y);
    y += 6;

    const abStabRows = [
      ["Sliding FOS", design.abutment.slidingFOS.toFixed(2), design.abutment.slidingFOS >= 1.5 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Overturning FOS", design.abutment.overturningFOS.toFixed(2), design.abutment.overturningFOS >= 2.0 ? "✓ SAFE" : "✗ UNSAFE"],
      ["Bearing Capacity FOS", design.abutment.bearingFOS.toFixed(2), design.abutment.bearingFOS >= 2.5 ? "✓ SAFE" : "✗ UNSAFE"],
    ];
    y = addTable(doc, ["Check", "FOS Value", "Status"], abStabRows, y);

    // PAGE 5: SLAB DESIGN
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "SLAB DESIGN (PIGEAUD'S METHOD)", y);

    const slabRows = [
      ["Slab Thickness", design.slab.thickness.toFixed(0), "mm"],
      ["Wearing Coat", design.slab.wearingCoat.toFixed(3), "m"],
      ["Dead Load", design.slab.deadLoad.toFixed(2), "kN/m²"],
      ["Live Load", design.slab.liveLoad.toFixed(2), "kN/m²"],
      ["Impact Factor", design.slab.impactFactor.toFixed(2), "-"],
      ["Design Load", design.slab.designLoad.toFixed(2), "kN/m²"],
      ["Longitudinal Moment", design.slab.longitudinalMoment.toFixed(1), "kN.m/m"],
      ["Transverse Moment", design.slab.transverseMoment.toFixed(1), "kN.m/m"],
      ["Shear Force", design.slab.shearForce.toFixed(1), "kN/m"],
    ];
    y = addTable(doc, ["Parameter", "Value", "Unit"], slabRows, y);

    y += 5;
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Reinforcement Schedule:", MARGIN, y);
    y += 6;
    doc.setFont(undefined, "normal");
    doc.setFontSize(8);
    doc.text(`Main Steel: Ø${design.slab.mainSteel.diameter}mm @ ${design.slab.mainSteel.spacing}mm c/c`, MARGIN + 2, y);
    y += 4;
    doc.text(`Area Provided: ${design.slab.mainSteel.area.toFixed(0)} mm²/m`, MARGIN + 2, y);
    y += 4;
    doc.text(`Distribution: Ø${design.slab.distributionSteel.diameter}mm @ ${design.slab.distributionSteel.spacing}mm c/c`, MARGIN + 2, y);
    y += 4;
    doc.text(`Area Provided: ${design.slab.distributionSteel.area.toFixed(0)} mm²/m`, MARGIN + 2, y);

    // PAGE 6: QUANTITIES
    doc.addPage();
    y = MARGIN;
    y = addSection(doc, "MATERIAL QUANTITY ESTIMATE", y);

    const qtyRows = [
      ["Slab Concrete", design.quantities.slabConcrete.toFixed(2), "m³"],
      ["Pier Concrete", design.quantities.pierConcrete.toFixed(2), "m³"],
      ["Abutment Concrete (both)", design.quantities.abutmentConcrete.toFixed(2), "m³"],
      ["TOTAL CONCRETE", design.quantities.totalConcrete.toFixed(2), "m³"],
      ["Slab Steel", design.quantities.slabSteel.toFixed(2), "tonnes"],
      ["Pier Steel", design.quantities.pierSteel.toFixed(2), "tonnes"],
      ["Abutment Steel (both)", design.quantities.abutmentSteel.toFixed(2), "tonnes"],
      ["TOTAL STEEL", design.quantities.totalSteel.toFixed(2), "tonnes"],
      ["Formwork", design.quantities.formwork.toFixed(2), "m²"],
    ];
    y = addTable(doc, ["Item", "Quantity", "Unit"], qtyRows, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.dark);
    doc.text(`Generated: ${new Date().toLocaleString()}`, MARGIN, PAGE_HEIGHT - 10);
    doc.text("Page " + doc.getNumberOfPages(), PAGE_WIDTH - MARGIN - 20, PAGE_HEIGHT - 10);

    const buffer = doc.output("arraybuffer");
    return Buffer.from(buffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
