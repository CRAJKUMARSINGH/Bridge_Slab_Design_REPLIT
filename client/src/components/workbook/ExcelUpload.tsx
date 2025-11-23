import { useState } from "react";
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
    <div className="w-full border rounded-lg p-6 bg-white shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">📊 Import Bridge Design from Excel</h2>
        <p className="text-sm text-gray-600 mt-1">Upload your hydraulic data file to auto-generate complete bridge design</p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
          <label className="flex flex-col items-center justify-center gap-3 cursor-pointer">
            <Upload className="w-16 h-16 text-blue-500" />
            <div>
              <span className="text-lg font-semibold text-blue-900">
                Click to upload Excel file
              </span>
              <p className="text-sm text-blue-700 mt-2">
                File with discharge (m³/s), flood level (m), bed slope, span, width, bearing capacity
              </p>
            </div>
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
          <div className="flex items-center gap-3 p-4 bg-blue-100 rounded-lg text-blue-900">
            <div className="animate-spin h-5 w-5 border-3 border-blue-500 border-t-transparent rounded-full" />
            <span className="font-medium">Analyzing Excel file...</span>
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="flex items-center gap-3 p-4 bg-green-100 rounded-lg text-green-900">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">✓ Excel analyzed successfully! Design generated.</span>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="flex items-center gap-3 p-4 bg-red-100 rounded-lg text-red-900">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Failed to parse Excel. Please check the file format.</span>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-200">
          <p className="font-semibold mb-2">📋 Excel file should contain:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong>Discharge (Q):</strong> in m³/s (e.g., 902.15)</li>
            <li><strong>HFL (Highest Flood Level):</strong> in m (e.g., 100.6)</li>
            <li><strong>Bed Slope:</strong> in m/m (e.g., 0.0008)</li>
            <li><strong>Proposed Span:</strong> in m (e.g., 30)</li>
            <li><strong>Proposed Width:</strong> in m (e.g., 7.5)</li>
            <li><strong>Soil Bearing Capacity:</strong> in kPa (e.g., 150)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
