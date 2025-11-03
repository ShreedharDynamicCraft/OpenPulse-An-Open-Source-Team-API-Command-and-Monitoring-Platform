"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Code, 
  FileText, 
  Users, 
  Send, 
  Save, 
  FolderOpen,
  History,
  TestTube,
  Settings,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  shortcut?: string;
  color: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Send,
    title: "New Request",
    description: "Create and send HTTP requests instantly",
    shortcut: "Ctrl+Shift+N",
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-blue-600/20"
  },
  {
    icon: Save,
    title: "Save Request",
    description: "Save requests to collections for reuse",
    shortcut: "Ctrl+S",
    color: "text-green-500",
    gradient: "from-green-500/20 to-green-600/20"
  },
  {
    icon: FolderOpen,
    title: "Collections",
    description: "Organize requests in collections and folders",
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-600/20"
  },
  {
    icon: Code,
    title: "Code Snippets",
    description: "Generate code in multiple languages",
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-orange-600/20"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workspaces with your team",
    color: "text-pink-500",
    gradient: "from-pink-500/20 to-pink-600/20"
  },
  {
    icon: History,
    title: "Request History",
    description: "Track all your API requests",
    color: "text-indigo-500",
    gradient: "from-indigo-500/20 to-indigo-600/20"
  },
  {
    icon: TestTube,
    title: "Test Scripts",
    description: "Write automated tests for your APIs",
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 to-cyan-600/20"
  },
  {
    icon: Settings,
    title: "Environment Variables",
    description: "Manage variables across environments",
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-amber-600/20"
  }
];

export function FeatureShowcase() {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if user has seen the showcase
    const hasSeenShowcase = localStorage.getItem("hasSeenFeatureShowcase");
    if (hasSeenShowcase) {
      setIsVisible(false);
    } else {
      setHasAnimated(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenFeatureShowcase", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border-zinc-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 border-b border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  API Testing Platform Features
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    New
                  </Badge>
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Discover powerful features to supercharge your API testing workflow
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isSelected = selectedFeature === index;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "group relative cursor-pointer transition-all duration-300",
                    hasAnimated && "animate-in slide-in-from-bottom-4 fade-in",
                    isSelected && "scale-[1.02]"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedFeature(isSelected ? null : index)}
                  onMouseEnter={() => setSelectedFeature(index)}
                  onMouseLeave={() => setSelectedFeature(null)}
                >
                  <div className={cn(
                    "relative p-5 rounded-xl border transition-all duration-300",
                    "bg-zinc-800/50 border-zinc-700",
                    "hover:bg-zinc-800 hover:border-zinc-600",
                    "hover:shadow-lg hover:shadow-black/20",
                    isSelected && "bg-zinc-800 border-zinc-600 shadow-lg"
                  )}>
                    {/* Gradient Background */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                      `bg-gradient-to-br ${feature.gradient}`,
                      isSelected && "opacity-100"
                    )} />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          "w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300",
                          "bg-zinc-700/50 group-hover:scale-110",
                          isSelected && "scale-110 shadow-lg"
                        )}>
                          <Icon className={cn("w-5 h-5", feature.color)} />
                        </div>
                        
                        {feature.shortcut && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "font-mono text-xs bg-zinc-700/50 text-zinc-300 border-0",
                              "transition-all duration-300",
                              isSelected && "bg-zinc-700 text-white"
                            )}
                          >
                            {feature.shortcut}
                          </Badge>
                        )}
                      </div>

                      <h3 className={cn(
                        "text-lg font-semibold mb-2 transition-colors",
                        "text-zinc-100 group-hover:text-white"
                      )}>
                        {feature.title}
                      </h3>
                      
                      <p className={cn(
                        "text-sm leading-relaxed transition-colors",
                        "text-zinc-400 group-hover:text-zinc-300"
                      )}>
                        {feature.description}
                      </p>

                      {/* Hover Arrow */}
                      <div className={cn(
                        "absolute right-4 bottom-4 transition-all duration-300",
                        "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                      )}>
                        <ChevronRight className={cn("w-5 h-5", feature.color)} />
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500",
                      "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                      "group-hover:opacity-100 group-hover:animate-shine"
                    )} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-white">Pro Tip:</span> Use keyboard shortcuts to speed up your workflow. Press{" "}
                  <kbd className="px-2 py-1 rounded bg-zinc-700 text-xs font-mono text-zinc-200">Ctrl+Shift+N</kbd>{" "}
                  for new requests and{" "}
                  <kbd className="px-2 py-1 rounded bg-zinc-700 text-xs font-mono text-zinc-200">Ctrl+S</kbd>{" "}
                  to save.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="sticky bottom-0 p-6 bg-gradient-to-t from-zinc-900 via-zinc-900/95 to-transparent border-t border-zinc-700">
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
          >
            Get Started
          </button>
        </div>
      </Card>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shine {
          animation: shine 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
