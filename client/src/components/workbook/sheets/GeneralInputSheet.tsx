import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectData } from "@/pages/Workbook";

interface GeneralInputSheetProps {
  data: ProjectData;
  onUpdate: (key: keyof ProjectData, value: any) => void;
}

export default function GeneralInputSheet({ data, onUpdate }: GeneralInputSheetProps) {
  
  // Derived Constants for Display
  const sigma_cbc = data.fck / 3;
  const sigma_st = data.fy === 415 ? 230 : 240; // Simplified rule
  const m = 280 / (3 * sigma_cbc);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Project Info Section */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">1.1 Geometry Inputs</h3>
            <div className="grid grid-cols-3 gap-4">
               <div className="space-y-1">
                  <Label className="text-xs">Effective Span (L)</Label>
                  <div className="flex">
                    <Input 
                      className="rounded-r-none font-mono bg-yellow-50 border-primary/50" 
                      type="number"
                      value={data.span} 
                      onChange={(e) => onUpdate('span', parseFloat(e.target.value))} 
                    />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">m</div>
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-xs">Clear Width (W)</Label>
                  <div className="flex">
                    <Input 
                      className="rounded-r-none font-mono bg-yellow-50" 
                      type="number"
                      value={data.width} 
                      onChange={(e) => onUpdate('width', parseFloat(e.target.value))} 
                    />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">m</div>
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-xs">Overall Depth (D)</Label>
                  <div className="flex">
                    <Input 
                      className="rounded-r-none font-mono bg-yellow-50" 
                      type="number"
                      value={data.depth} 
                      onChange={(e) => onUpdate('depth', parseFloat(e.target.value))} 
                    />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">mm</div>
                  </div>
               </div>
            </div>
          </section>
          
          <section className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">1.2 Material Specifications</h3>
             <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="col-span-3 grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <Label className="text-xs">Concrete Grade (fck)</Label>
                      <Select 
                        value={data.fck.toString()} 
                        onValueChange={(v) => onUpdate('fck', parseInt(v))}
                      >
                        <SelectTrigger className="h-9 text-sm bg-yellow-50 border-primary/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">M20</SelectItem>
                          <SelectItem value="25">M25</SelectItem>
                          <SelectItem value="30">M30</SelectItem>
                          <SelectItem value="35">M35</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                   
                   <div className="space-y-1">
                      <Label className="text-xs">Steel Grade (fy)</Label>
                      <Select 
                        value={data.fy.toString()} 
                        onValueChange={(v) => onUpdate('fy', parseInt(v))}
                      >
                        <SelectTrigger className="h-9 text-sm bg-yellow-50 border-primary/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="415">Fe415</SelectItem>
                          <SelectItem value="500">Fe500</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Quick Output / Summary Sidebar within Sheet */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 p-4 rounded-sm space-y-4">
             <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
               Live Calculations (Auto)
             </h4>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-muted-foreground">σ_cbc (Calc)</span>
                 <span className="font-mono font-bold">{sigma_cbc.toFixed(2)} MPa</span>
               </div>
                <div className="flex justify-between">
                 <span className="text-muted-foreground">σ_st (Calc)</span>
                 <span className="font-mono font-bold">{sigma_st.toFixed(2)} MPa</span>
               </div>
                <div className="flex justify-between">
                 <span className="text-muted-foreground">Modular Ratio (m)</span>
                 <span className="font-mono font-bold">{m.toFixed(2)}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
