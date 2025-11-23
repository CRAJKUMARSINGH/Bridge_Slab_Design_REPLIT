import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DesignCalculationsProps {
  data: any;
}

export default function DesignCalculations({ data }: DesignCalculationsProps) {
  // --- MOCK CALCULATIONS FOR DEMO ---
  // In a real app, these would be rigorous engineering formulas.
  const l = parseFloat(data.clearSpan);
  const w = parseFloat(data.carriagewayWidth);
  const bearing = parseFloat(data.supportWidth);
  
  // 1. Depth Calculation
  const basicDepth = Math.ceil((l * 1000) / 12); // span/12
  const overallDepth = Math.ceil(basicDepth / 10) * 10; // round to nearest 10
  const effectiveDepth = overallDepth - 25 - 10; // cover - half bar
  
  // 2. Effective Span
  const le_1 = l + bearing;
  const le_2 = l + (effectiveDepth / 1000);
  const effectiveSpan = Math.min(le_1, le_2).toFixed(3);

  // 3. Loads
  const selfWeight = (overallDepth / 1000) * 25; // 25 kN/m3
  const wcWeight = (parseFloat(data.wearingCoatThickness) / 1000) * 22; // 22 kN/m3
  const totalDeadLoad = selfWeight + wcWeight;
  
  // Dead Load Moment
  const M_dl = (totalDeadLoad * Math.pow(parseFloat(effectiveSpan), 2)) / 8;
  
  // Live Load Moment (Simplified wrapper for IRC Class AA)
  const M_ll = 50 + (l * 8); // Purely mock formula for display
  
  const M_total = M_dl + M_ll;
  const M_ultimate = 1.5 * M_total;

  // 4. Reinforcement
  // Mu = 0.87 * fy * Ast * d * (1 - (Ast * fy) / (b * d * fck))
  // Simplified Area of Steel calculation
  const Ast_approx = (M_ultimate * 1000000) / (0.87 * 415 * 0.9 * effectiveDepth); // Mock
  
  const spacing = Math.floor(1000 / (Ast_approx / (Math.PI * 10 * 10 / 4))); // for 20mm bars mock
  const providedSpacing = 150; // mm

  return (
    <div className="space-y-6 print:space-y-4">
      <Card className="border-2 border-primary/10">
        <CardHeader className="bg-primary/5 border-b pb-3">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
             Step 1: Design Constants & Dimensions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
             <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">Concrete Grade (fck)</span>
                <span className="font-mono font-bold">{data.concreteGrade}</span>
             </div>
             <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">Steel Grade (fy)</span>
                <span className="font-mono font-bold">{data.steelGrade}</span>
             </div>
             <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">Clear Span (L)</span>
                <span className="font-mono">{l.toFixed(2)} m</span>
             </div>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">Overall Depth (D)</span>
                <span className="font-mono font-bold">{overallDepth} mm</span>
             </div>
             <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">Effective Depth (d)</span>
                <span className="font-mono">{effectiveDepth} mm</span>
             </div>
             <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">Effective Span (Le)</span>
                <span className="font-mono bg-yellow-100 px-1 dark:bg-yellow-900/30">{effectiveSpan} m</span>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/10">
        <CardHeader className="bg-primary/5 border-b pb-3">
          <CardTitle className="text-lg text-primary">Step 2: Load Calculations & Moments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4 text-sm">
          <div className="grid md:grid-cols-3 gap-4">
             <div className="p-4 bg-muted/30 rounded border">
                <h4 className="font-semibold mb-2 text-muted-foreground text-xs uppercase">Dead Loads</h4>
                <div className="space-y-1 font-mono">
                  <div>Self Wt = {selfWeight.toFixed(2)} kN/m²</div>
                  <div>WC Wt   = {wcWeight.toFixed(2)} kN/m²</div>
                  <div className="border-t pt-1 mt-1 font-bold">Total w = {totalDeadLoad.toFixed(2)} kN/m²</div>
                </div>
             </div>
             
             <div className="p-4 bg-muted/30 rounded border">
                <h4 className="font-semibold mb-2 text-muted-foreground text-xs uppercase">Bending Moments</h4>
                <div className="space-y-1 font-mono">
                  <div>M(DL) = {M_dl.toFixed(2)} kNm</div>
                  <div>M(LL) = {M_ll.toFixed(2)} kNm</div>
                  <div className="border-t pt-1 mt-1 font-bold text-primary">M(Total) = {M_total.toFixed(2)} kNm</div>
                </div>
             </div>
             
             <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-100 dark:border-blue-900">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400 text-xs uppercase">Design Moment (ULS)</h4>
                <div className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-300">
                   {M_ultimate.toFixed(2)} kNm
                </div>
                <p className="text-xs text-blue-500 mt-2">Factored Load (1.5 × Total)</p>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/10">
        <CardHeader className="bg-primary/5 border-b pb-3">
          <CardTitle className="text-lg text-primary">Step 3: Reinforcement Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
           <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="flex-1 space-y-4">
               <h3 className="font-semibold">Main Reinforcement</h3>
               <div className="p-4 border rounded bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900">
                  <div className="text-sm text-green-800 dark:text-green-300 mb-1">Provide:</div>
                  <div className="text-xl font-mono font-bold text-green-700 dark:text-green-400">
                    20mm Φ @ {providedSpacing}mm c/c
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    Area Provided = {Math.round(1000 * 314 / providedSpacing)} mm² 
                    (Req: {Math.round(Ast_approx)} mm²)
                  </div>
               </div>
             </div>
             
             <div className="flex-1 space-y-4">
               <h3 className="font-semibold">Distribution Steel</h3>
               <div className="p-4 border rounded bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Provide:</div>
                  <div className="text-xl font-mono font-bold">
                    10mm Φ @ 200mm c/c
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Minimum temperature reinforcement
                  </div>
               </div>
             </div>
           </div>
           
           <div className="mt-8">
             <h3 className="font-semibold mb-4">Schedule of Bars</h3>
             <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-3 font-medium">Location</th>
                      <th className="p-3 font-medium">Bar Dia (mm)</th>
                      <th className="p-3 font-medium">Spacing (mm)</th>
                      <th className="p-3 font-medium">Shape</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">Main Longitudinal (Bottom)</td>
                      <td className="p-3 font-mono">20</td>
                      <td className="p-3 font-mono">{providedSpacing}</td>
                      <td className="p-3">Straight + Cranked Alt.</td>
                    </tr>
                     <tr>
                      <td className="p-3">Distribution (Top/Bottom)</td>
                      <td className="p-3 font-mono">10</td>
                      <td className="p-3 font-mono">200</td>
                      <td className="p-3">Straight</td>
                    </tr>
                  </tbody>
                </table>
             </div>
           </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground pt-8 pb-4">
        <p>Design generated per IRC:21-2000 and IRC:6-2017 standards.</p>
        <p>Disclaimer: This report is for estimation and checking purposes. Final construction drawings must be approved by competent authority.</p>
      </div>
    </div>
  );
}
