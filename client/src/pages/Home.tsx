import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Ruler, Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Slab Bridge Design Suite</h1>
            <p className="text-muted-foreground mt-2">Professional Structural Analysis & Detailed Reporting</p>
          </div>
          <Link href="/design">
            <Button size="lg" className="gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              New Design Project
            </Button>
          </Link>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-primary" onClick={() => window.location.href = '/workbook'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span>Recent Design #1024</span>
              </CardTitle>
              <CardDescription>Modified 2 hours ago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Span:</span>
                  <span className="font-medium font-mono">12.0m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Width:</span>
                  <span className="font-medium font-mono">7.5m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Vetting Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50 border-dashed flex flex-col items-center justify-center text-center p-6 h-full hover:bg-muted/80 transition-colors" onClick={() => window.location.href = '/workbook'}>
             <div className="p-4 rounded-full bg-background mb-4">
               <Ruler className="h-8 w-8 text-muted-foreground" />
             </div>
             <h3 className="font-semibold">Full Design Workbook</h3>
             <p className="text-sm text-muted-foreground mt-1">Access all 44 calculation sheets and matrices</p>
             <Link href="/workbook">
               <Button variant="link" className="mt-2">Open Workbook &rarr;</Button>
             </Link>
          </Card>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Reporting Standards</h2>
          <div className="grid md:grid-cols-2 gap-4">
             <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
               <div className="p-2 bg-primary/10 rounded text-primary">
                 <FileText className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-medium">IIT Mumbai Vetting Format</h3>
                 <p className="text-sm text-muted-foreground mt-1">
                   Generates detailed step-by-step calculation reports suitable for third-party vetting.
                   Includes Moment computations, Shear checks, and Reinforcement details.
                 </p>
               </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
