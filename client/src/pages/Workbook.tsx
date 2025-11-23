import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import WorkbookSidebar, { SHEET_GROUPS } from "@/components/workbook/WorkbookSidebar";
import GeneralInputSheet from "../components/workbook/sheets/GeneralInputSheet";
import LoadAnalysisSheet from "../components/workbook/sheets/LoadAnalysisSheet";
import LiveLoadSheet from "../components/workbook/sheets/LiveLoadSheet";
import StructuralAnalysisSheet from "../components/workbook/sheets/StructuralAnalysisSheet";
import DesignSheet from "../components/workbook/sheets/DesignSheet";
import DefaultSheet from "../components/workbook/sheets/DefaultSheet";
import OutputDataSheet from "../components/workbook/sheets/OutputDataSheet";
import PDFPreviewSheet from "../components/workbook/sheets/PDFPreviewSheet";
import HydraulicsSheet from "../components/workbook/sheets/HydraulicsSheet";
import PierDesignSheet from "../components/workbook/sheets/PierDesignSheet";
import AbutmentDesignSheet from "../components/workbook/sheets/AbutmentDesignSheet";
import InputDataSheet from "../components/workbook/sheets/InputDataSheet";
import { getProject, updateProject, exportProjectAsExcel, exportProjectAsPDF } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, FileText } from "lucide-react";
import { toast } from "sonner";

// Initial Engineering State - Submersible Skew Bridge
const INITIAL_PROJECT_DATA = {
  // Slab geometry
  span: 30.0,
  width: 7.5,
  supportWidth: 400,
  wearingCoat: 80,
  fck: 25,
  fy: 415,
  loadClass: "Class AA",
  depth: 550,
  cover: 40,
  
  // Hydraulics
  discharge: 902.15,
  floodLevel: 100.6,
  crossSectionalArea: 490.3,
  velocity: 1.84,
  afflux: 0.45,
  
  // Pier Design
  pierWidth: 1.2,
  numberOfPiers: 11,
  pierDepth: 2.5,
  
  // Abutment Design
  abutmentHeight: 5.5,
  abutmentWidth: 2.8,
  baseWidth: 3.0,
  stabilityFOS: 1.5,
  
  designType: "Submersible Skew Bridge",
};

export type ProjectData = typeof INITIAL_PROJECT_DATA;

export default function WorkbookLayout() {
  const [match, params] = useRoute("/workbook/:id");
  const projectId = params?.id ? parseInt(params.id) : null;
  const queryClient = useQueryClient();

  const [activeSheetId, setActiveSheetId] = useState("1.1");
  const [projectData, setProjectData] = useState<any>(INITIAL_PROJECT_DATA);
  const [fullDesignData, setFullDesignData] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });

  const saveMutation = useMutation({
    mutationFn: (data: ProjectData) =>
      updateProject(projectId!, { designData: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setHasUnsavedChanges(false);
    },
  });

  // Load project data when it's fetched - store FULL design data with output
  useEffect(() => {
    if (project?.designData) {
      setProjectData(project.designData as ProjectData);
      setFullDesignData(project.designData); // Store full data including output
    }
  }, [project]);

  // Auto-save on data change (debounced)
  useEffect(() => {
    if (!hasUnsavedChanges || !projectId) return;
    
    const timer = setTimeout(() => {
      saveMutation.mutate(projectData);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [projectData, hasUnsavedChanges, projectId]);

  const updateProjectData = (key: keyof ProjectData, value: any) => {
    setProjectData((prev: any) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleManualSave = () => {
    if (projectId) {
      saveMutation.mutate(projectData);
    }
  };

  const handleExportExcel = async () => {
    if (!projectId || !project) return;
    try {
      await exportProjectAsExcel(projectId, project.name);
      toast.success("Excel report exported successfully!");
    } catch (error) {
      toast.error("Failed to export Excel report");
    }
  };

  const handleExportPDF = async () => {
    if (!projectId || !project) return;
    try {
      await exportProjectAsPDF(projectId, project.name);
      toast.success("PDF vetting report exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF report");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  const activeSheetInfo = SHEET_GROUPS
    .flatMap(g => g.sheets)
    .find(s => s.id === activeSheetId);

  const handleRecalculate = () => {
    // Trigger recalculation - data is already updated via updateProjectData
    setHasUnsavedChanges(true);
  };

  const renderSheetContent = () => {
    switch (activeSheetId) {
      // PDF Preview Sheet - Display full PDF report preview
      case "0.0":
        return <PDFPreviewSheet data={fullDesignData} onExportPDF={handleExportPDF} />;
      
      // Output Data Sheet - Display 47-sheet Excel output
      case "0.0.1":
        return <OutputDataSheet data={fullDesignData} />;
      
      // Input Data Sheet - Main parameter entry
      case "0.1":
        return <InputDataSheet data={projectData} onUpdate={updateProjectData} onRecalculate={handleRecalculate} />;
      
      // General Input
      case "1.1":
      case "1.2":
      case "1.3":
        return <GeneralInputSheet data={projectData} onUpdate={updateProjectData} />;
      
      // Hydraulics
      case "2.1":
      case "2.2":
      case "2.3":
      case "2.4":
      case "2.5":
        return <HydraulicsSheet data={projectData} onUpdate={updateProjectData} />;
      
      // Pier Design
      case "3.1":
      case "3.2":
      case "3.3":
      case "3.4":
      case "3.5":
      case "3.6":
      case "3.7":
      case "3.8":
        return <PierDesignSheet data={projectData} onUpdate={updateProjectData} />;
      
      // Abutment Design
      case "4.1":
      case "4.2":
      case "4.3":
      case "4.4":
      case "4.5":
      case "4.6":
      case "4.7":
      case "4.8":
        return <AbutmentDesignSheet data={projectData} onUpdate={updateProjectData} />;
      
      // Structural Analysis
      case "5.1":
      case "5.2":
      case "5.3":
      case "5.4":
        return <StructuralAnalysisSheet data={projectData} />;
      
      default:
        return <DefaultSheet sheetName={activeSheetInfo?.label || "Sheet"} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      <WorkbookSidebar activeSheet={activeSheetId} onNavigate={setActiveSheetId} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 border-b flex items-center justify-between px-6 bg-card shrink-0">
           <div className="flex items-center gap-4">
             <Button
               variant="ghost"
               size="sm"
               onClick={() => window.location.href = "/"}
               data-testid="button-back-to-projects"
             >
               <ArrowLeft className="h-4 w-4 mr-2" />
               Projects
             </Button>
             <div className="h-6 w-px bg-border" />
             <div className="flex items-center gap-2">
               <span className="text-muted-foreground font-mono text-sm">Sheet {activeSheetId}:</span>
               <h1 className="font-semibold">{activeSheetInfo?.label}</h1>
             </div>
           </div>
           <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-mono">
                <span>L={(projectData?.span || 6)}m</span>
                <span>fck=M{projectData?.fck || 25}</span>
              </div>
              <div className="flex items-center gap-2">
                <div>Auto-Calc: ON</div>
                {hasUnsavedChanges && (
                  <span className="text-orange-600">● Unsaved</span>
                )}
                {saveMutation.isPending && (
                  <span className="text-blue-600">Saving...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  data-testid="button-export-pdf"
                  title="Export 100+ page PDF vetting report"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExcel}
                  data-testid="button-export-excel"
                  title="Export 44-sheet Excel report"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSave}
                  disabled={!hasUnsavedChanges || saveMutation.isPending}
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
           </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-muted/5 p-6">
           <div className="max-w-[1400px] mx-auto min-h-full bg-white border shadow-sm rounded-sm overflow-hidden flex flex-col">
              <div className="h-8 border-b bg-muted/20 flex items-center px-2 gap-2 text-sm shrink-0">
                 <div className="w-8 text-center font-mono text-muted-foreground border-r">fx</div>
                 <div className="flex-1 font-mono bg-white border h-6 flex items-center px-2 text-xs text-muted-foreground">
                    {`=LINKED_VALUE('1.1'!$C$4)`}
                 </div>
              </div>
              <div className="flex-1 overflow-auto p-8">
                {renderSheetContent()}
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}
