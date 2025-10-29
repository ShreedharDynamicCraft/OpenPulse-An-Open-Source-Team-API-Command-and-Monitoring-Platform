"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye, EyeOff, Lock, Unlock, Trash2, Copy,
  Square, Circle, Type, Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Layer {
  id: string;
  type: "rectangle" | "ellipse" | "text" | "image" | "group";
  name: string;
  visible: boolean;
  locked: boolean;
  children?: Layer[];
}

interface LayersPanelProps {
  layers?: Layer[];
  selectedLayerId?: string;
  onLayerSelect?: (id: string) => void;
  onLayerToggleVisibility?: (id: string) => void;
  onLayerToggleLock?: (id: string) => void;
  onLayerDelete?: (id: string) => void;
}

export function LayersPanel({
  layers = [],
  selectedLayerId,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerDelete,
}: LayersPanelProps) {
  const getLayerIcon = (type: string) => {
    switch (type) {
      case "rectangle": return Square;
      case "ellipse": return Circle;
      case "text": return Type;
      case "image": return ImageIcon;
      default: return Square;
    }
  };

  const renderLayer = (layer: Layer, depth = 0) => {
    const Icon = getLayerIcon(layer.type);
    const isSelected = layer.id === selectedLayerId;

    return (
      <div key={layer.id} style={{ paddingLeft: `${depth * 16}px` }}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer group ${
            isSelected ? "bg-primary/10" : ""
          }`}
          onClick={() => onLayerSelect?.(layer.id)}
        >
          <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="flex-1 text-sm truncate">{layer.name}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onLayerToggleVisibility?.(layer.id);
              }}
            >
              {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onLayerToggleLock?.(layer.id);
              }}
            >
              {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        {layer.children?.map((child) => renderLayer(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="w-64 border-l bg-background flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Layers</h3>
          <Badge variant="secondary" className="text-xs">
            {layers.length}
          </Badge>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {layers.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <Square className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No layers yet</p>
              <p className="text-xs mt-1">Create shapes to see them here</p>
            </div>
          ) : (
            layers.map((layer) => renderLayer(layer))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface PropertiesPanelProps {
  selectedElement?: any;
  onPropertyChange?: (property: string, value: any) => void;
}

export function PropertiesPanel({
  selectedElement,
  onPropertyChange,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="w-64 border-r bg-background flex flex-col h-full">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-sm text-muted-foreground">
            <Square className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No selection</p>
            <p className="text-xs mt-1">Select an element to edit properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Properties</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Position */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Position</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">X</Label>
                <Input
                  type="number"
                  className="h-8"
                  value={selectedElement.x || 0}
                  onChange={(e) => onPropertyChange?.("x", Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Y</Label>
                <Input
                  type="number"
                  className="h-8"
                  value={selectedElement.y || 0}
                  onChange={(e) => onPropertyChange?.("y", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Size</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">W</Label>
                <Input
                  type="number"
                  className="h-8"
                  value={selectedElement.width || 0}
                  onChange={(e) => onPropertyChange?.("width", Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">H</Label>
                <Input
                  type="number"
                  className="h-8"
                  value={selectedElement.height || 0}
                  onChange={(e) => onPropertyChange?.("height", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Fill */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Fill</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                className="h-8 w-12 p-1"
                value={selectedElement.backgroundColor || "#ffffff"}
                onChange={(e) => onPropertyChange?.("backgroundColor", e.target.value)}
              />
              <Input
                type="text"
                className="h-8 flex-1"
                value={selectedElement.backgroundColor || "#ffffff"}
                onChange={(e) => onPropertyChange?.("backgroundColor", e.target.value)}
              />
            </div>
          </div>

          {/* Stroke */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Stroke</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                className="h-8 w-12 p-1"
                value={selectedElement.strokeColor || "#000000"}
                onChange={(e) => onPropertyChange?.("strokeColor", e.target.value)}
              />
              <Input
                type="text"
                className="h-8 flex-1"
                value={selectedElement.strokeColor || "#000000"}
                onChange={(e) => onPropertyChange?.("strokeColor", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Width</Label>
              <Slider
                value={[selectedElement.strokeWidth || 1]}
                onValueChange={([value]) => onPropertyChange?.("strokeWidth", value)}
                min={0}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <Separator />

          {/* Opacity */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[selectedElement.opacity || 100]}
                onValueChange={([value]) => onPropertyChange?.("opacity", value)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {selectedElement.opacity || 100}%
              </span>
            </div>
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Rotation</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[selectedElement.angle || 0]}
                onValueChange={([value]) => onPropertyChange?.("angle", value)}
                min={0}
                max={360}
                step={1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {selectedElement.angle || 0}°
              </span>
            </div>
          </div>

          <Separator />

          {/* Corner Radius (for rectangles) */}
          {selectedElement.type === "rectangle" && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Corner Radius</Label>
              <Slider
                value={[selectedElement.roundness || 0]}
                onValueChange={([value]) => onPropertyChange?.("roundness", value)}
                min={0}
                max={100}
                step={1}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
