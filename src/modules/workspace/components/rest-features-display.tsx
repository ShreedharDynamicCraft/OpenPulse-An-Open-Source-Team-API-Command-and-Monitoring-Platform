"use client";

import { 
  Send, 
  Save, 
  FolderOpen,
  Code,
  Users,
  History,
  TestTube,
  Settings,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  shortcut?: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Send,
    title: "New Request",
    description: "Create HTTP requests instantly",
    shortcut: "Ctrl+Shift+N",
    color: "text-blue-500"
  },
  {
    icon: Save,
    title: "Save Request",
    description: "Save to collections",
    shortcut: "Ctrl+S",
    color: "text-green-500"
  },
  {
    icon: FolderOpen,
    title: "Collections",
    description: "Organize your requests",
    color: "text-purple-500"
  },
  {
    icon: Code,
    title: "Code Snippets",
    description: "Generate code",
    color: "text-orange-500"
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Work with your team",
    color: "text-pink-500"
  },
  {
    icon: History,
    title: "History",
    description: "Track all requests",
    color: "text-indigo-500"
  },
  {
    icon: TestTube,
    title: "Test Scripts",
    description: "Automated testing",
    color: "text-cyan-500"
  },
  {
    icon: Settings,
    title: "Environment",
    description: "Manage variables",
    color: "text-amber-500"
  }
];

export function RestFeaturesDisplay() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">API Testing Platform</h2>
        <p className="text-zinc-400 text-center max-w-md">
          Professional tools to test, debug, and document your APIs
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <div
              key={index}
              className="group relative cursor-pointer animate-in slide-in-from-bottom-2 fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "p-4 rounded-lg border transition-all duration-300",
                "bg-zinc-800/50 border-zinc-700/50",
                "hover:bg-zinc-800 hover:border-zinc-600",
                "hover:shadow-lg hover:shadow-black/20",
                "hover:scale-105"
              )}>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300",
                    "bg-zinc-700/50 group-hover:scale-110"
                  )}>
                    <Icon className={cn("w-5 h-5", feature.color)} />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {feature.shortcut && (
                    <kbd className="px-2 py-1 rounded text-xs font-mono bg-zinc-700/50 text-zinc-300 border border-zinc-600/50">
                      {feature.shortcut}
                    </kbd>
                  )}
                </div>

                {/* Shine Effect */}
                <div className={cn(
                  "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500",
                  "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                  "group-hover:opacity-100"
                )} 
                style={{
                  animation: "shine 2s infinite"
                }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Start Tip */}
      <div className="mt-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 max-w-2xl w-full">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Quick Start</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-xs font-mono text-zinc-200">Ctrl+Shift+N</kbd>{" "}
              to create your first request, or select a collection from the sidebar to get started.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}
