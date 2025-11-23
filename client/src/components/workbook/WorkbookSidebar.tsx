import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Calculator, 
  Ruler, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Table as TableIcon, 
  FileText, 
  Settings,
  ChevronRight,
  FolderOpen,
  Save,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SheetNavProps {
  activeSheet: string;
  onNavigate: (sheetId: string) => void;
}

export const SHEET_GROUPS = [
  {
    title: "📊 DESIGN OUTPUT - 47-Sheet Report",
    icon: FileSpreadsheet,
    sheets: [
      { id: "0.0", name: "Output_Summary", label: "Design Output Summary" },
    ]
  },
  {
    title: "⚡ INPUT DATA - Modify Parameters Here",
    icon: Settings,
    sheets: [
      { id: "0.1", name: "Input_Data", label: "Design Input Parameters" },
    ]
  },
  {
    title: "1.0 General Data & Input",
    icon: Settings,
    sheets: [
      { id: "1.1", name: "Basic_Params", label: "Global Parameters" },
      { id: "1.2", name: "Material_Specs", label: "Material Specifications" },
      { id: "1.3", name: "Geo_Hydraulic", label: "Geometric & Hydraulic" },
      { id: "1.4", name: "Permissible_Stress", label: "Permissible Stresses" },
    ]
  },
  {
    title: "2.0 Hydraulic Design",
    icon: Layers,
    sheets: [
      { id: "2.1", name: "Afflux", label: "Afflux Calculation" },
      { id: "2.2", name: "Discharge", label: "Design Discharge" },
      { id: "2.3", name: "FloodLevel", label: "Flood Level Analysis" },
      { id: "2.4", name: "FlowArea", label: "Flow Area & Velocity" },
      { id: "2.5", name: "HydroSummary", label: "Hydraulic Summary" },
    ]
  },
  {
    title: "3.0 Pier Design",
    icon: TrendingUp,
    sheets: [
      { id: "3.1", name: "Pier_Geometry", label: "Pier Geometry" },
      { id: "3.2", name: "Pier_Config", label: "Pier Configuration" },
      { id: "3.3", name: "Pier_Foundation", label: "Pier Foundation" },
      { id: "3.4", name: "Pier_Stability", label: "Stability Check" },
      { id: "3.5", name: "Pier_Forces", label: "Forces on Pier" },
      { id: "3.6", name: "Pier_Scour", label: "Scour Analysis" },
      { id: "3.7", name: "Pier_Reinforcement", label: "Reinforcement Details" },
      { id: "3.8", name: "Pier_Summary", label: "Pier Design Summary" },
    ]
  },
  {
    title: "4.0 Abutment Design",
    icon: Calculator,
    sheets: [
      { id: "4.1", name: "Abutment_Geometry", label: "Abutment Geometry" },
      { id: "4.2", name: "Abutment_Forces", label: "Earth Pressure Forces" },
      { id: "4.3", name: "Abutment_Stability", label: "Stability Check" },
      { id: "4.4", name: "Abutment_Foundation", label: "Foundation Design" },
      { id: "4.5", name: "Abutment_Bearing", label: "Bearing Capacity" },
      { id: "4.6", name: "Abutment_Settlement", label: "Settlement Analysis" },
      { id: "4.7", name: "Abutment_Reinforcement", label: "Reinforcement Details" },
      { id: "4.8", name: "Abutment_Summary", label: "Abutment Summary" },
    ]
  },
  {
    title: "5.0 Slab Structural Design",
    icon: Ruler,
    sheets: [
      { id: "5.1", name: "Depth_Check", label: "Check for Depth" },
      { id: "5.2", name: "Reinf_Main", label: "Main Reinforcement" },
      { id: "5.3", name: "Reinf_Dist", label: "Distribution Steel" },
      { id: "5.4", name: "Shear_Check", label: "Check for Shear" },
    ]
  },
  {
    title: "6.0 Detailing & Drawings",
    icon: LayoutDashboard,
    sheets: [
      { id: "6.1", name: "BBS_Slab", label: "BBS - Main Slab" },
      { id: "6.2", name: "BBS_Kerb", label: "BBS - Kerb/Railing" },
      { id: "6.3", name: "Dwg_Plan", label: "Drawing - Plan" },
      { id: "6.4", name: "Dwg_Section", label: "Drawing - Section" },
      { id: "6.5", name: "Dwg_Reinf", label: "Drawing - Reinforcement" },
    ]
  },
  {
    title: "7.0 Quantity & Estimation",
    icon: FileSpreadsheet,
    sheets: [
      { id: "7.1", name: "Qty_Conc", label: "Quantity - Concrete" },
      { id: "7.2", name: "Qty_Steel", label: "Quantity - Steel" },
      { id: "7.3", name: "Qty_Formwork", label: "Quantity - Formwork" },
      { id: "7.4", name: "Rate_Analysis", label: "Rate Analysis" },
      { id: "7.5", name: "Abstract_Cost", label: "Abstract of Cost" },
      { id: "7.6", name: "Summary", label: "Project Summary" },
    ]
  }
];

export default function WorkbookSidebar({ activeSheet, onNavigate }: SheetNavProps) {
  return (
    <div className="w-80 border-r bg-muted/10 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <FolderOpen className="h-5 w-5" />
          <span>Project Workbook</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">SLAB_DESIGN_V2.4.xlsx</div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {SHEET_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                <group.icon className="h-4 w-4" />
                {group.title}
              </div>
              <div className="space-y-[2px]">
                {group.sheets.map((sheet) => (
                  <Button
                    key={sheet.id}
                    variant={activeSheet === sheet.id ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start text-sm font-normal h-8 pl-8 relative",
                      activeSheet === sheet.id && "bg-white shadow-sm border font-medium text-primary"
                    )}
                    onClick={() => onNavigate(sheet.id)}
                  >
                     {activeSheet === sheet.id && (
                       <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                     )}
                    <span className="truncate">{sheet.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-background space-y-2">
        <Button className="w-full gap-2" size="sm">
          <Save className="h-4 w-4" /> Save Project
        </Button>
        <Button variant="outline" className="w-full gap-2" size="sm">
          <Download className="h-4 w-4" /> Export .XLSX
        </Button>
      </div>
    </div>
  );
}
