import React, { useState, useEffect } from 'react'
import { RequestTab } from '../store/useRequestStore'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Save } from 'lucide-react'
import { useRunRequest, useUpdateRequest } from '../hooks/request'
import { toast } from 'sonner'

interface Props {
    tab: RequestTab,
    updateTab: (id: string, data: Partial<RequestTab>) => void;
}

const RequestBar = ({ tab, updateTab }: Props) => {

  const {mutateAsync , isPending , isError} = useRunRequest(tab?.requestId!);
  const updateRequest = useUpdateRequest(tab?.requestId!);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const requestColorMap: Record<string, string> = {
    GET: "text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/20",
    POST: "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20",
    PUT: "text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/20",
    DELETE: "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/20",
    PATCH: "text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/20",
  };

  const requestBgMap: Record<string, string> = {
    GET: "hover:bg-green-100 dark:hover:bg-green-500/20",
    POST: "hover:bg-blue-100 dark:hover:bg-blue-500/20",
    PUT: "hover:bg-yellow-100 dark:hover:bg-yellow-500/20",
    DELETE: "hover:bg-red-100 dark:hover:bg-red-500/20",
    PATCH: "hover:bg-orange-100 dark:hover:bg-orange-500/20",
  };

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [tab.url, tab.method, tab.headers, tab.parameters, tab.body]);

  // Keyboard shortcut for save (Ctrl+S or Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && !isSaving && !isPending) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, isSaving, isPending]);

  const handleSave = async () => {
    if (!tab.requestId) return;
    
    setIsSaving(true);
    try {
      await updateRequest.mutateAsync({
        url: tab.url,
        method: tab.method as any,
        headers: tab.headers,
        parameters: tab.parameters,
        body: tab.body,
      });
      setHasUnsavedChanges(false);
      toast.success('Request saved!', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to save request');
    } finally {
      setIsSaving(false);
    }
  };

  const onSendRequest = async () => {
    try {
      // Save URL, method, headers, parameters, and body to database before sending
      if (tab.requestId && hasUnsavedChanges) {
        setIsSaving(true);
        await updateRequest.mutateAsync({
          url: tab.url,
          method: tab.method as any,
          headers: tab.headers,
          parameters: tab.parameters,
          body: tab.body,
        });
        setHasUnsavedChanges(false);
        setIsSaving(false);
      }
      
      const res = await mutateAsync();
      
      toast.success('Request sent successfully!', { 
        duration: 3000,
        description: `${tab.method} ${tab.url}`
      });
    } catch (error) {
      toast.error('Failed to send request.', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('Request error:', error);
    }
  }

  return (
    <div className='flex flex-col gap-3 bg-white dark:from-zinc-900 dark:to-zinc-950 dark:bg-gradient-to-br rounded-lg p-4 w-full border border-zinc-200 dark:border-zinc-800 shadow-xl'>
      <div className="flex flex-row items-center gap-3 w-full">
        <Select 
          value={tab.method} 
          onValueChange={(value) => updateTab(tab.id, { method: value })}
          disabled={isPending}
        >
          <SelectTrigger className={`w-32 font-semibold border-2 ${requestColorMap[tab.method] || "text-gray-500"} ${requestBgMap[tab.method]} transition-all duration-200`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <SelectGroup>
              <SelectItem value="GET" className="text-green-600 dark:text-green-500 hover:bg-green-100 dark:hover:bg-green-500/10 cursor-pointer">
                <span className="font-semibold">GET</span>
              </SelectItem>
              <SelectItem value="POST" className="text-blue-600 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10 cursor-pointer">
                <span className="font-semibold">POST</span>
              </SelectItem>
              <SelectItem value="PUT" className="text-yellow-700 dark:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/10 cursor-pointer">
                <span className="font-semibold">PUT</span>
              </SelectItem>
              <SelectItem value="PATCH" className="text-orange-600 dark:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-500/10 cursor-pointer">
                <span className="font-semibold">PATCH</span>
              </SelectItem>
              <SelectItem value="DELETE" className="text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 cursor-pointer">
                <span className="font-semibold">DELETE</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <div className="flex-1 relative">
          <Input 
            value={tab.url || ''} 
            onChange={(e) => updateTab(tab.id, { url: e.target.value })}
            placeholder="Enter request URL (e.g., http://localhost:4000/api/users)"
            className="flex-1 bg-white dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 pr-10"
            disabled={isPending}
          />
          {hasUnsavedChanges && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Unsaved changes" />
            </div>
          )}
        </div>

        <Button 
          variant="outline"
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isSaving || isPending}
          className="border-indigo-200 dark:border-zinc-700 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-all duration-200 text-indigo-600 dark:text-zinc-300 hover:border-indigo-300"
          title="Save request (Ctrl+S)"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-zinc-300" />
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          type='submit'
          onClick={onSendRequest}
          disabled={isPending || !tab.url}
          className="text-white font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/50 transition-all duration-200 min-w-[100px]"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-gray-400">
        {isPending && (
          <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            Sending request...
          </span>
        )}
        {!isPending && hasUnsavedChanges && (
          <span className="flex items-center gap-1 text-orange-500 dark:text-orange-400">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400" />
            Unsaved changes
          </span>
        )}
        {!isPending && !hasUnsavedChanges && tab.url && (
          <span className="flex items-center gap-1 text-green-500 dark:text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
            Saved
          </span>
        )}
      </div>
    </div>
  )
}

export default RequestBar