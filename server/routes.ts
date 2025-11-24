import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { generateCompleteExcelReport } from "./excel-export";
import { generateCompleteWorkbookFromTemplate } from "./excel-template-export";
import { generatePDF } from "./pdf-export";
import { parseExcelForDesignInput } from "./excel-parser";
import { generateCompleteDesign } from "./design-engine";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Excel Upload - Parse and Auto-generate Design (or import comprehensive workbook)
  app.post("/api/upload-design-excel", upload.single("file"), async (req: Request & { file?: any }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Parse Excel to extract design parameters
      const designInput = parseExcelForDesignInput(req.file.buffer);
      
      if (!designInput) {
        return res.status(400).json({ error: "Failed to parse Excel file. Ensure it contains hydraulic data." });
      }

      // Auto-generate complete design from input
      const designOutput = generateCompleteDesign(designInput);

      // Create project in database with design data
      const project = await storage.createProject({
        name: `Bridge Design - Span ${designInput.span}m`,
        location: "Extracted from Excel",
        district: "Auto-designed",
        engineer: "Auto-Design System",
        designData: {
          input: designInput,
          output: designOutput,
        } as any,
      });

      // Return generated design with project ID
      res.json({
        success: true,
        projectId: project.id,
        projectName: project.name,
        location: project.location,
        designInput,
        designOutput,
      });
    } catch (error) {
      console.error("Error uploading Excel:", error);
      res.status(500).json({ error: "Failed to process Excel file" });
    }
  });

  // Excel Export route (44-sheet comprehensive report)
  app.get("/api/projects/:id/export", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const designData = project.designData as any;
      const buffer = await generateCompleteExcelReport(
        designData.input,
        designData.output,
        project.name || "Bridge Design"
      );
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${project.name || "design"}_44sheet_report.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting project:", error);
      res.status(500).json({ error: "Failed to export project" });
    }
  });

  // Excel Export route with template (46 sheets, 2,336 live formulas)
  app.get("/api/projects/:id/export/excel", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const designData = project.designData as any;
      const buffer = await generateCompleteWorkbookFromTemplate(
        designData.input,
        designData.output,
        project.name || "Bridge Design"
      );
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${project.name || "design"}_46sheet_template.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      res.status(500).json({ error: "Failed to export Excel" });
    }
  });

  // PDF Export route (100+ page vetting report)
  app.get("/api/projects/:id/export-pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const designData = project.designData as any;
      if (!designData || !designData.output) {
        return res.status(400).json({ error: "Project does not have design data. Please re-generate the design." });
      }
      
      const buffer = await generatePDF(project, designData.output);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${project.name || "design"}_vetting_report.pdf"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({ error: "Failed to export PDF" });
    }
  });

  // PDF Export route alias (/api/projects/:id/export/pdf)
  app.get("/api/projects/:id/export/pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const designData = project.designData as any;
      if (!designData || !designData.output) {
        return res.status(400).json({ error: "Project does not have design data. Please re-generate the design." });
      }
      
      const buffer = await generatePDF(project, designData.output);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${project.name || "design"}_vetting_report.pdf"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({ error: "Failed to export PDF" });
    }
  });

  // Serve generated sample PDF
  app.get("/api/sample-pdf", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const pdfPath = path.join(process.cwd(), "attached_assets", "Bridge_Design_Report.pdf");
      const buffer = fs.readFileSync(pdfPath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=Bridge_Design_Report.pdf");
      res.send(buffer);
    } catch (error) {
      console.error("Error serving PDF:", error);
      res.status(500).json({ error: "PDF not found" });
    }
  });

  // Serve 49 HTML design sheets
  app.get("/api/html-sheets", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const sheetsDir = path.join(process.cwd(), "attached_assets", "html-sheets");
      const files = fs.readdirSync(sheetsDir).filter(f => f.endsWith('.html'));
      res.json({ 
        sheets: files.sort(),
        total: files.length,
        baseUrl: "/api/html-sheets/"
      });
    } catch (error) {
      console.error("Error listing sheets:", error);
      res.status(500).json({ error: "Failed to list sheets" });
    }
  });

  app.get("/api/html-sheets/:filename", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const safeFilename = req.params.filename.replace(/\.\./g, '').replace(/\//g, '');
      const filePath = path.join(process.cwd(), "attached_assets", "html-sheets", safeFilename);
      const content = fs.readFileSync(filePath, 'utf-8');
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(content);
    } catch (error) {
      console.error("Error serving sheet:", error);
      res.status(404).json({ error: "Sheet not found" });
    }
  });

  app.get("/api/html-sheets-index", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const indexPath = path.join(process.cwd(), "attached_assets", "html-sheets", "index.html");
      const content = fs.readFileSync(indexPath, 'utf-8');
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(content);
    } catch (error) {
      console.error("Error serving index:", error);
      res.status(404).json({ error: "Index not found" });
    }
  });

  // Project management routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const body = req.body;
      
      // Check if designData with input is provided
      let projectData: any = { ...body };
      if (body.designData && body.designData.input) {
        const designInput = body.designData.input;
        
        // Generate complete design
        const designOutput = generateCompleteDesign(designInput);
        
        // Flatten design data to match schema (copy input fields to top level + store full output)
        projectData.designData = {
          ...designInput,
          ...{
            input: designInput,
            output: designOutput
          }
        };
      }
      
      // Parse and validate using schema
      const validated = insertProjectSchema.parse(projectData);
      const project = await storage.createProject(validated);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.updateProject(id, req.body);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
