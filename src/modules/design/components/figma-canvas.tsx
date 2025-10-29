"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { 
  Save, Download, Upload, Undo, Redo, ZoomIn, ZoomOut, 
  Grid3x3, Maximize2, Settings, Share2, Layers as LayersIcon,
  Type, Square, Circle, Triangle, Minus, ArrowRight, Image as ImageIcon,
  Pencil, Eraser, PaintBucket, Move, Hand
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dynamic import for Excalidraw
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Design Studio</h3>
            <p className="text-sm text-muted-foreground">Preparing professional tools...</p>
          </div>
        </div>
      </div>
    )
  }
);

interface FigmaLikeCanvasProps {
  projectId?: string;
  initialData?: any;
  onSave?: (data: any) => void;
  onExport?: (format: string, blob: Blob) => void;
}

export function FigmaLikeCanvas({ 
  projectId, 
  initialData, 
  onSave, 
  onExport 
}: FigmaLikeCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"design" | "prototype" | "inspect">("design");
  const [tool, setTool] = useState<string>("selection");
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-save functionality
  useEffect(() => {
    if (!excalidrawAPI || !autoSave) return;

    const interval = setInterval(() => {
      handleSave(true);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [excalidrawAPI, autoSave]);

  const handleSave = useCallback(async (silent = false) => {
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const data = {
        elements,
        appState,
        files,
        projectId,
        timestamp: Date.now(),
      };

      onSave?.(data);
      setLastSaved(new Date());
      
      if (!silent) {
        toast.success("Design saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      if (!silent) {
        toast.error("Failed to save design");
      }
    }
  }, [excalidrawAPI, projectId, onSave]);

  const handleExportImage = useCallback(async (format: "png" | "svg") => {
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const blob = await excalidrawAPI.exportToBlob({
        elements,
        appState,
        files,
        mimeType: format === "png" ? "image/png" : "image/svg+xml",
        quality: 1,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `design-${Date.now()}.${format}`;
      link.click();
      URL.revokeObjectURL(url);

      onExport?.(format, blob);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export design");
    }
  }, [excalidrawAPI, onExport]);

  const handleZoomChange = useCallback((value: number) => {
    if (!excalidrawAPI) return;
    setZoom(value);
    excalidrawAPI.updateScene({ 
      appState: { zoom: { value: value / 100 } } 
    });
  }, [excalidrawAPI]);

  const handleUndo = useCallback(() => {
    excalidrawAPI?.history.undo();
  }, [excalidrawAPI]);

  const handleRedo = useCallback(() => {
    excalidrawAPI?.history.redo();
  }, [excalidrawAPI]);

  const toggleFullscreen = useCallback(() => {
    if (!canvasRef.current) return;

    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const tools = [
    { id: "selection", icon: Move, label: "Select (V)" },
    { id: "hand", icon: Hand, label: "Hand (H)" },
    { id: "rectangle", icon: Square, label: "Rectangle (R)" },
    { id: "circle", icon: Circle, label: "Ellipse (O)" },
    { id: "triangle", icon: Triangle, label: "Triangle (T)" },
    { id: "line", icon: Minus, label: "Line (L)" },
    { id: "arrow", icon: ArrowRight, label: "Arrow (A)" },
    { id: "text", icon: Type, label: "Text (T)" },
    { id: "pencil", icon: Pencil, label: "Draw (P)" },
    { id: "image", icon: ImageIcon, label: "Image (I)" },
  ];

  return (
    <TooltipProvider>
      <div ref={canvasRef} className="h-full flex flex-col bg-background">
        {/* Top Toolbar - Figma Style */}
        <div className="h-14 border-b bg-muted/30 flex items-center px-4 gap-3">
          {/* Left Section - Tools */}
          <div className="flex items-center gap-1">
            {tools.slice(0, 2).map((t) => (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === t.id ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTool(t.id)}
                  >
                    <t.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {tools.slice(2).map((t) => (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === t.id ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTool(t.id)}
                  >
                    <t.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Center Section - Mode Selector */}
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === "design" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("design")}
            >
              Design
            </Button>
            <Button
              variant={viewMode === "prototype" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("prototype")}
            >
              Prototype
            </Button>
            <Button
              variant={viewMode === "inspect" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("inspect")}
            >
              Inspect
            </Button>
          </div>

          <div className="flex-1" />

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo}>
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Undo (Ctrl+Z)</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRedo}>
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Redo (Ctrl+Y)</p></TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Select value={zoom.toString()} onValueChange={(v) => handleZoomChange(Number(v))}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="150">150%</SelectItem>
                <SelectItem value="200">200%</SelectItem>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showGrid ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Toggle Grid</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Fullscreen</p></TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Select defaultValue="png" onValueChange={(v) => handleExportImage(v as any)}>
              <SelectTrigger className="w-28 h-8">
                <Download className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
              </SelectContent>
            </Select>

            <Button size="sm" className="h-8" onClick={() => handleSave(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button size="sm" variant="default" className="h-8">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={initialData || {
              elements: [],
              appState: {
                viewBackgroundColor: "#ffffff",
                gridSize: showGrid ? 20 : null,
                zoom: { value: zoom / 100 },
              },
            }}
            theme="light"
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="h-8 border-t bg-muted/30 flex items-center px-4 justify-between text-xs">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="h-5">
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Mode
            </Badge>
            <span className="text-muted-foreground">
              {zoom}% zoom
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">V</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">R</kbd> Rectangle</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">T</kbd> Text</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Space</kbd> Pan</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
