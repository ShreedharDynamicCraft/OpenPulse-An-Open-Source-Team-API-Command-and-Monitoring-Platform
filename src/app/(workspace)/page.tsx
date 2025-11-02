"use client";

import { useWorkspaceStore } from "@/modules/Layout/store";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import { Loader, ArrowRight, Zap, Globe, Palette, FileCode, Code2, Link as LinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const { selectedWorkspace } = useWorkspaceStore();
  const { data: currentWorkspace, isLoading } = useGetWorkspace(selectedWorkspace?.id!);

  if (isLoading || !selectedWorkspace?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin h-6 w-6 text-indigo-500" />
      </div>
    );
  }

  const features = [
    {
      icon: LinkIcon,
      title: "REST API Testing",
      description: "Send HTTP requests, test APIs, and debug endpoints with powerful request/response tools.",
      link: "/rest",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      hoverShadow: "hover:shadow-blue-500/20",
    },
    {
      icon: Globe,
      title: "Realtime Communication",
      description: "Test WebSocket connections, Socket.io, and other realtime protocols with live monitoring.",
      link: "/realtime",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      hoverShadow: "hover:shadow-green-500/20",
    },
    {
      icon: Palette,
      title: "API Design Studio",
      description: "Design and visualize your API architecture with AI-powered design assistant and templates.",
      link: "/design",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      hoverShadow: "hover:shadow-purple-500/20",
    },
    {
      icon: FileCode,
      title: "Code Editor",
      description: "Write, edit, and test code snippets with syntax highlighting and multi-language support.",
      link: "/code-editor",
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-500/20",
      hoverShadow: "hover:shadow-orange-500/20",
    },
    {
      icon: Code2,
      title: "Code Review",
      description: "Collaborate on code reviews, provide feedback, and maintain code quality standards.",
      link: "/code-review",
      color: "from-indigo-500 to-violet-500",
      bgGradient: "from-indigo-500/10 to-violet-500/10",
      borderColor: "border-indigo-500/20",
      hoverShadow: "hover:shadow-indigo-500/20",
    },
  ];

  return (
    <div className="h-full w-full overflow-auto bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Welcome to {currentWorkspace?.name || "Your Workspace"}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
            All-in-One API Platform
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Design, test, monitor, and collaborate on APIs with powerful tools built for modern development teams.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/rest">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/design">
              <Button size="lg" variant="outline" className="border-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-300">
                Explore Design Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Powerful Features at Your Fingertips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link href={feature.link} key={index}>
                <Card 
                  className={`h-full border-2 ${feature.borderColor} bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm hover:scale-105 transition-all duration-300 ${feature.hoverShadow} hover:shadow-2xl cursor-pointer group animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-2 transition-transform duration-300">
                      Learn more
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-zinc-800 p-8 mb-12 animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                <Zap className="w-12 h-12 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                Fast
              </div>
              <p className="text-gray-600 dark:text-gray-300">Lightning-fast API testing and monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
                <Globe className="w-12 h-12 mx-auto mb-2 text-green-600 dark:text-green-400" />
                Connected
              </div>
              <p className="text-gray-600 dark:text-gray-300">Real-time collaboration with your team</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                <Sparkles className="w-12 h-12 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                Smart
              </div>
              <p className="text-gray-600 dark:text-gray-300">AI-powered design and testing tools</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-12 text-white shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-lg mb-8 text-indigo-100">
            Start testing your APIs, designing architecture, or collaborating with your team today.
          </p>
          <Link href="/rest">
            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              Start Testing Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
};

export default Page;
