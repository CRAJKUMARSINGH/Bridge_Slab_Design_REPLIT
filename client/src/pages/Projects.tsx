import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getAllProjects, createProject, deleteProject } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FileText, Download, File, Upload, Zap, Lock, BarChart3, Clock } from "lucide-react";
import { format } from "date-fns";
import { exportProjectAsExcel, exportProjectAsPDF } from "@/lib/api";
import { toast } from "sonner";

export default function Projects() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    location: "",
    district: "",
    engineer: "",
  });

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsDialogOpen(false);
      setNewProject({ name: "", location: "", district: "", engineer: "" });
      setLocation(`/workbook/${newProject.id}`);
    },
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

  const handleCreate = () => {
    if (!newProject.name.trim()) return;

    createMutation.mutate({
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
      toast.error(error instanceof Error ? error.message : "Failed to upload Excel file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      {/* Header with sticky position */}
      <div className="relative sticky top-0 z-40 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                IRC Bridge Design
              </h1>
              <p className="text-slate-400 text-xs">Auto-Design System</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-cyan-500/50 transition-all"
                size="lg"
                data-testid="button-upload-excel"
              >
                <Upload className="mr-2 h-5 w-5" />
                {isUploading ? "Processing..." : "Upload Excel"}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="button-new-project">
                    <Plus className="mr-2 h-5 w-5" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-850 border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Bridge Design</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-200">Project Name *</Label>
                      <Input
                        id="name"
                        data-testid="input-project-name"
                        placeholder="e.g., NH-8 Slab Bridge"
                        className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/50"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-slate-200">Location</Label>
                      <Input
                        id="location"
                        data-testid="input-project-location"
                        placeholder="e.g., Chittorgarh-Ajmer Road"
                        className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/50"
                        value={newProject.location}
                        onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="district" className="text-slate-200">District</Label>
                      <Input
                        id="district"
                        data-testid="input-project-district"
                        placeholder="e.g., Chittorgarh"
                        className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/50"
                        value={newProject.district}
                        onChange={(e) => setNewProject({ ...newProject, district: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="engineer" className="text-slate-200">Engineer Name</Label>
                      <Input
                        id="engineer"
                        data-testid="input-project-engineer"
                        placeholder="e.g., Raj Kumar Singh"
                        className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/50"
                        value={newProject.engineer}
                        onChange={(e) => setNewProject({ ...newProject, engineer: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCreate}
                      disabled={!newProject.name.trim() || createMutation.isPending}
                      data-testid="button-create-project"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {createMutation.isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          data-testid="input-excel-upload"
        />

        {isLoading ? (
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-6"></div>
            <p className="text-slate-400 text-lg">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <>
            {/* Beautiful Title Page / Hero Section */}
            <div className="max-w-7xl mx-auto px-6 py-24">
              <div className="text-center mb-20">
                <div className="inline-block mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent leading-tight">
                  IRC Compliant Bridge Design
                </h1>
                <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Auto-generate complete 47-sheet engineering reports from minimal input parameters
                </p>
                <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
                  Instant structural analysis, material estimates, and IRC:6-2016 & IRC:112-2015 compliant designs
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-2xl hover:shadow-cyan-500/50 transition-all text-lg px-10 py-6 h-auto"
                    data-testid="button-upload-hero"
                  >
                    <Upload className="mr-3 h-6 w-6" />
                    Upload Excel Design
                  </Button>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-emerald-500/50 transition-all text-lg px-10 py-6 h-auto"
                    data-testid="button-new-project-hero"
                  >
                    <Plus className="mr-3 h-6 w-6" />
                    Create New Project
                  </Button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:border-blue-500/50 transition-all">
                    <Zap className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Auto-Generate</h3>
                    <p className="text-slate-400 text-sm">47-sheet Excel reports instantly</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:border-cyan-500/50 transition-all">
                    <Lock className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">IRC Compliant</h3>
                    <p className="text-slate-400 text-sm">6-2016 & 112-2015 standards built-in</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:border-emerald-500/50 transition-all">
                    <BarChart3 className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Complete Analysis</h3>
                    <p className="text-slate-400 text-sm">380+ load cases & cost estimates</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur hover:border-violet-500/50 transition-all">
                    <Clock className="h-8 w-8 text-violet-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Professional Reports</h3>
                    <p className="text-slate-400 text-sm">Excel & PDF ready for review</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Projects heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                Your Projects
              </h2>
              <p className="text-slate-400">Manage and export your bridge designs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all cursor-pointer group"
                  data-testid={`card-project-${project.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => setLocation(`/workbook/${project.id}`)}>
                        <CardTitle
                          className="text-lg text-white group-hover:text-blue-300 transition-colors mb-1"
                          data-testid={`link-project-${project.id}`}
                        >
                          {project.name}
                        </CardTitle>
                        {project.location && (
                          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                            📍 {project.location}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportPDF(project.id, project.name);
                          }}
                          data-testid={`button-export-pdf-${project.id}`}
                          className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          title="Export PDF report"
                        >
                          <File className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportExcel(project.id, project.name);
                          }}
                          data-testid={`button-export-excel-${project.id}`}
                          className="hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
                          title="Export Excel report"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this project?")) {
                              deleteMutation.mutate(project.id);
                            }
                          }}
                          data-testid={`button-delete-${project.id}`}
                          className="hover:bg-red-500/20 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-slate-400">
                      {project.district && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">District:</span>
                          <span className="text-slate-300">{project.district}</span>
                        </div>
                      )}
                      {project.engineer && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Engineer:</span>
                          <span className="text-slate-300">{project.engineer}</span>
                        </div>
                      )}
                      <div className="text-xs text-slate-500 pt-3 border-t border-slate-700 mt-3">
                        📅 Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
