"use client";

import { useWorkspaceStore } from "@/modules/Layout/store";
import { CodeReviewModule } from "@/modules/ai/components";
import { Loader2 } from "lucide-react";

const CodeReviewPage = () => {
  const { selectedWorkspace } = useWorkspaceStore();

  if (!selectedWorkspace?.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <CodeReviewModule workspaceId={selectedWorkspace.id} />
      </div>
    </div>
  );
};

export default CodeReviewPage;
