import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ExcelUploadProps {
  onUploadSuccess?: (designData: any) => void;
  onProjectCreate?: (projectData: any) => void;
}

export default function ExcelUpload({ onUploadSuccess, onProjectCreate }: ExcelUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadStatus("loading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-design-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse Excel file");
      }

      const result = await response.json();

      if (result.success) {
        setUploadStatus("success");
        toast.success("Excel file uploaded and analyzed successfully!");

        // Trigger project creation with auto-generated design
        if (onProjectCreate) {
          onProjectCreate({
            name: result.projectName || "Bridge Design from Excel",
            location: result.location || "Not specified",
            engineer: "Auto-generated from Excel",
            designData: result.designOutput,
          });
        }

        if (onUploadSuccess) {
          onUploadSuccess(result.designOutput);
        }
      } else {
        throw new Error(result.message || "Failed to parse Excel");
      }
    } catch (error) {
      setUploadStatus("error");
      toast.error(
        error instanceof Error ? error.message : "Failed to upload Excel file"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Bridge Design from Excel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">
                Click to upload Excel file with hydraulic data
              </span>
              <span className="text-xs text-gray-500 mt-1">
                (XLSX or XLS with discharge, flood level, bed slope, span, width)
              </span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="hidden"
                data-testid="input-excel-upload"
              />
            </label>
          </div>

          {uploadStatus === "loading" && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded text-blue-700">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span>Analyzing Excel file...</span>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded text-green-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Excel file analyzed successfully! Design generated.</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to parse Excel file. Please check the format.</span>
            </div>
          )}

          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-semibold">Required data in Excel:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Discharge (Q) in m³/s</li>
              <li>Highest Flood Level (HFL) in m</li>
              <li>Bed Slope in m/m</li>
              <li>Proposed Bridge Span in m</li>
              <li>Proposed Bridge Width in m</li>
              <li>Soil Bearing Capacity in kPa</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
