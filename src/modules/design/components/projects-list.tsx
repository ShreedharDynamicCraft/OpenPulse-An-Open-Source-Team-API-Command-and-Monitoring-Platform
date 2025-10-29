"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, FileIcon, FolderTree, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface DesignProject {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  parentId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    files: number;
    children: number;
  };
}

interface ProjectsListProps {
  projects: DesignProject[];
  onEdit?: (project: DesignProject) => void;
  onDelete?: (project: DesignProject) => void;
}

export function ProjectsList({ projects, onEdit, onDelete }: ProjectsListProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(project)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(project)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {project.description && (
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileIcon className="h-4 w-4" />
                <span>{project._count.files} files</span>
              </div>
              {project._count.children > 0 && (
                <div className="flex items-center gap-1">
                  <FolderTree className="h-4 w-4" />
                  <span>{project._count.children} sub-projects</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="outline">
                Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
