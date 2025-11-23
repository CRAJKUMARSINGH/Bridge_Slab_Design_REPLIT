import { ProjectData } from "@/pages/Workbook";

interface StructuralAnalysisSheetProps {
  data: ProjectData;
}

export default function StructuralAnalysisSheet({ data }: StructuralAnalysisSheetProps) {
  
  // Reactive Calculations
  const k = data.width / data.span;
  
  // Mock Pigeaud Coefficients based on k
  // (In real app, this would be a lookup table or polynomial approx)
  const m1_track = 0.145 - (k - 1.25) * 0.05; 
  const m2_track = 0.082 + (k - 1.25) * 0.02;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">4.0 Pigeaud's Analysis (Moment Coefficients)</h3>
         <div className="text-xs font-mono bg-muted px-2 py-1 rounded">Method: Elastic Plate Theory</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Illustration of k value */}
         <div className="col-span-1 border p-4 rounded bg-white text-center">
            <div className="aspect-square bg-muted/10 rounded border border-dashed flex items-center justify-center relative mb-2">
               {/* Simple CSS drawing of Plate ratio */}
               <div className="w-3/4 h-1/2 border-2 border-primary relative">
                  <div className="absolute -top-4 w-full text-center text-xs font-mono">Ly = {data.span}m</div>
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-mono">Lx = {data.width}m</div>
               </div>
            </div>
            <div className="text-sm font-medium">Ratio k = B/L = <span className="font-bold">{k.toFixed(2)}</span></div>
         </div>

         {/* Coefficient Table */}
         <div className="col-span-2 border rounded overflow-hidden">
            <table className="w-full text-sm text-center">
               <thead className="bg-primary/5 text-xs uppercase font-semibold">
                  <tr>
                     <th className="p-2 border-b border-r" rowSpan={2}>Load Case</th>
                     <th className="p-2 border-b border-r" rowSpan={2}>u/B</th>
                     <th className="p-2 border-b border-r" rowSpan={2}>v/L</th>
                     <th className="p-2 border-b" colSpan={2}>Coefficients (Interpolated)</th>
                  </tr>
                  <tr>
                     <th className="p-2 border-b border-r bg-blue-50 text-blue-800">m1 (Long)</th>
                     <th className="p-2 border-b bg-green-50 text-green-800">m2 (Trans)</th>
                  </tr>
               </thead>
               <tbody className="font-mono text-xs">
                  <tr className="border-b">
                     <td className="p-2 border-r font-sans text-left pl-4">Class AA (Tracked)</td>
                     <td className="p-2 border-r">0.85</td>
                     <td className="p-2 border-r">0.35</td>
                     <td className="p-2 border-r font-bold text-blue-600">{m1_track.toFixed(3)}</td>
                     <td className="p-2 font-bold text-green-600">{m2_track.toFixed(3)}</td>
                  </tr>
                   <tr className="border-b">
                     <td className="p-2 border-r font-sans text-left pl-4">Class AA (Wheeled)</td>
                     <td className="p-2 border-r">0.62</td>
                     <td className="p-2 border-r">0.42</td>
                     <td className="p-2 border-r font-bold">0.168</td>
                     <td className="p-2 font-bold">0.095</td>
                  </tr>
               </tbody>
            </table>
            <div className="p-2 bg-muted/20 text-xs text-muted-foreground text-left">
               * Values interpolated dynamically based on Aspect Ratio k = {k.toFixed(2)}
            </div>
         </div>
      </div>

      <div className="mt-8">
         <h4 className="text-sm font-bold uppercase mb-4">Moment Calculation Matrix</h4>
         <div className="border rounded overflow-hidden">
            <table className="w-full text-sm text-right">
               <thead className="bg-muted text-xs">
                  <tr>
                     <th className="p-2 border-b text-left">Load Type</th>
                     <th className="p-2 border-b">Load (W) kN</th>
                     <th className="p-2 border-b">m1</th>
                     <th className="p-2 border-b">m2</th>
                     <th className="p-2 border-b">M_long (kNm)</th>
                     <th className="p-2 border-b">M_trans (kNm)</th>
                  </tr>
               </thead>
               <tbody className="font-mono text-xs">
                  <tr className="border-b hover:bg-muted/5">
                     <td className="p-2 border-r text-left font-sans">Class AA Tracked</td>
                     <td className="p-2 border-r">700</td>
                     <td className="p-2 border-r">{m1_track.toFixed(3)}</td>
                     <td className="p-2 border-r">{m2_track.toFixed(3)}</td>
                     <td className="p-2 border-r font-bold text-blue-600">{(700 * m1_track).toFixed(2)}</td>
                     <td className="p-2 font-bold text-green-600">{(700 * m2_track).toFixed(2)}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
