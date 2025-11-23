import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getAllProjects, createProject, deleteProject } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FileText, Download, File, Upload } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Bridge Design System
              </h1>
              <p className="text-slate-400 text-sm">
                IRC:6-2016 & IRC:112-2015 Compliant Auto-Design Platform
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                data-testid="button-upload-excel"
              >
                <Upload className="mr-2 h-5 w-5" />
                {isUploading ? "Processing..." : "Upload Excel"}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700" data-testid="button-new-project">
                    <Plus className="mr-2 h-5 w-5" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
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
                        className="bg-slate-700 border-slate-600 text-white"
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
                        className="bg-slate-700 border-slate-600 text-white"
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
                        className="bg-slate-700 border-slate-600 text-white"
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
                        className="bg-slate-700 border-slate-600 text-white"
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
                      className="bg-green-600 hover:bg-green-700"
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
      <div className="max-w-7xl mx-auto px-6 py-12">
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
          <div className="text-center py-16 text-slate-400">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-24 w-24 mx-auto text-slate-600 mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-3">No Projects Yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Create a new project or upload an Excel design file to get started with your bridge design
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Project
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Excel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
                data-testid={`card-project-${project.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => setLocation(`/workbook/${project.id}`)}>
                      <CardTitle
                        className="text-lg text-white hover:text-blue-400 transition-colors mb-1"
                        data-testid={`link-project-${project.id}`}
                      >
                        {project.name}
                      </CardTitle>
                      {project.location && (
                        <p className="text-sm text-slate-400">
                          {project.location}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportPDF(project.id, project.name);
                        }}
                        data-testid={`button-export-pdf-${project.id}`}
                        className="hover:bg-slate-700 text-red-400 hover:text-red-300"
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
                        className="hover:bg-slate-700 text-blue-400 hover:text-blue-300"
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
                        className="hover:bg-slate-700 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-400">
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
                      Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
