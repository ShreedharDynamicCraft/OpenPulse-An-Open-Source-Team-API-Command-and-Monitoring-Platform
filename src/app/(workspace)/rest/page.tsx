"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useWorkspaceStore } from "@/modules/Layout/store";
import RequestPlayground from "@/modules/request/components/request-playground";

import TabbedSidebar from "@/modules/workspace/components/sidebar";

import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import { Loader } from "lucide-react";

const RestPage = () => {
  const { selectedWorkspace } = useWorkspaceStore();
  const { data: currentWorkspace, isLoading } = useGetWorkspace( selectedWorkspace?.id!);

  if (isLoading || !selectedWorkspace?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin h-6 w-6 text-indigo-500" />
      </div>
    );
  }

return (
  <ResizablePanelGroup direction="horizontal" className="h-full w-full">
    <ResizablePanel defaultSize={65} minSize={40} className="h-full">
        <RequestPlayground />
    </ResizablePanel>

    <ResizableHandle withHandle />

    <ResizablePanel defaultSize={35} maxSize={40} minSize={25} className="flex h-full overflow-hidden">
      <div className="flex-1 h-full overflow-hidden">
        <TabbedSidebar currentWorkspace={currentWorkspace} />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
)
};

export default RestPage;
