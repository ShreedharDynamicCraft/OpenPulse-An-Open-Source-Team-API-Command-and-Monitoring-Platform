"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eraser, Download, Save, Grid3x3, ZoomIn, ZoomOut, 
  Undo, Redo, Palette, ArrowRight, Pencil 
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dynamic import for Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Palette className="h-8 w-8 text-primary" />
            </div>
          </div>
          <p className="text-lg font-semibold mb-2">Loading Professional Canvas</p>
          <p className="text-sm text-muted-foreground">Preparing your design workspace...</p>
        </div>
      </div>
    ),
  }
);

interface DrawingCanvasProps {
  onSave?: (data: any) => void;
  projectId?: string;
  initialData?: any;
}

export function DrawingCanvas({ onSave, projectId, initialData }: DrawingCanvasProps) {
  const [activeTab, setActiveTab] = useState<"design" | "whiteboard" | "flowchart">("design");
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!excalidrawAPI || !projectId) return;

    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 60000); // Auto-save every 60 seconds

    return () => clearInterval(autoSaveInterval);
  }, [excalidrawAPI, projectId]);

  const handleAutoSave = async () => {
    if (!excalidrawAPI) return;
    
    setAutoSaving(true);
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      
      onSave?.({
        elements,
        appState,
        timestamp: Date.now(),
        projectId,
        autoSave: true,
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setTimeout(() => setAutoSaving(false), 1000);
    }
  };

  const handleSave = async () => {
    if (!excalidrawAPI) {
      toast.error("Canvas not ready");
      return;
    }

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      
      onSave?.({
        elements,
        appState,
        timestamp: Date.now(),
        projectId,
        autoSave: false,
      });

      toast.success("Design saved successfully!");
    } catch (error) {
      console.error("Error saving canvas:", error);
      toast.error("Failed to save design");
    }
  };

  const handleExport = async (format: "png" | "svg" | "json") => {
    if (!excalidrawAPI) {
      toast.error("Canvas not ready");
      return;
    }

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      if (format === "json") {
        // Export as JSON
        const data = JSON.stringify({ elements, appState, files }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `design-${Date.now()}.excalidraw`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Export as image
        const blob = await excalidrawAPI.exportToBlob({
          elements,
          appState,
          files,
          mimeType: format === "png" ? "image/png" : "image/svg+xml",
          quality: 1.0,
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `design-${Date.now()}.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      }

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error exporting canvas:", error);
      toast.error("Failed to export design");
    }
  };

  const handleClear = () => {
    if (!excalidrawAPI) return;
    
    if (confirm("Are you sure you want to clear the entire canvas? This cannot be undone.")) {
      excalidrawAPI.resetScene();
      toast.success("Canvas cleared");
    }
  };

  const handleUndo = () => {
    if (!excalidrawAPI) return;
    excalidrawAPI.history.undo();
  };

  const handleRedo = () => {
    if (!excalidrawAPI) return;
    excalidrawAPI.history.redo();
  };

  const handleZoomIn = () => {
    if (!excalidrawAPI) return;
    const currentZoom = excalidrawAPI.getAppState().zoom.value;
    excalidrawAPI.updateScene({ appState: { zoom: { value: currentZoom * 1.2 } } });
  };

  const handleZoomOut = () => {
    if (!excalidrawAPI) return;
    const currentZoom = excalidrawAPI.getAppState().zoom.value;
    excalidrawAPI.updateScene({ appState: { zoom: { value: currentZoom * 0.8 } } });
  };

  const getInitialDataForTab = () => {
    const baseAppState = {
      viewBackgroundColor: "#ffffff",
      gridSize: gridEnabled ? 20 : null,
    };

    if (initialData) {
      return {
        elements: initialData.elements || [],
        appState: {
          ...baseAppState,
          ...initialData.appState,
        },
      };
    }

    return {
      elements: [],
      appState: baseAppState,
    };
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="border-b bg-muted/30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList>
                <TabsTrigger value="design" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="whiteboard" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Whiteboard
                </TabsTrigger>
                <TabsTrigger value="flowchart" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Flowchart
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="h-8" />

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleUndo} title="Undo (Ctrl+Z)">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRedo} title="Redo (Ctrl+Y)">
                <Redo className="h-4 w-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-8 mx-2" />
              
              <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button 
                variant={gridEnabled ? "default" : "ghost"} 
                size="icon" 
                onClick={() => setGridEnabled(!gridEnabled)}
                title="Toggle Grid"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {autoSaving && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Auto-saving...
              </span>
            )}
            
            <Select defaultValue="png" onValueChange={(v) => handleExport(v as any)}>
              <SelectTrigger className="w-[130px] h-9">
                <Download className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">Export PNG</SelectItem>
                <SelectItem value="svg">Export SVG</SelectItem>
                <SelectItem value="json">Save File</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleClear}>
              <Eraser className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          theme="light"
          initialData={getInitialDataForTab()}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t px-4 py-2 bg-muted/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>
              💡 <strong>Pro Tips:</strong> 
              {activeTab === "design" && " Use shapes, text, and arrows to create professional diagrams"}
              {activeTab === "whiteboard" && " Draw freely, add sticky notes, and brainstorm ideas"}
              {activeTab === "flowchart" && " Create process flows with rounded shapes and connectors"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span><kbd>Ctrl+Z</kbd> Undo</span>
            <span><kbd>Ctrl+Y</kbd> Redo</span>
            <span><kbd>Del</kbd> Delete</span>
            <span><kbd>Space</kbd> Pan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
