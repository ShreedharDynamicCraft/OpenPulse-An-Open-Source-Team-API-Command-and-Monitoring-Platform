"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit,
  Clock,
  Code,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useCodeReviewProjects, useCreateProject, useDeleteProject } from "../hooks/use-code-review-projects";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CodeReviewProjectsProps {
  workspaceId: string;
  selectedProject: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export function CodeReviewProjects({ 
  workspaceId, 
  selectedProject, 
  onSelectProject 
}: CodeReviewProjectsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const { data: projects, isLoading } = useCodeReviewProjects(workspaceId);
  const createProject = useCreateProject(workspaceId);
  const deleteProject = useDeleteProject(workspaceId);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    try {
      await createProject.mutateAsync({
        name: projectName,
        description: projectDescription,
      });
      setProjectName("");
      setProjectDescription("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject.mutateAsync(projectId);
      if (selectedProject === projectId) {
        onSelectProject(null);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-500" />
            Code Review Projects
          </h2>
          <p className="text-gray-400 mt-1">
            Organize your code reviews into projects and collections
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-900 dark:text-white">Create New Project</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a project to organize your code reviews
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-900 dark:text-white">
                  Project Name
                </Label>
                <Input
                  id="name"
                  placeholder="E.g., Frontend Refactoring, API Migration"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-900 dark:text-white">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="What is this project about?"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleCreateProject}
                disabled={!projectName.trim() || createProject.isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                {createProject.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <Card
              key={project.id}
              className={`bg-zinc-900 border-2 transition-all cursor-pointer hover:scale-105 ${
                selectedProject === project.id
                  ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
              onClick={() => onSelectProject(project.id === selectedProject ? null : project.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-zinc-900 dark:text-white text-lg flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span className="truncate">{project.name}</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2 line-clamp-2">
                      {project.description || "No description"}
                    </CardDescription>
                  </div>
                  {selectedProject === project.id && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 ml-2" />
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Code className="w-4 h-4" />
                      <span>{project._count?.reviews || 0} reviews</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      disabled={deleteProject.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderKanban className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 text-center mb-6 max-w-md">
              Create your first project to organize your code reviews and keep track of your development work.
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
