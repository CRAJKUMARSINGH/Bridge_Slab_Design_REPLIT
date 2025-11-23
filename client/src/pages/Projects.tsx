import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getAllProjects, createProject, deleteProject } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FileText, Download, File, Upload, Zap, Lock, BarChart3, Clock, ArrowRight, CheckCircle2, Zap as ZapIcon } from "lucide-react";
import { format } from "date-fns";
import { exportProjectAsExcel, exportProjectAsPDF } from "@/lib/api";
import { toast } from "sonner";

export default function Projects() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [createError, setCreateError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    location: "",
    district: "",
    engineer: "",
  });

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleExportExcel = async (id: number, name: string) => {
    try {
      await exportProjectAsExcel(id, name);
      toast.success(`${name} exported to Excel!`);
    } catch (error) {
      toast.error("Failed to export to Excel");
    }
  };

  const handleExportPDF = async (id: number, name: string) => {
    try {
      await exportProjectAsPDF(id, name);
      toast.success(`${name} PDF report generated!`);
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const handleCreate = async () => {
    if (!newProject.name.trim()) {
      setCreateError("Project name is required");
      return;
    }

    setIsCreating(true);
    try {
      setCreateError("");
      const result = await createProject({
        ...newProject,
        designData: {
          designType: "slab",
          span: 6.0,
          width: 7.5,
          supportWidth: 400,
          wearingCoat: 80,
          fck: 25,
          fy: 415,
          loadClass: "Class AA",
          depth: 550,
          cover: 40,
        },
      });
      toast.success("Project created!");
      setIsDialogOpen(false);
      setNewProject({ name: "", location: "", district: "", engineer: "" });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      setLocation(`/workbook/${result.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create project";
      setCreateError(message);
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        setLocation(`/workbook/${result.projectId}`);
      } else {
        throw new Error(result.message || "Failed to parse Excel");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setCreateError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-white flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              🏗️ IRC-COMPLIANT BRIDGE DESIGN AUTOMATION
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
              Submersible Bridge <span className="text-blue-300">Auto-Design System</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transform hydraulic parameters into complete IRC:6-2016 & IRC:112-2015 compliant engineering designs in minutes. Generate professional Excel reports (47 sheets) and PDF documentation automatically.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
                    <Plus className="h-5 w-5 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., NH44 Bridge at KM 100"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        data-testid="input-project-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., State Highway, District Name"
                        value={newProject.location}
                        onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                        data-testid="input-project-location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        placeholder="District"
                        value={newProject.district}
                        onChange={(e) => setNewProject({ ...newProject, district: e.target.value })}
                        data-testid="input-project-district"
                      />
                    </div>
                    <div>
                      <Label htmlFor="engineer">Engineer</Label>
                      <Input
                        id="engineer"
                        placeholder="Your Name"
                        value={newProject.engineer}
                        onChange={(e) => setNewProject({ ...newProject, engineer: e.target.value })}
                        data-testid="input-project-engineer"
                      />
                    </div>
                    {createError && <p className="text-sm text-red-500">{createError}</p>}
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreate} disabled={isCreating} className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-project">
                      {isCreating ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300 text-blue-300 hover:bg-blue-50/10 px-8"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-upload-excel"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Excel Template
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-file-upload"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Engineers Choose This System</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Auto-Generate Designs",
                desc: "Input 6-10 parameters, get complete design in seconds"
              },
              {
                icon: FileText,
                title: "47-Sheet Excel Reports",
                desc: "Comprehensive output with all calculations, BOM, and schedules"
              },
              {
                icon: Lock,
                title: "IRC Compliant",
                desc: "IRC:6-2016 & IRC:112-2015 standards built-in"
              },
              {
                icon: BarChart3,
                title: "Real Calculations",
                desc: "Hydraulics, pier, abutment, slab design with 96+ load cases"
              },
              {
                icon: Download,
                title: "Professional PDFs",
                desc: "100+ page engineering reports with narrative documentation"
              },
              {
                icon: Clock,
                title: "Save 40+ Hours",
                desc: "Reduce design time from days to minutes"
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Your Projects</h2>
          
          {projects.length === 0 ? (
            <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="h-16 w-16 text-blue-300 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Projects Yet</h3>
                <p className="text-gray-600 mb-6">Create your first bridge design project or upload an Excel template</p>
                <div className="flex gap-4 justify-center">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-new-project-empty">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Project Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g., NH44 Bridge at KM 100"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            data-testid="input-project-name-empty"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="e.g., State Highway, District Name"
                            value={newProject.location}
                            onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                            data-testid="input-project-location-empty"
                          />
                        </div>
                        <div>
                          <Label htmlFor="district">District</Label>
                          <Input
                            id="district"
                            placeholder="District"
                            value={newProject.district}
                            onChange={(e) => setNewProject({ ...newProject, district: e.target.value })}
                            data-testid="input-project-district-empty"
                          />
                        </div>
                        <div>
                          <Label htmlFor="engineer">Engineer</Label>
                          <Input
                            id="engineer"
                            placeholder="Your Name"
                            value={newProject.engineer}
                            onChange={(e) => setNewProject({ ...newProject, engineer: e.target.value })}
                            data-testid="input-project-engineer-empty"
                          />
                        </div>
                        {createError && <p className="text-sm text-red-500">{createError}</p>}
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreate} disabled={isCreating} className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-project-empty">
                          {isCreating ? "Creating..." : "Create Project"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-excel-empty"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2" data-testid={`text-project-${project.id}`}>
                          {project.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {project.location && (
                            <div>
                              <p className="text-gray-500">Location</p>
                              <p className="font-semibold text-gray-900">{project.location}</p>
                            </div>
                          )}
                          {project.engineer && (
                            <div>
                              <p className="text-gray-500">Engineer</p>
                              <p className="font-semibold text-gray-900">{project.engineer}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-semibold text-gray-900">{format(new Date(project.createdAt), "MMM dd, yyyy")}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <p className="font-semibold text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Ready
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col">
                        <Button
                          onClick={() => setLocation(`/workbook/${project.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          data-testid={`button-open-${project.id}`}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Open Design
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportExcel(project.id, project.name)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          data-testid={`button-excel-${project.id}`}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Excel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportPDF(project.id, project.name)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          data-testid={`button-pdf-${project.id}`}
                        >
                          <File className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`Delete "${project.name}"?`)) {
                              deleteMutation.mutate(project.id);
                            }
                          }}
                          data-testid={`button-delete-${project.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            🏗️ Submersible Bridge Auto-Design System • IRC:6-2016 & IRC:112-2015 Compliant
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Engineering calculations verified and certified • Professional documentation ready for clients
          </p>
        </div>
      </footer>
    </div>
  );
}
