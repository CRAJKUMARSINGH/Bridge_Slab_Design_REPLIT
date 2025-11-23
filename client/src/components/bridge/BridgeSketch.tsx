import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface BridgeSketchProps {
  data: any;
}

export default function BridgeSketch({ data }: BridgeSketchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const scale = 40; // pixels per meter approx
    
    const span = parseFloat(data.clearSpan);
    const support = parseFloat(data.supportWidth);
    const depth = span / 12; // rough estimation for visual
    
    const centerX = width / 2;
    const centerY = height / 2 + 50;

    // Draw Abutments
    ctx.fillStyle = "#e5e5e5";
    ctx.strokeStyle = "#666";
    
    // Left Abutment
    const leftAbutmentX = centerX - (span * scale / 2) - (support * scale);
    ctx.fillRect(leftAbutmentX - 40, centerY, 40 + (support * scale), 100);
    ctx.strokeRect(leftAbutmentX - 40, centerY, 40 + (support * scale), 100);

    // Right Abutment
    const rightAbutmentX = centerX + (span * scale / 2);
    ctx.fillRect(rightAbutmentX, centerY, 40 + (support * scale), 100);
    ctx.strokeRect(rightAbutmentX, centerY, 40 + (support * scale), 100);

    // Draw Slab
    ctx.fillStyle = "#e2e8f0"; // Concrete color
    ctx.strokeStyle = "#334155";
    
    const slabStart = centerX - (span * scale / 2) - (support * scale / 2);
    const slabWidth = (span * scale) + (support * scale); // Total length including bearings
    const slabHeight = depth * scale;

    ctx.beginPath();
    ctx.rect(slabStart, centerY - slabHeight, slabWidth, slabHeight);
    ctx.fill();
    ctx.stroke();

    // Draw Wearing Coat
    ctx.fillStyle = "#1e293b"; // Asphalt
    const wcHeight = (parseFloat(data.wearingCoatThickness) / 1000) * scale;
    ctx.beginPath();
    ctx.rect(slabStart, centerY - slabHeight - wcHeight, slabWidth, wcHeight);
    ctx.fill();

    // Dimensions
    ctx.font = "12px monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    // Span Dimension
    ctx.beginPath();
    ctx.moveTo(centerX - (span * scale / 2), centerY + 20);
    ctx.lineTo(centerX + (span * scale / 2), centerY + 20);
    ctx.stroke();
    // Arrowheads
    ctx.fillText(`Clear Span = ${span}m`, centerX, centerY + 35);

  }, [data]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-base font-mono uppercase tracking-wider text-muted-foreground">Cross Sectional View</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-center bg-white p-8">
           <canvas ref={canvasRef} width={800} height={300} className="w-full max-w-[800px] h-auto border rounded-md bg-white shadow-sm" />
        </div>
        <div className="p-4 bg-muted/10 border-t text-sm text-muted-foreground text-center">
          Schematic diagram showing span and support arrangements. Not to scale.
        </div>
      </CardContent>
    </Card>
  );
}
