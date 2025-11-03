"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Github, 
  MessageSquare, 
  Activity, 
  FolderKanban,
  Code2
} from "lucide-react";
import { EmpatheticCodeReviewEnhanced } from "./empathetic-code-review-enhanced";
import { GitHubRepoReviewEnhanced } from "./github-repo-review-enhanced";
import { WorkspaceChat } from "@/modules/workspace/components/workspace-chat";
import { CodeReviewLogs } from "./code-review-logs";
import { CodeReviewProjects } from "./code-review-projects";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useUser } from "@clerk/nextjs";

interface CodeReviewModuleProps {
  workspaceId: string;
}

export function CodeReviewModuleEnhanced({ workspaceId }: CodeReviewModuleProps) {
  const [activeTab, setActiveTab] = useState("empathetic");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { user } = useUser();

  if (!user) return null;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      {/* Main Code Review Area */}
      <ResizablePanel defaultSize={70} minSize={50}>
        <div className="w-full h-full flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b border-zinc-800 bg-zinc-950">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white">AI Code Review Studio</h1>
                      <p className="text-gray-400 text-sm mt-1">
                        Professional code analysis powered by Gemini AI
                      </p>
                    </div>
                  </div>
                  {selectedProject && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
                      <FolderKanban className="w-4 h-4 text-indigo-400" />
                      <span className="text-indigo-300 text-sm font-medium">{selectedProject}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-zinc-800/50 backdrop-blur">
                <TabsTrigger
                  value="empathetic"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Empathetic
                </TabsTrigger>
                <TabsTrigger
                  value="github"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Repository
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  <FolderKanban className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600 data-[state=active]:text-white"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Logs
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent value="empathetic" className="mt-0 h-full p-6">
                <EmpatheticCodeReviewEnhanced 
                  workspaceId={workspaceId}
                  userId={user.id}
                  selectedProject={selectedProject}
                />
              </TabsContent>

              <TabsContent value="github" className="mt-0 h-full p-6">
                <GitHubRepoReviewEnhanced 
                  workspaceId={workspaceId}
                  userId={user.id}
                  selectedProject={selectedProject}
                />
              </TabsContent>

              <TabsContent value="projects" className="mt-0 h-full p-6">
                <CodeReviewProjects 
                  workspaceId={workspaceId}
                  onSelectProject={setSelectedProject}
                  selectedProject={selectedProject}
                />
              </TabsContent>

              <TabsContent value="logs" className="mt-0 h-full p-6">
                <CodeReviewLogs workspaceId={workspaceId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-zinc-800 hover:bg-zinc-700" />

      {/* Right Sidebar - Chat */}
      <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
        <div className="h-full border-l border-zinc-800 bg-zinc-950">
          <WorkspaceChat 
            workspaceId={workspaceId}
            currentUser={user ? {
              id: user.id,
              name: user.fullName || user.username || "User",
              email: user.emailAddresses[0]?.emailAddress || "",
              image: user.imageUrl,
            } : undefined}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
