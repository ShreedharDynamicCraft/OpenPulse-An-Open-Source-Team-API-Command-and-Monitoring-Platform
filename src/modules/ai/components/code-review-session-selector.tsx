"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FolderOpen, Star, History } from "lucide-react";
import { useCodeReviewProjects } from "../hooks/use-code-review-projects";
import { useCodeReviewSessions, useCreateCodeReviewSession } from "../hooks/use-code-review-sessions";
import { ReviewType } from "@prisma/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeReviewSessionSelectorProps {
  workspaceId: string;
  userId: string;
  reviewType: ReviewType;
  onSessionSelect: (sessionId: string) => void;
  selectedSessionId?: string;
}

export function CodeReviewSessionSelector({
  workspaceId,
  userId,
  reviewType,
  onSessionSelect,
  selectedSessionId,
}: CodeReviewSessionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("__none__");

  const { data: projects } = useCodeReviewProjects(workspaceId);
  const { data: sessions } = useCodeReviewSessions(workspaceId);
  const createSession = useCreateCodeReviewSession();

  const filteredSessions = sessions?.filter(s => s.reviewType === reviewType);
  const selectedSession = sessions?.find(s => s.id === selectedSessionId);

  const handleCreateSession = async () => {
    if (!name.trim()) {
      toast.error("Please enter a session name");
      return;
    }

    try {
      const session = await createSession.mutateAsync({
        workspaceId,
        userId,
        projectId: projectId === "__none__" ? undefined : projectId,
        reviewType,
        name,
        description,
        model: "gemini-2.0-flash-exp",
      });

      toast.success("Session created successfully");
      onSessionSelect(session.id);
      setOpen(false);
      setCreateMode(false);
      setName("");
      setDescription("");
      setProjectId("__none__");
    } catch (error) {
      toast.error("Failed to create session");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {selectedSession ? (
              <>
                <History className="h-4 w-4" />
                {selectedSession.name}
                {selectedSession.isFavorite && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                New Session
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {createMode ? "Create New Session" : "Select or Create Session"}
            </DialogTitle>
            <DialogDescription>
              {createMode
                ? "Create a new review session to save and track your code reviews"
                : "Choose an existing session or create a new one"}
            </DialogDescription>
          </DialogHeader>

          {createMode ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Session Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Authentication Module Review"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this session is for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project (Optional)</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project or leave blank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No Project (Standalone)</SelectItem>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {filteredSessions?.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        onSessionSelect(session.id);
                        setOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedSessionId === session.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{session.name}</span>
                            {session.isFavorite && (
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            )}
                          </div>
                          {session.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {session.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {session.project && (
                              <Badge variant="secondary" className="text-xs">
                                <FolderOpen className="h-3 w-3 mr-1" />
                                {session.project.name}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {session._count?.logs || 0} runs
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {(!filteredSessions || filteredSessions.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      No sessions found. Create your first session to get started.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          <DialogFooter>
            {createMode ? (
              <>
                <Button variant="outline" onClick={() => setCreateMode(false)}>
                  Back
                </Button>
                <Button onClick={handleCreateSession} disabled={createSession.isPending}>
                  {createSession.isPending ? "Creating..." : "Create Session"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setCreateMode(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Session
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedSession && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSessionSelect("")}
          className="text-muted-foreground"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
