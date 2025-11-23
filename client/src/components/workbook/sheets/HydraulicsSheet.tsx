import type { ProjectData } from "@/pages/Workbook";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HydraulicsSheetProps {
  data: ProjectData;
  onUpdate: (key: keyof ProjectData, value: any) => void;
}

export default function HydraulicsSheet({ data, onUpdate }: HydraulicsSheetProps) {
  const hydraulicsData = [
    { label: "Discharge (m³/s)", key: "discharge", value: data.discharge || 902.15 },
    { label: "Flood Level (m)", key: "floodLevel", value: data.floodLevel || 100.6 },
    { label: "Cross-sectional Area (m²)", key: "crossSectionalArea", value: data.crossSectionalArea || 490.3 },
    { label: "Velocity (m/s)", key: "velocity", value: data.velocity || 1.84 },
    { label: "Afflux (m)", key: "afflux", value: data.afflux || 0.45 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hydraulic Design Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hydraulicsData.map((field) => (
            <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
              <Label>{field.label}</Label>
              <Input
                type="number"
                value={field.value}
                onChange={(e) => onUpdate(field.key as keyof ProjectData, parseFloat(e.target.value))}
                data-testid={`input-${field.key}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hydraulic Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-semibold text-blue-900">Design Discharge</div>
              <div className="text-2xl font-bold text-blue-700">{data.discharge || 902.15} m³/s</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-semibold text-green-900">HFL</div>
              <div className="text-2xl font-bold text-green-700">{data.floodLevel || 100.6} m</div>
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <div className="font-semibold text-orange-900">Flow Area</div>
              <div className="text-2xl font-bold text-orange-700">{data.crossSectionalArea || 490.3} m²</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="font-semibold text-purple-900">Average Velocity</div>
              <div className="text-2xl font-bold text-purple-700">{data.velocity || 1.84} m/s</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            <strong>Note:</strong> These values are extracted from the comprehensive hydraulic analysis per IRC:SP-13 (Flooding and Drainage) standards for submersible bridges.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
