import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getAllProjects, createProject, deleteProject } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FileText, Download, File } from "lucide-react";
import { format } from "date-fns";
import { exportProjectAsExcel, exportProjectAsPDF } from "@/lib/api";
import { toast } from "sonner";

export default function Projects() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      // Navigate to the workbook for the new project
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Slab Bridge Design Projects
            </h1>
            <p className="text-slate-600">
              IRC Code-Compliant Design & Vetting Documentation System
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" data-testid="button-new-project">
                <Plus className="mr-2 h-5 w-5" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Bridge Design</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-project-name"
                    placeholder="e.g., NH-8 Slab Bridge"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    data-testid="input-project-location"
                    placeholder="e.g., Chittorgarh-Ajmer Road"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    data-testid="input-project-district"
                    placeholder="e.g., Chittorgarh"
                    value={newProject.district}
                    onChange={(e) => setNewProject({ ...newProject, district: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="engineer">Engineer Name</Label>
                  <Input
                    id="engineer"
                    data-testid="input-project-engineer"
                    placeholder="e.g., Raj Kumar Singh"
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
                >
                  {createMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-600">Loading projects...</div>
        ) : projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <FileText className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Projects Yet
              </h3>
              <p className="text-slate-600 mb-4">
                Create your first bridge design project to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                data-testid={`card-project-${project.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle
                        className="text-lg mb-1 hover:text-blue-600 cursor-pointer"
                        onClick={() => setLocation(`/workbook/${project.id}`)}
                        data-testid={`link-project-${project.id}`}
                      >
                        {project.name}
                      </CardTitle>
                      {project.location && (
                        <CardDescription className="text-sm">
                          {project.location}
                        </CardDescription>
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
                        title="Export 100+ page PDF vetting report"
                      >
                        <File className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportExcel(project.id, project.name);
                        }}
                        data-testid={`button-export-excel-${project.id}`}
                        title="Export 44-sheet Excel report"
                      >
                        <Download className="h-4 w-4 text-blue-600" />
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
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    {project.district && (
                      <div>
                        <span className="font-medium">District:</span> {project.district}
                      </div>
                    )}
                    {project.engineer && (
                      <div>
                        <span className="font-medium">Engineer:</span> {project.engineer}
                      </div>
                    )}
                    <div className="text-xs text-slate-400 pt-2 border-t">
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
