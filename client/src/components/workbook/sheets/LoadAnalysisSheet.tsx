import { ProjectData } from "@/pages/Workbook";

interface LoadAnalysisSheetProps {
  data: ProjectData;
}

export default function LoadAnalysisSheet({ data }: LoadAnalysisSheetProps) {
  
  // Reactive Calculations
  const slabLoad = 1.0 * 1.0 * (data.depth/1000) * 25;
  const wcLoad = 1.0 * 1.0 * (data.wearingCoat/1000) * 22;
  const totalLoad = slabLoad + wcLoad; // Simplified for demo (ignoring kerb distribution)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">2.0 Dead Load Calculation Matrix</h3>
        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">Ref: IRC:6-2017 Section 202</div>
      </div>

      {/* Dense Calculation Table */}
      <div className="border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/80 text-xs uppercase tracking-wider font-medium text-left">
            <tr>
              <th className="p-3 border-b border-r w-12 text-center">#</th>
              <th className="p-3 border-b border-r">Component Description</th>
              <th className="p-3 border-b border-r w-24">Length (m)</th>
              <th className="p-3 border-b border-r w-24">Width (m)</th>
              <th className="p-3 border-b border-r w-24">Depth (m)</th>
              <th className="p-3 border-b border-r w-24">Qty</th>
              <th className="p-3 border-b border-r w-24">Density (kN/m³)</th>
              <th className="p-3 border-b w-32 text-right">Total Load (kN/m)</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            {/* Main Slab */}
            <tr className="bg-muted/5">
               <td colSpan={8} className="p-2 pl-3 font-sans font-bold text-primary border-b">2.1 Main Slab</td>
            </tr>
            <tr className="hover:bg-muted/5">
              <td className="p-3 border-b border-r text-center text-muted-foreground">1</td>
              <td className="p-3 border-b border-r font-sans">Self Weight of Slab</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">1.00</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">1.00</td>
              <td className="p-3 border-b border-r bg-yellow-50 text-center font-bold">{(data.depth/1000).toFixed(3)}</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">1</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">25.00</td>
              <td className="p-3 border-b text-right font-bold">{slabLoad.toFixed(3)}</td>
            </tr>

            {/* Wearing Coat */}
             <tr className="bg-muted/5">
               <td colSpan={8} className="p-2 pl-3 font-sans font-bold text-primary border-b border-t">2.2 Wearing Coat</td>
            </tr>
            <tr className="hover:bg-muted/5">
              <td className="p-3 border-b border-r text-center text-muted-foreground">2</td>
              <td className="p-3 border-b border-r font-sans">Asphalt Concrete</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">1.00</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">1.00</td>
              <td className="p-3 border-b border-r bg-yellow-50 text-center font-bold">{(data.wearingCoat/1000).toFixed(3)}</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">1</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">22.00</td>
              <td className="p-3 border-b text-right font-bold">{wcLoad.toFixed(3)}</td>
            </tr>

            {/* Kerbs & Parapets */}
             <tr className="bg-muted/5">
               <td colSpan={8} className="p-2 pl-3 font-sans font-bold text-primary border-b border-t">2.3 Kerbs & Railings</td>
            </tr>
            <tr className="hover:bg-muted/5">
              <td className="p-3 border-b border-r text-center text-muted-foreground">3</td>
              <td className="p-3 border-b border-r font-sans">Kerb (LHS + RHS)</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">1.00</td>
              <td className="p-3 border-b border-r bg-yellow-50 text-center">0.600</td>
              <td className="p-3 border-b border-r bg-yellow-50 text-center">0.300</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">2</td>
              <td className="p-3 border-b border-r bg-muted/10 text-center">25.00</td>
              <td className="p-3 border-b text-right font-bold">9.000</td>
            </tr>
            
            <tr className="bg-muted/20 font-bold">
              <td className="p-3 border-r border-t text-center"></td>
              <td className="p-3 border-r border-t font-sans uppercase text-primary">Total Dead Load (w)</td>
              <td className="p-3 border-r border-t"></td>
              <td className="p-3 border-r border-t"></td>
              <td className="p-3 border-r border-t"></td>
              <td className="p-3 border-r border-t"></td>
              <td className="p-3 border-r border-t"></td>
              <td className="p-3 border-t text-right text-base">{(totalLoad + 9.0).toFixed(3)} kN/m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
