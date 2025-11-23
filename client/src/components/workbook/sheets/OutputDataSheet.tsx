import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OutputDataSheetProps {
  data: any;
}

export default function OutputDataSheet({ data }: OutputDataSheetProps) {
  const output = data?.output || {};
  
  if (!output || Object.keys(output).length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">No design output available yet. Upload an Excel template or create a new project to generate design calculations.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hydraulics Output */}
      {output.hydraulics && (
        <Card>
          <CardHeader>
            <CardTitle>Hydraulic Design Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-sm font-semibold text-blue-900">Design Discharge</div>
                <div className="text-2xl font-bold text-blue-700">{output.hydraulics.discharge?.toFixed(2)} m³/s</div>
              </div>
              <div className="bg-cyan-50 p-4 rounded">
                <div className="text-sm font-semibold text-cyan-900">Flood Level (HFL)</div>
                <div className="text-2xl font-bold text-cyan-700">{output.hydraulics.floodLevel?.toFixed(2)} m MSL</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-sm font-semibold text-green-900">Flow Velocity</div>
                <div className="text-2xl font-bold text-green-700">{output.hydraulics.velocity?.toFixed(3)} m/s</div>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <div className="text-sm font-semibold text-orange-900">Afflux</div>
                <div className="text-2xl font-bold text-orange-700">{output.hydraulics.afflux?.toFixed(3)} m</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
              <p><strong>Lacey's Silt Factor:</strong> {output.hydraulics.siltFactor?.toFixed(2)}</p>
              <p><strong>Manning's Coefficient:</strong> {output.hydraulics.manningCoefficient?.toFixed(4)}</p>
              <p><strong>Froude Number:</strong> {output.hydraulics.froudeNumber?.toFixed(3)}</p>
              <p><strong>Bed Slope:</strong> {output.hydraulics.bedSlope?.toFixed(6)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pier Design Output */}
      {output.pierDesign && (
        <Card>
          <CardHeader>
            <CardTitle>Pier Design Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded">
                <div className="text-sm font-semibold text-indigo-900">Pier Weight</div>
                <div className="text-2xl font-bold text-indigo-700">{output.pierDesign.weight?.toFixed(0)} kN</div>
              </div>
              <div className="bg-violet-50 p-4 rounded">
                <div className="text-sm font-semibold text-violet-900">Footing Area</div>
                <div className="text-2xl font-bold text-violet-700">{output.pierDesign.footingArea?.toFixed(2)} m²</div>
              </div>
              <div className="bg-rose-50 p-4 rounded">
                <div className="text-sm font-semibold text-rose-900">Max Stress</div>
                <div className="text-2xl font-bold text-rose-700">{output.pierDesign.maxStress?.toFixed(2)} MPa</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
              <p><strong>Sliding FOS:</strong> <span className="font-bold text-green-600">{output.pierDesign.slidingFOS?.toFixed(2)}</span> {output.pierDesign.slidingFOS >= 1.5 ? "✓" : "✗"}</p>
              <p><strong>Overturning FOS:</strong> <span className="font-bold text-green-600">{output.pierDesign.overturnFOS?.toFixed(2)}</span> {output.pierDesign.overturnFOS >= 2.0 ? "✓" : "✗"}</p>
              <p><strong>Bearing Capacity Check:</strong> <span className="font-bold text-green-600">{output.pierDesign.bearingCapacity?.toFixed(2)} MPa</span></p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Abutment Design Output */}
      {output.abutmentType1 && (
        <Card>
          <CardHeader>
            <CardTitle>Type 1 Abutment Design Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 p-4 rounded">
                <div className="text-sm font-semibold text-emerald-900">Abutment Weight</div>
                <div className="text-2xl font-bold text-emerald-700">{output.abutmentType1.weight?.toFixed(0)} kN</div>
              </div>
              <div className="bg-teal-50 p-4 rounded">
                <div className="text-sm font-semibold text-teal-900">Footing Width</div>
                <div className="text-2xl font-bold text-teal-700">{output.abutmentType1.footingWidth?.toFixed(2)} m</div>
              </div>
              <div className="bg-cyan-50 p-4 rounded">
                <div className="text-sm font-semibold text-cyan-900">Stability FOS</div>
                <div className="text-2xl font-bold text-cyan-700">{output.abutmentType1.stabilityFOS?.toFixed(2)}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
              <p><strong>Sliding Check (FOS ≥ 1.5):</strong> {output.abutmentType1.slidingFOS >= 1.5 ? <span className="font-bold text-green-600">✓ PASS</span> : <span className="font-bold text-red-600">✗ FAIL</span>}</p>
              <p><strong>Overturning Check (FOS ≥ 2.0):</strong> {output.abutmentType1.overturnFOS >= 2.0 ? <span className="font-bold text-green-600">✓ PASS</span> : <span className="font-bold text-red-600">✗ FAIL</span>}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cantilever Abutment */}
      {output.abutmentCantilever && (
        <Card>
          <CardHeader>
            <CardTitle>Cantilever Abutment Design Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-amber-50 p-4 rounded">
                <div className="text-sm font-semibold text-amber-900">Abutment Weight</div>
                <div className="text-2xl font-bold text-amber-700">{output.abutmentCantilever.weight?.toFixed(0)} kN</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <div className="text-sm font-semibold text-yellow-900">Main Footing Width</div>
                <div className="text-2xl font-bold text-yellow-700">{output.abutmentCantilever.mainFootingWidth?.toFixed(2)} m</div>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <div className="text-sm font-semibold text-orange-900">Stability FOS</div>
                <div className="text-2xl font-bold text-orange-700">{output.abutmentCantilever.stabilityFOS?.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slab Design Output */}
      {output.slabDesign && (
        <Card>
          <CardHeader>
            <CardTitle>Slab Design Output (Pigeaud's Method)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-pink-50 p-4 rounded">
                <div className="text-sm font-semibold text-pink-900">Main Moment (kNm/m)</div>
                <div className="text-2xl font-bold text-pink-700">{output.slabDesign.mainMoment?.toFixed(2)}</div>
              </div>
              <div className="bg-fuchsia-50 p-4 rounded">
                <div className="text-sm font-semibold text-fuchsia-900">Distribution Steel (%)</div>
                <div className="text-2xl font-bold text-fuchsia-700">{output.slabDesign.distributionSteel?.toFixed(1)}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <div className="text-sm font-semibold text-purple-900">Main Steel Spacing (mm)</div>
                <div className="text-2xl font-bold text-purple-700">{output.slabDesign.mainSteelSpacing?.toFixed(0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material Estimate */}
      {output.materials && (
        <Card>
          <CardHeader>
            <CardTitle>Material Estimate (Bill of Quantities)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="font-semibold py-2">Concrete (M25)</td>
                    <td className="py-2">{output.materials.concrete?.toFixed(2)} m³</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="font-semibold py-2">Steel Reinforcement</td>
                    <td className="py-2">{output.materials.steel?.toFixed(2)} tonnes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold py-2">Formwork</td>
                    <td className="py-2">{output.materials.formwork?.toFixed(2)} m²</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="font-semibold py-2">Labour</td>
                    <td className="py-2">{output.materials.labour?.toFixed(0)} man-days</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold py-2 text-green-700">Total Cost (₹)</td>
                    <td className="py-2 text-green-700 font-bold">₹{(output.materials.totalCost / 1000000).toFixed(2)}M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Load Cases Summary */}
      {output.loadCases && (
        <Card>
          <CardHeader>
            <CardTitle>Load Case Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-3xl font-bold text-blue-700">70</div>
              <div className="text-sm text-blue-900">Pier Load Cases</div>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <div className="text-3xl font-bold text-green-700">310</div>
              <div className="text-sm text-green-900">Abutment Cases</div>
            </div>
            <div className="bg-purple-50 p-4 rounded text-center">
              <div className="text-3xl font-bold text-purple-700">380+</div>
              <div className="text-sm text-purple-900">Total Analyses</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Design Narrative */}
      {output.designNarrative && (
        <Card>
          <CardHeader>
            <CardTitle>Design Narrative</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm whitespace-pre-wrap">
            {output.designNarrative}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
