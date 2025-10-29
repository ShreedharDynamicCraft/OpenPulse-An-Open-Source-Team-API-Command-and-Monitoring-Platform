"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { createDesignProject } from "../actions/projects";
import { useWorkspaceStore } from "@/modules/Layout/store";

interface CreateProjectDialogProps {
  onSuccess?: () => void;
}

export function CreateProjectDialog({ onSuccess }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectedWorkspace } = useWorkspaceStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!selectedWorkspace?.id) {
      toast.error("Please select a workspace");
      return;
    }

    setLoading(true);
    try {
      const result = await createDesignProject({
        name: name.trim(),
        description: description.trim(),
        workspaceId: selectedWorkspace.id,
      });

      if (result.success) {
        toast.success("Project created successfully!");
        setOpen(false);
        setName("");
        setDescription("");
        onSuccess?.(); // Call the onSuccess callback to refresh projects list
      } else {
        console.error("Project creation failed:", result);
        toast.error(result.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Project creation error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Design Project</DialogTitle>
            <DialogDescription>
              Create a new project to organize your design files
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mobile App Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
