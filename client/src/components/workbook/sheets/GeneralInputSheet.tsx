import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function GeneralInputSheet() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Project Info Section */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">Project Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Project Name</Label>
                <Input defaultValue="Chitorgarh PWD Bridge #42" className="font-medium" />
              </div>
               <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Location / Chainage</Label>
                <Input defaultValue="km 14.500 on SH-12" />
              </div>
               <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">District</Label>
                <Input defaultValue="Chitorgarh" />
              </div>
               <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Design Engineer</Label>
                <Input defaultValue="C. Rajkumar Singh" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">Geometry Inputs</h3>
            <div className="grid grid-cols-3 gap-4">
               <div className="space-y-1">
                  <Label className="text-xs">Effective Span (L)</Label>
                  <div className="flex">
                    <Input className="rounded-r-none font-mono bg-yellow-50" defaultValue="6.00" />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">m</div>
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-xs">Clear Width (W)</Label>
                  <div className="flex">
                    <Input className="rounded-r-none font-mono bg-yellow-50" defaultValue="7.50" />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">m</div>
                  </div>
               </div>
                <div className="space-y-1">
                  <Label className="text-xs">Kerb Width</Label>
                  <div className="flex">
                    <Input className="rounded-r-none font-mono bg-yellow-50" defaultValue="0.60" />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">m</div>
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-xs">Wearing Coat</Label>
                  <div className="flex">
                    <Input className="rounded-r-none font-mono bg-yellow-50" defaultValue="80" />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">mm</div>
                  </div>
               </div>
               <div className="space-y-1">
                  <Label className="text-xs">Support Width</Label>
                  <div className="flex">
                    <Input className="rounded-r-none font-mono bg-yellow-50" defaultValue="400" />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">mm</div>
                  </div>
               </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cross Camber</Label>
                  <div className="flex">
                    <Input className="rounded-r-none font-mono bg-yellow-50" defaultValue="2.5" />
                    <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md text-muted-foreground">%</div>
                  </div>
               </div>
            </div>
          </section>
          
          <section className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">Material Properties</h3>
             <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="col-span-3 grid grid-cols-4 gap-px bg-border border">
                   <div className="bg-muted/50 p-2 font-medium">Material</div>
                   <div className="bg-muted/50 p-2 font-medium">Grade</div>
                   <div className="bg-muted/50 p-2 font-medium">Density (kN/m³)</div>
                   <div className="bg-muted/50 p-2 font-medium">Modulus (E)</div>
                   
                   <div className="bg-white p-2">Concrete</div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="M25" /></div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="25.00" /></div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="25000" /></div>
                   
                   <div className="bg-white p-2">Steel</div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="Fe415" /></div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="78.50" /></div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="200000" /></div>
                   
                   <div className="bg-white p-2">Wearing Coat</div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="Asphalt" /></div>
                   <div className="bg-white p-2"><Input className="h-7 text-xs font-mono bg-yellow-50" defaultValue="22.00" /></div>
                   <div className="bg-white p-2 bg-muted/10">-</div>
                </div>
             </div>
          </section>
        </div>

        {/* Quick Output / Summary Sidebar within Sheet */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 p-4 rounded-sm space-y-4">
             <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
               Design Constants (Auto)
             </h4>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-muted-foreground">σ_cbc (Permissible Comp)</span>
                 <span className="font-mono font-bold">8.33 MPa</span>
               </div>
                <div className="flex justify-between">
                 <span className="text-muted-foreground">σ_st (Permissible Tens)</span>
                 <span className="font-mono font-bold">230 MPa</span>
               </div>
                <div className="flex justify-between">
                 <span className="text-muted-foreground">Modular Ratio (m)</span>
                 <span className="font-mono font-bold">10.98</span>
               </div>
                <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                 <span className="text-muted-foreground">Neutral Axis Depth (k)</span>
                 <span className="font-mono font-bold">0.289 d</span>
               </div>
                <div className="flex justify-between">
                 <span className="text-muted-foreground">Lever Arm Factor (j)</span>
                 <span className="font-mono font-bold">0.904</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Moment Factor (Q)</span>
                 <span className="font-mono font-bold">1.09</span>
               </div>
             </div>
          </div>

           <div className="bg-muted p-4 rounded-sm text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold mb-2">Note on Inputs:</p>
              <p>Yellow cells indicate editable input fields. White cells are computed automatically. Ensure geometry matches the General Arrangement Drawing (GAD) before proceeding to Load Analysis.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
