export default function StructuralAnalysisSheet() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">Pigeaud's Analysis (Moment Coefficients)</h3>
         <div className="text-xs font-mono bg-muted px-2 py-1 rounded">Method: Elastic Plate Theory</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Illustration of k value */}
         <div className="col-span-1 border p-4 rounded bg-white text-center">
            <div className="aspect-square bg-muted/10 rounded border border-dashed flex items-center justify-center relative mb-2">
               {/* Simple CSS drawing of Plate ratio */}
               <div className="w-3/4 h-1/2 border-2 border-primary relative">
                  <div className="absolute -top-4 w-full text-center text-xs font-mono">Ly (Span)</div>
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-mono">Lx (Width)</div>
               </div>
            </div>
            <div className="text-sm font-medium">Ratio k = B/L = 7.5/6.0 = <span className="font-bold">1.25</span></div>
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
                     <td className="p-2 border-r font-bold">0.145</td>
                     <td className="p-2 font-bold">0.082</td>
                  </tr>
                   <tr className="border-b">
                     <td className="p-2 border-r font-sans text-left pl-4">Class AA (Wheeled)</td>
                     <td className="p-2 border-r">0.62</td>
                     <td className="p-2 border-r">0.42</td>
                     <td className="p-2 border-r font-bold">0.168</td>
                     <td className="p-2 font-bold">0.095</td>
                  </tr>
                   <tr className="border-b">
                     <td className="p-2 border-r font-sans text-left pl-4">Class A (Train)</td>
                     <td className="p-2 border-r">0.45</td>
                     <td className="p-2 border-r">0.80</td>
                     <td className="p-2 border-r font-bold">0.112</td>
                     <td className="p-2 font-bold">0.055</td>
                  </tr>
               </tbody>
            </table>
            <div className="p-2 bg-muted/20 text-xs text-muted-foreground text-left">
               * Values interpolated from Pigeaud's curves for k=1.25 and Poisson's ratio μ=0.15
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
                     <td className="p-2 border-r">0.145</td>
                     <td className="p-2 border-r">0.082</td>
                     <td className="p-2 border-r font-bold text-blue-600">101.50</td>
                     <td className="p-2 font-bold text-green-600">57.40</td>
                  </tr>
                   <tr className="border-b hover:bg-muted/5">
                     <td className="p-2 border-r text-left font-sans">Class AA Wheeled</td>
                     <td className="p-2 border-r">400</td>
                     <td className="p-2 border-r">0.168</td>
                     <td className="p-2 border-r">0.095</td>
                     <td className="p-2 border-r font-bold text-blue-600">67.20</td>
                     <td className="p-2 font-bold text-green-600">38.00</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
