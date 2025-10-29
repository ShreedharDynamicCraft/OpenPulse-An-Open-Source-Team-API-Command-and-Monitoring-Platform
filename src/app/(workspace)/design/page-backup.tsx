"use client";

import { useState } from "react";
import { 
  Palette, Layers, Sparkles, FileText, Plus, Grid3x3, 
  Search, Filter, Star, Clock, TrendingUp, Zap, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreateProjectDialog } from "@/modules/design/components/create-project-dialog";
import { FigmaLikeCanvas } from "@/modules/design/components/figma-canvas";
import { ProjectsList } from "@/modules/design/components/projects-list";
import { useDesignProjects } from "@/modules/design/hooks/use-design-projects";
import { useWorkspaceStore } from "@/modules/Layout/store";
import { Skeleton } from "@/components/ui/skeleton";
import { designTemplates, templateCategories } from "@/modules/design/data/templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function DesignPage() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [canvasMode, setCanvasMode] = useState<"new" | "template">("new");
  
  const { selectedWorkspace } = useWorkspaceStore();
  const { projects, loading, error, refresh } = useDesignProjects(selectedWorkspace?.id);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setCanvasMode("template");
    setShowCanvas(true);
    toast.success(`Template "${template.name}" loaded!`);
  };

  const handleNewDesign = () => {
    setSelectedTemplate(null);
    setCanvasMode("new");
    setShowCanvas(true);
  };

  const filteredTemplates = designTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Fullscreen Canvas Modal */}
      {showCanvas && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="h-full flex flex-col">
            <div className="border-b px-6 py-4 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">
                    {canvasMode === "template" && selectedTemplate 
                      ? selectedTemplate.name 
                      : "New Design"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {canvasMode === "template" && selectedTemplate 
                      ? selectedTemplate.description 
                      : "Create your design from scratch"}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => {
                setShowCanvas(false);
                setSelectedTemplate(null);
              }}>
                Close Canvas
              </Button>
            </div>
            <div className="flex-1">
              <FigmaLikeCanvas
                projectId={selectedWorkspace?.id}
                onSave={(data: any) => {
                  console.log("Design saved:", data);
                  toast.success("Design saved successfully!");
                  refresh();
                }}
                initialData={selectedTemplate ? {
                  elements: selectedTemplate.elements,
                  appState: selectedTemplate.appState,
                } : undefined}
                onExport={(format: string, blob: Blob) => {
                  console.log(`Exported as ${format}`, blob);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Design Studio
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Create professional diagrams, wireframes, and designs with our industry-leading tools
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary" className="gap-1">
                  <Zap className="h-3 w-3" />
                  Professional Tools
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  Templates Library
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Export Ready
                </Badge>
              </div>
            </div>
            <Button size="lg" onClick={handleNewDesign} className="gap-2 h-12 px-8">
              <Plus className="h-5 w-5" />
              Create New Design
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 h-12">
            <TabsTrigger value="projects" className="gap-2">
              <Layers className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <Grid3x3 className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Tools
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Projects</h2>
                <p className="text-muted-foreground">Organize and manage your design projects</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleNewDesign} className="gap-2">
                  <Palette className="h-4 w-4" />
                  New Design
                </Button>
                <CreateProjectDialog onSuccess={refresh} />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
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
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-destructive/10 p-4 mb-4">
                    <FileText className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Failed to Load Projects</h3>
                  <p className="text-muted-foreground text-center mb-4">{error}</p>
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
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-primary/10 p-6 mb-4">
                    <Layers className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Start by creating your first design project or use one of our professional templates
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={handleNewDesign} size="lg" className="gap-2">
                      <Plus className="h-5 w-5" />
                      Create First Design
                    </Button>
                    <CreateProjectDialog onSuccess={refresh} />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Professional Templates</h2>
                <p className="text-muted-foreground">Start with pre-designed templates and customize them</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templateCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{template.thumbnail}</div>
                      {template.isPremium && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {template.name}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Recent Designs</h2>
              <p className="text-muted-foreground">Quick access to your latest work</p>
            </div>

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No recent activity</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Your recent designs will appear here for quick access
                </p>
                <Button onClick={handleNewDesign} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Start Designing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Design Tools</h2>
              <p className="text-muted-foreground">Enhance your designs with artificial intelligence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "AI Design Generator",
                  description: "Generate complete designs from text descriptions",
                  badge: "Coming Soon",
                  color: "text-purple-500",
                },
                {
                  icon: Wand2,
                  title: "Smart Suggestions",
                  description: "Get intelligent design improvement recommendations",
                  badge: "Beta",
                  color: "text-blue-500",
                },
                {
                  icon: Palette,
                  title: "Color Palette AI",
                  description: "Generate harmonious color schemes automatically",
                  badge: "Active",
                  color: "text-pink-500",
                },
                {
                  icon: Grid3x3,
                  title: "Layout Optimizer",
                  description: "Optimize layouts for better visual hierarchy",
                  badge: "Active",
                  color: "text-orange-500",
                },
              ].map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`rounded-lg bg-gradient-to-br from-background to-muted p-3 ${tool.color}`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <Badge variant={tool.badge === "Active" ? "default" : "secondary"}>
                        {tool.badge}
                      </Badge>
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled={tool.badge !== "Active"}
                    >
                      {tool.badge === "Active" ? "Try Now" : tool.badge}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
