import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProjectData } from "@/pages/Workbook";
import { Zap } from "lucide-react";

interface InputDataSheetProps {
  data: ProjectData;
  onUpdate: (key: keyof ProjectData, value: any) => void;
  onRecalculate?: () => void;
}

export default function InputDataSheet({ data, onUpdate, onRecalculate }: InputDataSheetProps) {
  const handleInputChange = (key: keyof ProjectData, value: any) => {
    onUpdate(key, value);
    // Auto-recalculate on input change
    if (onRecalculate) {
      setTimeout(onRecalculate, 100);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Zap className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Modify any parameter below and the entire design will automatically recalculate
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Hydraulic Parameters */}
        <div className="col-span-6 space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">
              1. HYDRAULIC PARAMETERS
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Design Discharge (Q)</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="0.01"
                    value={data.discharge || ""}
                    onChange={(e) => handleInputChange("discharge", parseFloat(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-discharge"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">m³/s</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Highest Flood Level (HFL)</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="0.01"
                    value={data.floodLevel || ""}
                    onChange={(e) => handleInputChange("floodLevel", parseFloat(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-flood-level"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">m (abs)</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Bed Slope</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="0.0001"
                    value={data.crossSectionalArea || ""}
                    onChange={(e) => handleInputChange("crossSectionalArea", parseFloat(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-bed-slope"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">-</div>
                </div>
              </div>
            </div>
          </section>

          {/* Bridge Geometry */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">
              2. BRIDGE GEOMETRY
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Effective Span (L)</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.span || ""}
                    onChange={(e) => handleInputChange("span", parseFloat(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-span"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">m</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Bridge Width (W)</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="0.1"
                    value={data.width || ""}
                    onChange={(e) => handleInputChange("width", parseFloat(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-width"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">m</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Number of Lanes</Label>
                <Input
                  type="number"
                  step="1"
                  value={data.loadClass === "Class AA" ? 2 : 1}
                  onChange={(e) => handleInputChange("loadClass", e.target.value)}
                  className="bg-yellow-50 border-primary/50"
                  data-testid="input-lanes"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Material & Soil Properties */}
        <div className="col-span-6 space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">
              3. MATERIAL PROPERTIES
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Concrete Grade (fck)</Label>
                <Select value={data.fck.toString()} onValueChange={(v) => handleInputChange("fck", parseInt(v))}>
                  <SelectTrigger className="bg-yellow-50 border-primary/50" data-testid="select-fck">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">M20 (20 MPa)</SelectItem>
                    <SelectItem value="25">M25 (25 MPa)</SelectItem>
                    <SelectItem value="30">M30 (30 MPa)</SelectItem>
                    <SelectItem value="35">M35 (35 MPa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Steel Grade (fy)</Label>
                <Select value={data.fy.toString()} onValueChange={(v) => handleInputChange("fy", parseInt(v))}>
                  <SelectTrigger className="bg-yellow-50 border-primary/50" data-testid="select-fy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="415">Fe415 (415 MPa)</SelectItem>
                    <SelectItem value="500">Fe500 (500 MPa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Load Class (IRC:6)</Label>
                <Select value={data.loadClass} onValueChange={(v) => handleInputChange("loadClass", v)}>
                  <SelectTrigger className="bg-yellow-50 border-primary/50" data-testid="select-load-class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class AA">Class AA (70T tracked vehicle)</SelectItem>
                    <SelectItem value="Class A">Class A (50T vehicle)</SelectItem>
                    <SelectItem value="70R">70R (30T vehicle)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Soil & Foundation */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-2">
              4. SOIL & FOUNDATION
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Soil Bearing Capacity (SBC)</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="1"
                    value={data.velocity || ""}
                    onChange={(e) => handleInputChange("velocity", parseFloat(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-sbc"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">kPa</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Slab Thickness (design)</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="10"
                    value={data.depth || ""}
                    onChange={(e) => handleInputChange("depth", parseInt(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-depth"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">mm</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Concrete Cover</Label>
                <div className="flex">
                  <Input
                    type="number"
                    step="5"
                    value={data.cover || ""}
                    onChange={(e) => handleInputChange("cover", parseInt(e.target.value))}
                    className="rounded-r-none bg-yellow-50 border-primary/50"
                    data-testid="input-cover"
                  />
                  <div className="bg-muted border border-l-0 px-3 flex items-center text-xs rounded-r-md">mm</div>
                </div>
              </div>
            </div>
          </section>

          {/* Summary Box */}
          <div className="bg-green-50 border border-green-200 p-4 rounded space-y-2">
            <p className="text-xs font-bold text-green-800">⚡ QUICK SUMMARY</p>
            <div className="text-xs space-y-1 text-green-700">
              <div>Span: <span className="font-mono font-bold">{data.span}m</span></div>
              <div>Width: <span className="font-mono font-bold">{data.width}m</span></div>
              <div>Discharge: <span className="font-mono font-bold">{data.discharge}m³/s</span></div>
              <div>HFL: <span className="font-mono font-bold">{data.floodLevel}m</span></div>
              <div>fck: <span className="font-mono font-bold">M{data.fck}</span> | fy: <span className="font-mono font-bold">Fe{data.fy}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with recalculate button */}
      <div className="border-t pt-4 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          💡 Tip: Changes are auto-saved and design is automatically recalculated
        </p>
        <Button onClick={onRecalculate} size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          Recalculate Design
        </Button>
      </div>
    </div>
  );
}
