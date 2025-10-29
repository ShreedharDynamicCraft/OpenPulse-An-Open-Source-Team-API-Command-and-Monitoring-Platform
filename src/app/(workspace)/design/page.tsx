"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Sparkles, FileCode } from "lucide-react";
import { AIDesignAssistant } from "@/modules/design/components/ai-design-assistant";
import { TemplateGallery } from "@/modules/design/components/template-gallery";
import { toast } from "sonner";
import type { Editor } from "tldraw";

const Tldraw = dynamic(
  async () => (await import("tldraw")).Tldraw,
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading canvas...</p>
        </div>
      </div>
    ),
  }
);

export default function DesignPage() {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  const handleApplyDesign = (design: any) => {
    if (!editorRef.current) {
      toast.error("Canvas not ready. Please wait a moment.");
      return;
    }

    try {
      const editor = editorRef.current;
      
      // Create text shapes for each endpoint
      let yOffset = 100;
      const shapes: any[] = [];
      
      // Add title
      const titleId = editor.createShapeId();
      shapes.push({
        id: titleId,
        type: 'text',
        x: 100,
        y: 50,
        props: {
          text: design.title || 'API Design',
          size: 'xl',
          color: 'blue',
        },
      });

      // Add description
      if (design.description) {
        const descId = editor.createShapeId();
        shapes.push({
          id: descId,
          type: 'text',
          x: 100,
          y: 100,
          props: {
            text: design.description,
            size: 'm',
            color: 'black',
          },
        });
        yOffset = 150;
      }

      // Add endpoints as boxes
      design.endpoints?.forEach((endpoint: any, index: number) => {
        const boxId = editor.createShapeId();
        shapes.push({
          id: boxId,
          type: 'geo',
          x: 100,
          y: yOffset + (index * 150),
          props: {
            geo: 'rectangle',
            w: 400,
            h: 100,
            text: `${endpoint.method} ${endpoint.path}\n\n${endpoint.description}`,
            color: endpoint.method === 'GET' ? 'blue' : 
                   endpoint.method === 'POST' ? 'green' :
                   endpoint.method === 'PUT' ? 'orange' :
                   endpoint.method === 'DELETE' ? 'red' : 'grey',
          },
        });
      });

      editor.createShapes(shapes);
      editor.zoomToFit();
      
      toast.success("Design applied to canvas!");
    } catch (error) {
      console.error("Error applying design:", error);
      toast.error("Failed to apply design. Please try again.");
    }
  };

  const handleSelectTemplate = (template: any) => {
    if (!editorRef.current) {
      toast.error("Canvas not ready. Please wait a moment.");
      return;
    }

    try {
      const editor = editorRef.current;
      
      // Clear existing shapes
      editor.selectAll();
      editor.deleteShapes(editor.getSelectedShapeIds());
      
      // Create shapes from template (tldraw will auto-generate IDs)
      const shapes = template.content.shapes.map((shape: any) => ({
        type: 'geo',
        x: shape.x,
        y: shape.y,
        props: {
          geo: 'rectangle',
          w: shape.props.w,
          h: shape.props.h,
          text: shape.props.text,
          color: 'blue',
        },
      }));

      editor.createShapes(shapes);
      editor.zoomToFit();
      
      toast.success(`Template "${template.name}" loaded!`);
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Failed to load template. Please try again.");
    }
  };

  const handleMount = (editor: Editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full w-full relative">
      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={() => setShowTemplateGallery(true)}
          className="shadow-lg"
          variant="secondary"
        >
          <FileCode className="w-4 h-4 mr-2" />
          Templates
        </Button>
        <Button
          onClick={() => setShowAIAssistant(true)}
          className="shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Assistant
        </Button>
      </div>

      {/* Canvas */}
      <Tldraw 
        autoFocus 
        onMount={handleMount}
      />

      {/* AI Design Assistant Dialog */}
      <AIDesignAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onApplyDesign={handleApplyDesign}
      />

      {/* Template Gallery Dialog */}
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
