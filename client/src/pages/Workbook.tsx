import { useState } from "react";
import WorkbookSidebar, { SHEET_GROUPS } from "@/components/workbook/WorkbookSidebar";
import GeneralInputSheet from "@/components/workbook/sheets/GeneralInputSheet";
import LoadAnalysisSheet from "@/components/workbook/sheets/LoadAnalysisSheet";
import StructuralAnalysisSheet from "@/components/workbook/sheets/StructuralAnalysisSheet";
import DefaultSheet from "@/components/workbook/sheets/DefaultSheet";

export default function WorkbookLayout() {
  const [activeSheetId, setActiveSheetId] = useState("1.1");

  const activeSheetInfo = SHEET_GROUPS
    .flatMap(g => g.sheets)
    .find(s => s.id === activeSheetId);

  const renderSheetContent = () => {
    switch (activeSheetId) {
      case "1.1":
      case "1.2":
      case "1.3":
        return <GeneralInputSheet />;
      case "2.1":
      case "2.2":
      case "2.5":
        return <LoadAnalysisSheet />;
      case "4.2":
      case "4.3":
      case "4.7":
        return <StructuralAnalysisSheet />;
      default:
        return <DefaultSheet sheetName={activeSheetInfo?.label || "Sheet"} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      <WorkbookSidebar activeSheet={activeSheetId} onNavigate={setActiveSheetId} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 border-b flex items-center justify-between px-6 bg-card shrink-0">
           <div className="flex items-center gap-2">
             <span className="text-muted-foreground font-mono text-sm">Sheet {activeSheetId}:</span>
             <h1 className="font-semibold">{activeSheetInfo?.label}</h1>
           </div>
           <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div>Last Auto-save: 10:42 AM</div>
           </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-muted/5 p-6">
           <div className="max-w-[1400px] mx-auto min-h-full bg-white border shadow-sm rounded-sm overflow-hidden flex flex-col">
              {/* Excel-like formula bar decoration */}
              <div className="h-8 border-b bg-muted/20 flex items-center px-2 gap-2 text-sm shrink-0">
                 <div className="w-8 text-center font-mono text-muted-foreground border-r">fx</div>
                 <div className="flex-1 font-mono bg-white border h-6 flex items-center px-2 text-xs text-muted-foreground">
                    {`=IF(D4>0, D4*CONSTANTS!$B$2, 0)`}
                 </div>
              </div>
              
              {/* Sheet Content Area */}
              <div className="flex-1 overflow-auto p-8">
                {renderSheetContent()}
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}
