import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { generateExcelReport } from "./excel-export";
import { generatePDF } from "./pdf-export";
import { parseExcelForDesignInput, parseComprehensiveWorkbook } from "./excel-parser";
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

      // Try to parse as comprehensive workbook first
      const comprehensiveData = parseComprehensiveWorkbook(req.file.buffer);
      
      // Parse Excel to extract design parameters
      const designInput = parseExcelForDesignInput(req.file.buffer);
      
      if (!designInput) {
        return res.status(400).json({ error: "Failed to parse Excel file. Ensure it contains hydraulic data." });
      }

      // Auto-generate complete design from input
      const designOutput = generateCompleteDesign(designInput);

      // Create project in database with design data
      const project = await storage.createProject({
        name: comprehensiveData?.projectInfo.name || `Bridge Design - Span ${designInput.span}m`,
        location: comprehensiveData?.projectInfo.location || "Extracted from Excel",
        district: "Auto-designed",
        engineer: comprehensiveData?.projectInfo.engineer || "Auto-Design System",
        designData: {
          input: designInput,
          output: designOutput,
          workbookData: comprehensiveData, // Store all workbook sheets
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
        workbookSheets: comprehensiveData?.allSheets ? Object.keys(comprehensiveData.allSheets).length : 0,
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
      const buffer = await generateExcelReport(
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
      res.setHeader("Content-Disposition", `attachment; filename="${project.name || "design"}_vetting_report.pdf"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({ error: "Failed to export PDF" });
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
      const validated = insertProjectSchema.parse(req.body);
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
