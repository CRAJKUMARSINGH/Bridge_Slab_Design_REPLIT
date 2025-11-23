import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

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
        toast.success("Design auto-generated from Excel!");

        // Create project
        const projectResponse = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: result.projectName || "Bridge Design from Excel",
            location: result.location || "Not specified",
            engineer: "Auto-generated from Excel",
            designData: result.designOutput,
          }),
        });

        if (projectResponse.ok) {
          const project = await projectResponse.json();
          setLocation(`/workbook/${project.id}`);
        }
      } else {
        throw new Error(result.message || "Failed to parse Excel");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload Excel file"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1a1a1a", margin: "0 0 10px 0" }}>
            🌉 Submersible Bridge Design Suite
          </h1>
          <p style={{ fontSize: "16px", color: "#666", margin: "0" }}>
            Auto-generate comprehensive bridge designs from Excel hydraulic data
          </p>
        </div>

        {/* Main Upload Card */}
        <div style={{
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "40px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#000", marginBottom: "20px", textAlign: "center" }}>
            📊 Import Bridge Design Data
          </h2>

          {/* Upload Area */}
          <label style={{
            display: "block",
            border: "2px dashed #3b82f6",
            borderRadius: "8px",
            padding: "60px 20px",
            textAlign: "center",
            backgroundColor: "#eff6ff",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isLoading ? 0.6 : 1,
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📁</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#1e3a8a", marginBottom: "8px" }}>
              Click to upload Excel file
            </div>
            <div style={{ fontSize: "14px", color: "#3b82f6", marginBottom: "16px" }}>
              Or drag and drop your file here
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              File should contain: Discharge, HFL, Bed Slope, Span, Width, Bearing Capacity
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isLoading}
              style={{ display: "none" }}
              data-testid="input-excel-upload"
            />
          </label>

          {isLoading && (
            <div style={{
              marginTop: "20px",
              padding: "16px",
              backgroundColor: "#dbeafe",
              borderRadius: "6px",
              textAlign: "center",
              color: "#1e40af",
              fontWeight: "500"
            }}>
              ⏳ Analyzing Excel file and generating design...
            </div>
          )}

          {/* Required Data Info */}
          <div style={{
            marginTop: "30px",
            padding: "16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            borderLeft: "4px solid #3b82f6"
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", marginTop: "0", marginBottom: "12px" }}>
              ✓ Excel file must contain:
            </h3>
            <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#4b5563", lineHeight: "1.8" }}>
              <li><strong>Discharge (Q):</strong> Design discharge in m³/s</li>
              <li><strong>HFL:</strong> Highest Flood Level in meters</li>
              <li><strong>Bed Slope:</strong> River bed slope in m/m</li>
              <li><strong>Proposed Span:</strong> Bridge span in meters</li>
              <li><strong>Proposed Width:</strong> Bridge width in meters</li>
              <li><strong>Soil Bearing Capacity:</strong> In kPa</li>
            </ul>
          </div>
        </div>

        {/* Example Values */}
        <div style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #dcfce7",
          borderRadius: "8px",
          padding: "20px"
        }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#166534", margin: "0 0 12px 0" }}>
            📌 Example Excel Values:
          </h3>
          <div style={{ fontSize: "13px", color: "#4b5563", fontFamily: "monospace", backgroundColor: "white", padding: "12px", borderRadius: "4px" }}>
            Discharge: 902.15 m³/s<br />
            HFL: 100.6 m<br />
            Bed Slope: 0.0008 m/m<br />
            Proposed Span: 30 m<br />
            Proposed Width: 7.5 m<br />
            Bearing Capacity: 150 kPa
          </div>
        </div>
      </div>
    </div>
  );
}
