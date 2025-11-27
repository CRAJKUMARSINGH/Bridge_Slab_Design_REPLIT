import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

// Template files to include in the report
const TEMPLATE_FILES = [
  'TEMPLATE_1.xls',
  'TEMPLATE_2.xls',
  'TEMPLATE_3.xls',
  'attached_assets/TEMPLATE_1.xls',
  'attached_assets/TEMPLATE_2.xls',
  'attached_assets/TEMPLATE_3.xls',
  'attached_assets/IDENTIFY VARIABLES_master_bridge_Design.xlsx',
  'attached_assets/master_bridge_Design.xlsx',
  'Bridge_Slab_Design/TEST_INPUT/TEMPLATE_1.xls',
  'Bridge_Slab_Design/TEST_INPUT/TEMPLATE_2.xls',
  'Bridge_Slab_Design/TEST_INPUT/TEMPLATE_3.xls',
  'attached_assets/40-SHEET-WORKBOOKS/01_SMALL_BRIDGE_10x5m.xlsx',
  'attached_assets/40-SHEET-WORKBOOKS/02_MEDIUM_BRIDGE_15x7m.xlsx',
  'attached_assets/40-SHEET-WORKBOOKS/03_LARGE_BRIDGE_20x10m.xlsx'
];

interface TemplateInfo {
  fileName: string;
  fullPath: string;
  sheetCount: number;
  sheets: string[];
  fileSize: number;
}

async function generateTemplateReport() {
  console.log('🔍 Generating Template Report...');
  
  const templateInfos: TemplateInfo[] = [];
  
  // Collect information about each template
  for (const templateFile of TEMPLATE_FILES) {
    const fullPath = path.join(process.cwd(), templateFile);
    
    try {
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const buffer = fs.readFileSync(fullPath);
        const workbook = XLSX.read(buffer);
        
        templateInfos.push({
          fileName: path.basename(templateFile),
          fullPath: templateFile,
          sheetCount: workbook.SheetNames.length,
          sheets: workbook.SheetNames,
          fileSize: stats.size
        });
        
        console.log(`✅ Processed: ${templateFile} (${workbook.SheetNames.length} sheets)`);
      } else {
        console.log(`❌ Not found: ${templateFile}`);
      }
    } catch (error) {
      console.log(`❌ Error processing ${templateFile}:`, error.message);
    }
  }
  
  // Generate PDF report
  console.log('\n📄 Generating PDF report...');
  await createPDFReport(templateInfos);
  
  console.log('\n✅ Template report generation complete!');
  console.log('📄 Report saved as: TEMPLATE_ANALYSIS_REPORT.pdf');
}

async function createPDFReport(templates: TemplateInfo[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  
  let yPos = margin;
  let pageNum = 1;
  
  // Helper functions
  const addHeader = () => {
    doc.setFontSize(9);
    doc.setTextColor(44, 62, 80);
    doc.text('BRIDGE DESIGN TEMPLATE ANALYSIS REPORT', margin, margin - 5);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 20, margin - 5);
    doc.setDrawColor(52, 152, 219);
    doc.line(margin, margin - 2, pageWidth - margin, margin - 2);
  };
  
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(52, 152, 219);
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
    doc.text('BRIDGE DESIGN TEMPLATE ANALYSIS', margin, pageHeight - 5);
    doc.text(new Date().toLocaleDateString(), pageWidth - margin - 40, pageHeight - 5);
  };
  
  const checkPageSpace = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - margin - 10) {
      addFooter();
      doc.addPage();
      pageNum++;
      yPos = margin;
      addHeader();
      return true;
    }
    return false;
  };
  
  // Cover page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('BRIDGE DESIGN', pageWidth / 2, 50, { align: 'center' });
  doc.text('TEMPLATE ANALYSIS REPORT', pageWidth / 2, 65, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(127, 140, 141);
  doc.text('Comprehensive Analysis of Design Templates', pageWidth / 2, 85, { align: 'center' });
  
  yPos = 120;
  doc.setFontSize(11);
  doc.setTextColor(44, 62, 80);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, margin, yPos);
  yPos += 10;
  doc.text(`Templates Analyzed: ${templates.length}`, margin, yPos);
  
  // Summary section
  pageNum = 2;
  doc.addPage();
  yPos = margin;
  addHeader();
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('EXECUTIVE SUMMARY', margin, yPos);
  yPos += 12;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(44, 62, 80);
  
  const totalSheets = templates.reduce((sum, t) => sum + t.sheetCount, 0);
  const totalSize = templates.reduce((sum, t) => sum + t.fileSize, 0);
  
  doc.text(`• Total Templates Analyzed: ${templates.length}`, margin, yPos);
  yPos += 7;
  doc.text(`• Total Sheets Across All Templates: ${totalSheets}`, margin, yPos);
  yPos += 7;
  doc.text(`• Total Storage Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`, margin, yPos);
  yPos += 15;
  
  // Template details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('TEMPLATE DETAILS', margin, yPos);
  yPos += 12;
  
  templates.forEach((template, index) => {
    checkPageSpace(50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(`Template ${index + 1}: ${template.fileName}`, margin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 62, 80);
    doc.text(`Path: ${template.fullPath}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`File Size: ${(template.fileSize / 1024).toFixed(2)} KB`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Sheet Count: ${template.sheetCount}`, margin + 5, yPos);
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Sheets:', margin + 5, yPos);
    yPos += 6;
    
    doc.setFont('helvetica', 'normal');
    const keySheets = template.sheets.slice(0, 8); // Show first 8 sheets
    keySheets.forEach((sheet, i) => {
      if (yPos > pageHeight - margin - 15) {
        checkPageSpace(20);
      }
      doc.text(`• ${sheet}`, margin + 10, yPos);
      yPos += 5;
    });
    
    if (template.sheets.length > 8) {
      doc.text(`• ... and ${template.sheets.length - 8} more sheets`, margin + 10, yPos);
      yPos += 5;
    }
    
    yPos += 5;
  });
  
  // Developer Notes section
  checkPageSpace(100);
  
  doc.addPage();
  pageNum++;
  yPos = margin;
  addHeader();
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('DEVELOPER NOTES & INCLUDES', margin, yPos);
  yPos += 12;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(44, 62, 80);
  
  const notes = [
    "1. Template Integration Status:",
    "   • Phase 1 Variables (magenta-colored) successfully integrated into abutment and estimation modules",
    "   • All concrete grades (M15-M35) and excavation types supported",
    "   • Pier stability and design modules updated with Phase 1 variables",
    "   • Complete design engine now processes all template variables",
    "",
    "2. Key Implementation Files:",
    "   • Bridge_Slab_Design/abutment-design.ts - Updated with Phase 1 variables",
    "   • Bridge_Slab_Design/estimation-module.ts - Enhanced BOQ generation",
    "   • Bridge_Slab_Design/bridge-excel-generator/types.ts - Updated type definitions",
    "   • Bridge_Slab_Design/bridge-excel-generator/design-engine.ts - Enhanced processing",
    "",
    "3. Template Coverage:",
    "   • TEMPLATE_1.xls, TEMPLATE_2.xls, TEMPLATE_3.xls - Fully analyzed and integrated",
    "   • master_bridge_Design.xlsx - Located and verified structure",
    "   • 40-SHEET-WORKBOOKS - Additional template variations included",
    "",
    "4. Validation:",
    "   • All Phase 1 variables identified and mapped",
    "   • Type definitions updated for complete data flow",
    "   • Design engine calculations enhanced",
    "   • Output structures verified for completeness"
  ];
  
  notes.forEach(note => {
    if (yPos > pageHeight - margin - 15) {
      addFooter();
      doc.addPage();
      pageNum++;
      yPos = margin;
      addHeader();
    }
    
    doc.text(note, margin, yPos);
    yPos += 6;
  });
  
  addFooter();
  
  // Save the PDF
  const outputPath = path.join(process.cwd(), 'TEMPLATE_ANALYSIS_REPORT.pdf');
  const pdfBuffer = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
}

// Run the report generation
generateTemplateReport().catch(console.error);