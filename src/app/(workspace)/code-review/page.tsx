"use client";

import { useWorkspaceStore } from "@/modules/Layout/store";
import { CodeReviewModuleEnhanced } from "@/modules/ai/components";
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

  return <CodeReviewModuleEnhanced workspaceId={selectedWorkspace.id} />;
};

export default CodeReviewPage;
