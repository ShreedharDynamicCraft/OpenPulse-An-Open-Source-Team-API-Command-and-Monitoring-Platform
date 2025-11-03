"use client";

import { useUser } from "@clerk/nextjs";
import { WorkspaceChat } from "@/modules/workspace/components/workspace-chat";
import { useWorkspaceStore } from "@/modules/Layout/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { selectedWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (isLoaded && user && !selectedWorkspace) {
      router.push("/");
    }
  }, [isLoaded, user, selectedWorkspace, router]);

  if (!isLoaded || !user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!selectedWorkspace) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No workspace selected</p>
          <p className="text-sm text-muted-foreground">Please select a workspace to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <WorkspaceChat
        workspaceId={selectedWorkspace.id}
        currentUser={{
          id: user.id,
          name: user.fullName || user.username || "User",
          email: user.emailAddresses[0]?.emailAddress || "",
          image: user.imageUrl,
        }}
      />
    </div>
  );
}
