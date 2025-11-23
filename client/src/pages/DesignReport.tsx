import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, ChevronRight, Download, Printer, RefreshCw, Table, ArrowLeft } from "lucide-react";
import BridgeSketch from "@/components/bridge/BridgeSketch";
import DesignCalculations from "@/components/bridge/DesignCalculations";
import { Link } from "wouter";

const formSchema = z.object({
  clearSpan: z.string().min(1, "Required"),
  carriagewayWidth: z.string().min(1, "Required"),
  supportWidth: z.string().min(1, "Required"),
  wearingCoatThickness: z.string().min(1, "Required"),
  concreteGrade: z.string(),
  steelGrade: z.string(),
  loadingClass: z.string(),
});

export default function DesignReport() {
  const [activeTab, setActiveTab] = useState("input");
  const [designData, setDesignData] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clearSpan: "6.0",
      carriagewayWidth: "7.5",
      supportWidth: "0.4",
      wearingCoatThickness: "80",
      concreteGrade: "M25",
      steelGrade: "Fe415",
      loadingClass: "Class AA",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setDesignData(values);
    setActiveTab("report");
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
               <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Calculator className="h-5 w-5 text-primary" />
              <span>Slab Bridge Designer</span>
              <span className="text-muted-foreground font-normal text-sm ml-2 hidden md:inline">/ New Project</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === "report" && (
              <>
                <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                  <Printer className="h-4 w-4" /> Print Report
                </Button>
                {/* Mock Export functionality */}
                <Button size="sm" className="gap-2" onClick={() => alert("Excel Export started...")}>
                  <Download className="h-4 w-4" /> Export Excel
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {activeTab === "report" && (
             <div className="hidden print:block mb-8 text-center border-b pb-4">
                <h1 className="text-2xl font-bold uppercase">Detailed Design Report</h1>
                <h2 className="text-xl mt-2">Solid Slab Bridge Design</h2>
                <div className="text-sm text-muted-foreground mt-1">Generated on {new Date().toLocaleDateString()}</div>
             </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center no-print">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="input">Input Parameters</TabsTrigger>
              <TabsTrigger value="report" disabled={!designData}>Detailed Report</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="input" className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Design Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm uppercase text-muted-foreground tracking-wider">Geometry</h3>
                        <FormField
                          control={form.control}
                          name="clearSpan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Clear Span (m)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.1" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="carriagewayWidth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Carriageway Width (m)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.1" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="supportWidth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bearing/Support Width (m)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.05" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-sm uppercase text-muted-foreground tracking-wider">Materials & Loads</h3>
                        <FormField
                          control={form.control}
                          name="wearingCoatThickness"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wearing Coat (mm)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="concreteGrade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Concrete</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="M20">M20</SelectItem>
                                    <SelectItem value="M25">M25</SelectItem>
                                    <SelectItem value="M30">M30</SelectItem>
                                    <SelectItem value="M35">M35</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="steelGrade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Steel</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Fe415">Fe415</SelectItem>
                                    <SelectItem value="Fe500">Fe500</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                         <FormField
                            control={form.control}
                            name="loadingClass"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>IRC Loading Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Class AA">Class AA (Tracked)</SelectItem>
                                    <SelectItem value="Class A">Class A</SelectItem>
                                    <SelectItem value="Class 70R">Class 70R</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="flex justify-end">
                      <Button type="submit" size="lg" className="gap-2">
                        Generate Report <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
             {designData && (
               <div className="grid gap-8">
                 <BridgeSketch data={designData} />
                 <DesignCalculations data={designData} />
               </div>
             )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
