import { ProjectData } from "@/pages/Workbook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface LiveLoadSheetProps {
  data: ProjectData;
}

export default function LiveLoadSheet({ data }: LiveLoadSheetProps) {
  // Mock Live Load Logic (Simplified for visualization)
  // In real app, this would involve influence lines / Pigeaud's curves integration
  
  const impactFactor = data.loadClass === "Class AA" ? 0.1 : 0.25; // Simplified rules
  
  const loads = [
    { type: "Class AA (Tracked)", load: 700, width: 0.85, length: 3.6, m1: 0.145, m2: 0.082 },
    { type: "Class AA (Wheeled)", load: 400, width: 1.2, length: 2.5, m1: 0.168, m2: 0.095 },
    { type: "Class A (Train)", load: 554, width: 1.8, length: 18.0, m1: 0.112, m2: 0.055 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">3.0 Live Load Analysis (IRC:6-2017)</h3>
         <div className="text-xs font-mono bg-muted px-2 py-1 rounded">Current Selection: {data.loadClass}</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <Card className="md:col-span-1">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Impact Factor Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center">
                  <Label className="text-xs">Span (L)</Label>
                  <span className="font-mono font-bold">{data.span} m</span>
               </div>
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Class Type</Label>
                  <span className="font-mono font-bold">{data.loadClass}</span>
               </div>
               <Separator />
               <div className="flex justify-between items-center">
                  <Label className="text-sm font-bold text-primary">Impact Factor (I.F)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-bold text-primary">{(1 + impactFactor).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">({(impactFactor * 100)}%)</span>
                  </div>
               </div>
               <p className="text-xs text-muted-foreground mt-2">
                  * For Class AA Tracked, IF is typically 10% or 25% depending on span. 
               </p>
            </CardContent>
         </Card>

         <div className="md:col-span-2 border rounded-sm overflow-hidden">
            <table className="w-full text-sm">
               <thead className="bg-muted/80 text-xs uppercase tracking-wider font-medium text-left">
                  <tr>
                     <th className="p-3 border-b">Vehicle Type</th>
                     <th className="p-3 border-b text-right">Total Load (kN)</th>
                     <th className="p-3 border-b text-right">Impact Load (kN)</th>
                     <th className="p-3 border-b text-right">Design Load (kN)</th>
                  </tr>
               </thead>
               <tbody className="font-mono text-xs">
                  {loads.map((load, i) => (
                     <tr key={i} className="border-b hover:bg-muted/5">
                        <td className="p-3 font-sans">{load.type}</td>
                        <td className="p-3 text-right">{load.load}</td>
                        <td className="p-3 text-right">{(load.load * impactFactor).toFixed(1)}</td>
                        <td className="p-3 text-right font-bold">{(load.load * (1 + impactFactor)).toFixed(1)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
            <div className="p-4 bg-yellow-50 text-xs text-yellow-800">
               Note: The governing load case is automatically selected for Moment Calculation in Sheet 4.0 based on the maximum bending moment produced.
            </div>
         </div>
      </div>
      
      <div>
         <h4 className="text-sm font-bold uppercase mb-4">Critical Load Positions</h4>
         <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 rounded bg-white h-40 flex items-center justify-center text-muted-foreground text-xs border-dashed relative">
               <div className="absolute top-2 left-2 font-bold text-foreground">Case 1: Max Bending Moment</div>
               {/* Simple visual for load at center */}
               <div className="w-3/4 h-1 bg-muted-foreground relative">
                  <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-10 h-5 bg-primary/20 border border-primary flex items-center justify-center text-[10px]">Load</div>
                  <div className="absolute left-0 top-0 w-0.5 h-2 bg-black"></div>
                  <div className="absolute right-0 top-0 w-0.5 h-2 bg-black"></div>
               </div>
            </div>
             <div className="border p-4 rounded bg-white h-40 flex items-center justify-center text-muted-foreground text-xs border-dashed relative">
               <div className="absolute top-2 left-2 font-bold text-foreground">Case 2: Max Shear Force</div>
                {/* Simple visual for load at support */}
               <div className="w-3/4 h-1 bg-muted-foreground relative">
                  <div className="absolute top-[-20px] left-[10%] w-10 h-5 bg-primary/20 border border-primary flex items-center justify-center text-[10px]">Load</div>
                  <div className="absolute left-0 top-0 w-0.5 h-2 bg-black"></div>
                  <div className="absolute right-0 top-0 w-0.5 h-2 bg-black"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
