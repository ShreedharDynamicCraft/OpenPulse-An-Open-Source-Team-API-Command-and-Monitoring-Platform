"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Github } from "lucide-react";
import { EmpatheticCodeReview } from "./empathetic-code-review";
import { GitHubRepoReview } from "./github-repo-review";

interface CodeReviewModuleProps {
  workspaceId: string;
}

export function CodeReviewModule({ workspaceId }: CodeReviewModuleProps) {
  const [activeTab, setActiveTab] = useState("empathetic");

  return (
    <div className="w-full h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-zinc-800">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">AI Code Review</h1>
            <p className="text-gray-400">
              Transform code reviews into educational, constructive feedback with AI
            </p>
          </div>
          
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-zinc-800">
            <TabsTrigger
              value="empathetic"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Empathetic Review
            </TabsTrigger>
            <TabsTrigger
              value="github"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub Repo Review
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto px-6 py-6">
          <TabsContent value="empathetic" className="mt-0">
            <EmpatheticCodeReview workspaceId={workspaceId} />
          </TabsContent>

          <TabsContent value="github" className="mt-0">
            <GitHubRepoReview workspaceId={workspaceId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
