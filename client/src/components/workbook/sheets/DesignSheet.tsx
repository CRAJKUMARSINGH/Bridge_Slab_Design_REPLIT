import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { ProjectData } from "@/pages/Workbook";

interface DesignSheetProps {
  data: ProjectData;
}

export default function DesignSheet({ data }: DesignSheetProps) {
  // --- LIVE ENGINEERING LOGIC ---
  // 1. Depth Check
  // Approx Mu (simplified) for demo reactivity:
  // Mu ~ (w*L^2)/8 + LL_Factor
  const w_dl = (data.depth/1000 * 25) + (data.wearingCoat/1000 * 22);
  const mu_dl = (w_dl * Math.pow(data.span, 2)) / 8;
  const mu_ll = 80 + (data.span * 12); // Mock LL function
  const mu_total = (mu_dl * 1.35) + (mu_ll * 1.5); // Factored

  const d_provided = data.depth - data.cover;
  
  // Mulim = Q * b * d^2
  // Q for M25/Fe415 ~ 2.76
  const Q = 2.76; 
  // d_req = sqrt(Mu / (Q*b))
  const d_required = Math.sqrt((mu_total * 1000000) / (Q * 1000));

  const isDepthSafe = d_provided > d_required;

  // 2. Steel Calculation
  // Ast approx = Mu / (0.87 * fy * 0.9 * d)
  const ast_required = (mu_total * 1000000) / (0.87 * data.fy * 0.9 * d_provided);
  
  // Mock provided steel
  const bar_dia = 20;
  const bar_spacing = 150;
  const ast_provided = (1000 / bar_spacing) * (Math.PI * Math.pow(bar_dia, 2) / 4);
  const isSteelSafe = ast_provided > ast_required;
  
  // 3. Distribution Steel Logic
  // Min steel = 0.12% of bD (for HYSD bars) or 0.15% (for Mild Steel)
  const min_steel_percent = data.fy >= 415 ? 0.12 : 0.15;
  const ast_dist_req = (min_steel_percent / 100) * 1000 * data.depth;
  
  // Mock Dist Provided
  const dist_dia = 10;
  const dist_spacing = 200;
  const ast_dist_prov = (1000 / dist_spacing) * (Math.PI * Math.pow(dist_dia, 2) / 4);
  const isDistSafe = ast_dist_prov > ast_dist_req;

  // 4. Shear Check Logic
  // Vu approx (simplified)
  const vu_dl = (w_dl * data.span) / 2;
  const vu_ll = 120; // Mock LL shear
  const vu_total = (vu_dl * 1.35) + (vu_ll * 1.5);
  
  const tv = (vu_total * 1000) / (1000 * d_provided); // Nominal Shear Stress
  // Tc depends on 100Ast/bd and fck. Simplified here.
  const pt = (ast_provided / (1000 * d_provided)) * 100;
  const tc = 0.2 + (Math.sqrt(data.fck)/10); // Very rough approx for demo
  const isShearSafe = tv < tc;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">5.0 Structural Design & Checks</h3>
        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">Method: Limit State Design (IRC:112)</div>
      </div>

      <Tabs defaultValue="depth" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="depth">5.1 Depth Check</TabsTrigger>
          <TabsTrigger value="main_steel">5.2 Main Steel</TabsTrigger>
          <TabsTrigger value="dist_steel">5.3 Dist. Steel</TabsTrigger>
          <TabsTrigger value="shear">5.4 Shear Check</TabsTrigger>
        </TabsList>

        <TabsContent value="depth" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Required Depth Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                   <Label className="text-xs">Factored Bending Moment (Mu)</Label>
                   <div className="flex items-center gap-2">
                     <Input className="w-24 h-8 text-right font-mono bg-muted/20" value={mu_total.toFixed(2)} readOnly />
                     <span className="text-xs text-muted-foreground w-8">kNm</span>
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <Label className="text-xs">Limiting Moment Factor (Mulim/bd²)</Label>
                   <div className="flex items-center gap-2">
                     <Input className="w-24 h-8 text-right font-mono bg-muted/20" value={Q} readOnly />
                     <span className="text-xs text-muted-foreground w-8">N/mm²</span>
                   </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold">
                   <Label className="text-sm">Required Effective Depth (d_req)</Label>
                   <div className="flex items-center gap-2">
                     <span className="text-lg font-mono text-primary">{d_required.toFixed(1)}</span>
                     <span className="text-xs text-muted-foreground w-8">mm</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Provided Depth Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                   <Label className="text-xs">Overall Depth Provided (D)</Label>
                   <div className="flex items-center gap-2">
                     <Input className="w-24 h-8 text-right font-mono bg-yellow-50" value={data.depth} readOnly />
                     <span className="text-xs text-muted-foreground w-8">mm</span>
                   </div>
                </div>
                 <div className="flex justify-between items-center">
                   <Label className="text-xs">Effective Cover (d')</Label>
                   <div className="flex items-center gap-2">
                     <Input className="w-24 h-8 text-right font-mono bg-yellow-50" value={data.cover} readOnly />
                     <span className="text-xs text-muted-foreground w-8">mm</span>
                   </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                   <Label className="text-sm font-bold">Provided Effective Depth (d_prov)</Label>
                   <div className="flex items-center gap-2">
                     <span className="text-lg font-mono font-bold">{d_provided.toFixed(1)}</span>
                     <span className="text-xs text-muted-foreground w-8">mm</span>
                   </div>
                </div>
                
                {isDepthSafe ? (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-3 text-green-800">
                     <CheckCircle2 className="h-5 w-5" />
                     <div className="text-sm font-medium">SAFE: d_prov ({d_provided}mm) &gt; d_req ({d_required.toFixed(1)}mm)</div>
                  </div>
                ) : (
                   <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-3 text-red-800">
                     <AlertTriangle className="h-5 w-5" />
                     <div className="text-sm font-medium">UNSAFE: Increase Depth! ({d_provided} &lt; {d_required.toFixed(1)})</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="main_steel" className="space-y-4">
          <div className="border rounded-sm overflow-hidden">
             <table className="w-full text-sm">
               <thead className="bg-muted/80 text-xs uppercase tracking-wider font-medium text-left">
                 <tr>
                   <th className="p-3 border-b">Parameter</th>
                   <th className="p-3 border-b">Formula/Logic</th>
                   <th className="p-3 border-b w-32 text-right">Value</th>
                   <th className="p-3 border-b w-16">Unit</th>
                 </tr>
               </thead>
               <tbody className="font-mono text-xs">
                 <tr className="border-b">
                    <td className="p-3 font-sans">Moment (Mu)</td>
                    <td className="p-3 text-muted-foreground">Factored Design Moment</td>
                    <td className="p-3 text-right font-bold">{mu_total.toFixed(2)}</td>
                    <td className="p-3 text-muted-foreground">kNm</td>
                 </tr>
                 <tr className="border-b bg-yellow-50/30">
                    <td className="p-3 font-sans">Bar Diameter (Φ)</td>
                    <td className="p-3 text-muted-foreground">Proposed Reinforcement Dia</td>
                    <td className="p-3 text-right"><Input className="h-6 w-20 text-right text-xs ml-auto bg-yellow-50" defaultValue="20" /></td>
                    <td className="p-3 text-muted-foreground">mm</td>
                 </tr>
                 <tr className="border-b bg-yellow-50/30">
                    <td className="p-3 font-sans">Spacing Provided (s)</td>
                    <td className="p-3 text-muted-foreground">Center to Center Spacing</td>
                    <td className="p-3 text-right"><Input className="h-6 w-20 text-right text-xs ml-auto bg-yellow-50" defaultValue="150" /></td>
                    <td className="p-3 text-muted-foreground">mm</td>
                 </tr>
                 <tr className="border-b">
                    <td className="p-3 font-sans">Area Provided (Ast_prov)</td>
                    <td className="p-3 text-muted-foreground">(1000/s) * (π*Φ²/4)</td>
                    <td className="p-3 text-right font-bold text-blue-600">{ast_provided.toFixed(0)}</td>
                    <td className="p-3 text-muted-foreground">mm²</td>
                 </tr>
                  <tr className="border-b">
                    <td className="p-3 font-sans">Area Required (Ast_req)</td>
                    <td className="p-3 text-muted-foreground">Approx Formula</td>
                    <td className="p-3 text-right font-bold">{ast_required.toFixed(0)}</td>
                    <td className="p-3 text-muted-foreground">mm²</td>
                 </tr>
                 <tr className={isSteelSafe ? "bg-green-50" : "bg-red-50"}>
                    <td className="p-3 font-sans font-bold text-green-800">Check Status</td>
                    <td className="p-3" colSpan={3}>
                       {isSteelSafe ? (
                           <span className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-4 w-4"/> Ast Provided &gt; Ast Required (OK)</span>
                       ) : (
                           <span className="flex items-center gap-2 text-red-700"><AlertTriangle className="h-4 w-4"/> UNSAFE: Provide more steel</span>
                       )}
                    </td>
                 </tr>
               </tbody>
             </table>
          </div>
        </TabsContent>
        
        <TabsContent value="dist_steel" className="space-y-4">
           <div className="border rounded p-6 flex flex-col items-center justify-center text-center space-y-4">
              <h3 className="font-medium">5.3 Distribution Reinforcement Calculation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-4 text-left">
                 <div className="space-y-4 border p-4 rounded bg-muted/10">
                    <h4 className="font-bold text-xs uppercase text-primary">Requirement</h4>
                    <div className="flex justify-between text-sm border-b pb-2">
                       <span>Min Steel % ({data.fy >= 415 ? "HYSD" : "Mild"})</span>
                       <span className="font-mono font-bold">{min_steel_percent}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span>Min Area Req (Ast_min)</span>
                       <span className="font-mono font-bold">{ast_dist_req.toFixed(0)} mm²</span>
                    </div>
                 </div>

                 <div className="space-y-4 border p-4 rounded bg-muted/10">
                     <h4 className="font-bold text-xs uppercase text-primary">Provision</h4>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <Label className="text-xs">Diameter</Label>
                          <Input className="font-mono bg-yellow-50 h-8" defaultValue="10" />
                       </div>
                       <div className="space-y-1">
                          <Label className="text-xs">Spacing</Label>
                          <Input className="font-mono bg-yellow-50 h-8" defaultValue="200" />
                       </div>
                    </div>
                     <div className="flex justify-between text-sm pt-2 border-t">
                       <span>Area Provided</span>
                       <span className="font-mono font-bold text-blue-600">{ast_dist_prov.toFixed(0)} mm²</span>
                    </div>
                 </div>
              </div>
              
               {isDistSafe ? (
                  <div className="w-full max-w-4xl p-3 bg-green-50 border border-green-200 rounded flex items-center justify-center gap-3 text-green-800 text-sm font-medium">
                     <CheckCircle2 className="h-5 w-5" />
                     SAFE: {ast_dist_prov.toFixed(0)} &gt; {ast_dist_req.toFixed(0)} mm²
                  </div>
                ) : (
                   <div className="w-full max-w-4xl p-3 bg-red-50 border border-red-200 rounded flex items-center justify-center gap-3 text-red-800 text-sm font-medium">
                     <AlertTriangle className="h-5 w-5" />
                     UNSAFE: Increase steel area
                  </div>
                )}
           </div>
        </TabsContent>

        <TabsContent value="shear" className="space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle className="text-sm font-medium uppercase">5.4 Shear Stress Analysis (Tv vs Tc)</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                       <div className="p-3 border rounded">
                          <div className="text-muted-foreground text-xs mb-1">Design Shear Force (Vu)</div>
                          <div className="font-mono font-bold text-lg">{vu_total.toFixed(2)} kN</div>
                          <div className="text-xs text-muted-foreground mt-1">Factored (1.35DL+1.5LL)</div>
                       </div>
                        <div className="p-3 border rounded">
                          <div className="text-muted-foreground text-xs mb-1">Nominal Shear Stress (Tv)</div>
                          <div className="font-mono font-bold text-lg">{tv.toFixed(3)} MPa</div>
                          <div className="text-xs text-muted-foreground mt-1">Vu / (b*d)</div>
                       </div>
                        <div className="p-3 border rounded bg-green-50 border-green-100">
                          <div className="text-green-800 text-xs mb-1">Design Shear Strength (Tc)</div>
                          <div className="font-mono font-bold text-lg text-green-700">{tc.toFixed(3)} MPa</div>
                           <div className="text-xs text-green-600 mt-1">Based on 100Ast/bd = {pt.toFixed(2)}</div>
                       </div>
                    </div>
                    
                     {isShearSafe ? (
                        <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50/50">
                           <h4 className="font-bold text-green-900">Safe in Shear</h4>
                           <p className="text-sm text-green-800">Tv ({tv.toFixed(3)}) &lt; Tc ({tc.toFixed(3)}). No shear reinforcement required. Minimum stirrups may be provided.</p>
                        </div>
                     ) : (
                        <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50">
                           <h4 className="font-bold text-red-900">Unsafe in Shear!</h4>
                           <p className="text-sm text-red-800">Tv ({tv.toFixed(3)}) &gt; Tc ({tc.toFixed(3)}). Increase Depth or Provide Shear Reinforcement.</p>
                        </div>
                     )}

                    <div className="text-xs text-muted-foreground">
                       * Tc calculated approximately based on 100As/bd and Concrete Grade M{data.fck} (Table 19 of IS:456 / IRC:112)
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
