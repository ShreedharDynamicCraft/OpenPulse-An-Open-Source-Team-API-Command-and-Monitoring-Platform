"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Sparkles, FileCode, Save, FolderOpen } from "lucide-react";
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

  // Helper to ensure shape IDs start with "shape:"
  const ensureShapeId = (id?: string) => {
    if (!id) return `shape:${Math.random().toString(36).slice(2, 11)}`;
    return id.startsWith("shape:") ? id : `shape:${id}`;
  };

  const handleApplyDesign = (design: any) => {
    if (!editorRef.current) {
      toast.error("Canvas not ready. Please wait a moment.");
      return;
    }

    try {
      const editor = editorRef.current;
      
      let yOffset = 100;
      const shapesToCreate: any[] = [];

      // Add title as geo shape with richText
      const titleId = ensureShapeId();
      shapesToCreate.push({
        id: titleId,
        type: 'geo',
        x: 100,
        y: 50,
        props: {
          w: 400,
          h: 80,
          geo: 'rectangle',
          color: 'blue',
          fill: 'solid',
          richText: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: design.title || 'API Design' }]
              }
            ]
          },
        },
      });

      // Add description as geo shape with richText
      if (design.description) {
        const descId = ensureShapeId();
        shapesToCreate.push({
          id: descId,
          type: 'geo',
          x: 100,
          y: 160,
          props: {
            w: 400,
            h: 100,
            geo: 'rectangle',
            color: 'yellow',
            fill: 'solid',
            richText: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: design.description }]
                }
              ]
            },
          },
        });
        yOffset = 280;
      }

      // Add endpoint geo shapes with richText
      design.endpoints?.forEach((endpoint: any, index: number) => {
        const geoId = ensureShapeId();
        const methodColor = endpoint.method === 'GET' ? 'blue' : 
                           endpoint.method === 'POST' ? 'green' :
                           endpoint.method === 'PUT' ? 'orange' :
                           endpoint.method === 'DELETE' ? 'red' : 'grey';
        shapesToCreate.push({
          id: geoId,
          type: 'geo',
          x: 100,
          y: yOffset + index * 120,
          props: {
            w: 400,
            h: 100,
            geo: 'rectangle',
            color: methodColor,
            fill: 'semi',
            richText: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ 
                    type: 'text', 
                    text: `${endpoint.method} ${endpoint.path}\n${endpoint.description || ''}` 
                  }]
                }
              ]
            },
          },
        });
      });

      // Create all shapes
      if (shapesToCreate.length > 0) {
        console.log('Creating AI design shapes:', shapesToCreate);
        editor.createShapes(shapesToCreate);
        
        // Zoom to fit
        setTimeout(() => {
          editor.zoomToFit({ animation: { duration: 200 } });
        }, 100);
        
        toast.success(`Design applied to canvas with ${shapesToCreate.length} shapes!`);
      } else {
        toast.error("No shapes to create from design");
      }
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

      // Clear existing shapes first
      const allShapes = editor.getCurrentPageShapeIds();
      if (allShapes.size > 0) {
        editor.deleteShapes(Array.from(allShapes));
      }

      // Convert template shapes to tldraw format - use geo shapes with richText
      const shapesToCreate: any[] = [];
      
      (template?.content?.shapes || []).forEach((shape: any) => {
        const x = shape.x ?? 100;
        const y = shape.y ?? 100;
        const text = shape.props?.text || 'Template Item';
        
        // Create geo shape for each template shape with richText
        const shapeId = ensureShapeId();
        shapesToCreate.push({
          id: shapeId,
          type: 'geo',
          x,
          y,
          props: {
            w: 300,
            h: 80,
            geo: 'rectangle',
            color: 'blue',
            fill: 'semi',
            richText: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text }]
                }
              ]
            },
          },
        });
      });

      // Create all shapes
      if (shapesToCreate.length > 0) {
        console.log('Creating shapes:', shapesToCreate);
        editor.createShapes(shapesToCreate);
        
        // Zoom to fit
        setTimeout(() => {
          editor.zoomToFit({ animation: { duration: 200 } });
        }, 100);
        
        toast.success(`Template "${template.name}" loaded with ${shapesToCreate.length} shapes!`);
      } else {
        toast.error("Template has no shapes to load");
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Failed to load template. Please try again.");
    }
  };

  const handleMount = (editor: Editor) => {
    editorRef.current = editor;
  };

  const storageKey = (id = "default") => `design:draft:${id}`;

  const normalizeDocForSave = (doc: any) => {
    if (!doc) return doc;
    const shapes = doc.shapes || {};
    const normalized: any = { ...doc, shapes: {} };
    Object.keys(shapes).forEach((k) => {
      const shape = shapes[k] as any;
      const id = ensureShapeId(shape?.id ?? k);
      normalized.shapes[id] = { ...shape, id };
    });
    return normalized;
  };

  const saveDesignToLocal = (silent = false) => {
    const editor = editorRef.current as any;
    if (!editor) {
      // Don't show error if silent (autosave)
      return;
    }

    try {
      const doc = editor.document || editor.getDocument?.() || null;
      if (!doc) {
        // Don't show error for missing document (canvas might be initializing)
        return;
      }

      const normalized = normalizeDocForSave(doc);
      // don't save empty docs
      const shapeCount = Object.keys(normalized.shapes || {}).length;
      if (!shapeCount) {
        // Only show error for manual save attempts on empty canvas
        if (!silent) {
          toast.info("Canvas is empty. Draw something to save.");
        }
        return;
      }

      localStorage.setItem(storageKey(), JSON.stringify(normalized));
      if (!silent) {
        toast.success("Design saved locally. You can resume later.");
      }
    } catch (e: any) {
      console.error("Error saving design:", e);
      if (!silent) {
        toast.error("Failed to save design");
      }
    }
  };

  const loadDesignFromLocal = () => {
    const editor = editorRef.current as any;
    if (!editor) {
      toast.error("Canvas not ready");
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey());
      if (!raw) {
        toast.error("No saved draft found");
        return;
      }
      const rawDoc = JSON.parse(raw);
      // Normalize ids in stored document
      const doc = normalizeDocForSave(rawDoc);

      if (typeof editor.replaceDocument === 'function') {
        editor.replaceDocument(doc);
      } else if (typeof editor.loadDocument === 'function') {
        editor.loadDocument(doc);
      } else {
        // best effort: create shapes (ensure ids are valid)
        const shapes = Object.values(doc.shapes || {}).map((s: any) => ({ ...s, id: ensureShapeId(s.id) }));
        if (shapes.length && typeof editor.createShapes === 'function') {
          editor.createShapes(shapes as any[]);
        }
      }
      if (typeof editor.zoomToFit === 'function') editor.zoomToFit();
      toast.success("Draft loaded");
    } catch (e: any) {
      console.error("Error loading draft:", e);
      toast.error("Failed to load draft");
    }
  };

  // Auto-save every 10s (silent)
  useEffect(() => {
    const id = setInterval(() => {
      try {
        saveDesignToLocal(true);
      } catch (_) {}
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full w-full relative">
      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 z-[100] flex gap-2">
        <Button
          onClick={() => setShowTemplateGallery(true)}
          className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          variant="outline"
        >
          <FileCode className="w-4 h-4 mr-2" />
          Templates
        </Button>
        <Button 
          onClick={() => saveDesignToLocal(false)} 
          className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" 
          variant="outline"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button 
          onClick={() => loadDesignFromLocal()} 
          className="shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" 
          variant="outline"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Load
        </Button>
        <Button
          onClick={() => setShowAIAssistant(true)}
          className="shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
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
