"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Ensure the DOM class matches the resolved theme on mount
  React.useEffect(() => {
    if (!mounted) return;
    const current = resolvedTheme || theme;
    applyDomTheme(current as string);
  }, [mounted, resolvedTheme, theme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg">
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const applyDomTheme = (t: string) => {
    try {
      const el = document.documentElement;
      if (t === 'dark') {
        el.classList.add('dark');
      } else if (t === 'light') {
        el.classList.remove('dark');
      } else if (t === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) el.classList.add('dark'); else el.classList.remove('dark');
      }
    } catch (e) {
      // ignore (server-side or no DOM)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="w-10 h-10 rounded-lg relative overflow-hidden group hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10 transition-all duration-300 border border-transparent hover:border-indigo-500/20"
        >
          <div className="relative">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute top-0 left-0 h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-indigo-400" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-lg p-1 animate-slide-down"
      >
        <div className="px-2 py-1.5 mb-1">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Theme
          </p>
        </div>
        
        <DropdownMenuItem 
          onClick={() => {
            setTheme("light");
            applyDomTheme('light');
          }}
          className="cursor-pointer rounded-md px-2 py-2 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md transition-all duration-200 ${theme === "light" ? 'bg-amber-500/20' : 'bg-zinc-100 dark:bg-zinc-800 group-hover:bg-amber-500/10'}`}>
                <Sun className={`h-4 w-4 transition-colors ${theme === "light" ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-600 dark:text-zinc-400'}`} />
              </div>
              <span className={`font-medium transition-colors ${theme === "light" ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                Light
              </span>
            </div>
            {theme === "light" && (
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            setTheme("dark");
            applyDomTheme('dark');
          }}
          className="cursor-pointer rounded-md px-2 py-2 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md transition-all duration-200 ${theme === "dark" ? 'bg-indigo-500/20' : 'bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-500/10'}`}>
                <Moon className={`h-4 w-4 transition-colors ${theme === "dark" ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}`} />
              </div>
              <span className={`font-medium transition-colors ${theme === "dark" ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                Dark
              </span>
            </div>
            {theme === "dark" && (
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            setTheme("system");
            applyDomTheme('system');
          }}
          className="cursor-pointer rounded-md px-2 py-2 hover:bg-purple-500/10 dark:hover:bg-purple-500/10 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md transition-all duration-200 ${theme === "system" ? 'bg-purple-500/20' : 'bg-zinc-100 dark:bg-zinc-800 group-hover:bg-purple-500/10'}`}>
                <Monitor className={`h-4 w-4 transition-colors ${theme === "system" ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-600 dark:text-zinc-400'}`} />
              </div>
              <span className={`font-medium transition-colors ${theme === "system" ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                System
              </span>
            </div>
            {theme === "system" && (
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            )}
          </div>
        </DropdownMenuItem>

        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
        
        <div className="px-2 py-1.5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Current: <span className="font-semibold capitalize">{isDark ? '🌙 Dark' : '☀️ Light'}</span>
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
