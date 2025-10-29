"use client";

import { useState, useRef } from "react";
import { Palette, Upload, Sparkles, FileText, Layers, Wand2, Image as ImageIcon, FolderPlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreateProjectDialog } from "@/modules/design/components/create-project-dialog";
import { DrawingCanvas } from "@/modules/design/components/drawing-canvas";
import { ProjectsList } from "@/modules/design/components/projects-list";
import { useDesignProjects } from "@/modules/design/hooks/use-design-projects";
import { useWorkspaceStore } from "@/modules/Layout/store";
import { Skeleton } from "@/components/ui/skeleton";

export default function DesignPage() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{id: string, name: string, type: string, size: number, preview?: string}>>([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { selectedWorkspace } = useWorkspaceStore();
  const { projects, loading, error, refresh } = useDesignProjects(selectedWorkspace?.id);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`, {
          description: "Only PNG, JPG, SVG, and WebP files are supported"
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}`, {
          description: "Maximum file size is 10MB"
        });
        return;
      }

      // Create preview URL for images
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          preview: e.target?.result as string
        };
        setUploadedFiles(prev => [...prev, newFile]);
        toast.success(`Uploaded: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    toast.success("File removed");
  };

  return (
    <div className="flex flex-col h-full p-6 overflow-auto">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-8 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Palette className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Design & System Design</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Create, collaborate, and manage your design files with AI-powered insights
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {uploadedFiles.length} Files
            </Badge>
            <Button 
              onClick={handleUploadClick}
              variant="secondary"
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Design
            </Button>
          </div>
        </div>
      </div>

      {/* Drawing Canvas Modal */}
      {showCanvas && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="h-full flex flex-col">
            <div className="border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Design Canvas</h2>
              <Button variant="outline" onClick={() => setShowCanvas(false)}>
                Close Canvas
              </Button>
            </div>
            <div className="flex-1">
              <DrawingCanvas onSave={(data) => {
                console.log("Design saved:", data);
                toast.success("Design saved successfully!");
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="projects" className="flex-1">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Design Projects</h2>
              <p className="text-muted-foreground">Organize your design files into projects</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCanvas(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                New Design
              </Button>
              <CreateProjectDialog onSuccess={refresh} />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={refresh} variant="outline">Try Again</Button>
              </CardContent>
            </Card>
          )}

          {/* Projects List */}
          {!loading && !error && projects.length > 0 && (
            <ProjectsList projects={projects} />
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Layers className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first design project to start organizing your files
                </p>
                <Button onClick={() => setShowCanvas(true)} variant="default" className="mr-2">
                  <Pencil className="h-4 w-4 mr-2" />
                  Create Your First Design
                </Button>
                <CreateProjectDialog onSuccess={refresh} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Canvas Tab */}
        <TabsContent value="canvas" className="h-[calc(100vh-200px)]">
          <DrawingCanvas onSave={(data) => {
            console.log("Design saved:", data);
            toast.success("Design saved successfully!");
          }} />
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Design Files</h2>
              <p className="text-muted-foreground">Upload and manage your design files</p>
            </div>
            <Button onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>

          {/* Uploaded Files Grid */}
          {uploadedFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {uploadedFiles.map((file) => (
                <Card key={file.id} className="group relative hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    {/* File Preview */}
                    <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-lg overflow-hidden">
                      {file.preview && (
                        <img 
                          src={file.preview} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    {/* File Info */}
                    <div className="p-4">
                      <h4 className="font-medium text-sm truncate mb-1">{file.name}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{file.type.split('/')[1].toUpperCase()}</span>
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No files uploaded</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Upload PNG, JPG, SVG, or WebP files to get started
                </p>
                <Button onClick={handleUploadClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Design Templates</h2>
            <p className="text-muted-foreground">Start with pre-built templates and component libraries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Dashboard UI Kit", isPremium: false, tags: ["UI", "Dashboard"] },
              { name: "Mobile App Design", isPremium: true, tags: ["Mobile", "iOS"] },
              { name: "Design System", isPremium: false, tags: ["Components", "System"] },
              { name: "Landing Page", isPremium: false, tags: ["Web", "Marketing"] },
              { name: "E-commerce UI", isPremium: true, tags: ["Shop", "Product"] },
              { name: "Admin Panel", isPremium: false, tags: ["Admin", "Dashboard"] },
            ].map((template, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.isPremium && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-md mb-3" />
                  <Button size="sm" className="w-full">Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">AI Design Assistant</h2>
            <p className="text-muted-foreground">Get AI-powered suggestions and design insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 dark:border-purple-900">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle>Design Review</CardTitle>
                </div>
                <CardDescription>
                  Get AI feedback on your designs for accessibility, consistency, and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Review
                </Button>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 dark:border-pink-900">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  <CardTitle>Generate Variations</CardTitle>
                </div>
                <CardDescription>
                  Create multiple design variations with AI to explore different concepts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 dark:border-indigo-900">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle>Component Analysis</CardTitle>
                </div>
                <CardDescription>
                  Analyze your design components for reusability and design system compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Layers className="mr-2 h-4 w-4" />
                  Analyze
                </Button>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle>Design Tokens</CardTitle>
                </div>
                <CardDescription>
                  Extract design tokens from your files automatically for design systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <FileText className="mr-2 h-4 w-4" />
                  Extract Tokens
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Suggestions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent AI Suggestions</CardTitle>
              <CardDescription>AI-generated insights for your designs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No suggestions yet. Upload or import designs to get AI insights.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
