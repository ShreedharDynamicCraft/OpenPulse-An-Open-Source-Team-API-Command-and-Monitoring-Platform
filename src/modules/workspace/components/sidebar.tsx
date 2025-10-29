import { Button } from '@/components/ui/button';
import { ExternalLink, HelpCircle, Plus, Search, Loader, MessageSquare, FolderOpen, ScrollText, BarChart3 } from 'lucide-react';
import React, { useState } from 'react';
import CreateCollection from '../../collections/components/create-collection';
import { useCollections } from '@/modules/collections/hooks/collections';
import EmptyCollections from '../../collections/components/empty-collections';
import CollectionFolder from '@/modules/collections/components/collection-folder';
import { WorkspaceChat } from './workspace-chat';
import { ActivityLogsViewer } from './activity-logs-viewer';
import { AnalyticsDashboard } from './analytics-dashboard';
import { useUser } from '@clerk/nextjs';


interface Props {
  currentWorkspace: any;
}

const TabbedSidebar = ({ currentWorkspace }: Props) => {
  const [activeTab, setActiveTab] = useState('Collections');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { user } = useUser();

  const {data:collections , isLoading, isError} = useCollections(currentWorkspace?.id);

  
 
  if(isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <Loader className="w-6 h-6 text-indigo-400 animate-spin" />
    </div>
  )

  const sidebarItems = [
    { icon: FolderOpen, label: 'Collections' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: ScrollText, label: 'Logs' },
    { icon: BarChart3, label: 'Analytics' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Collections':
        return renderCollections();
      case 'Chat':
        return (
          <div className="flex flex-col h-full w-full overflow-hidden">
            <WorkspaceChat workspaceId={currentWorkspace?.id} />
          </div>
        );
      case 'Logs':
        return (
          <div className="flex flex-col h-full w-full overflow-hidden">
            <ActivityLogsViewer workspaceId={currentWorkspace?.id} />
          </div>
        );
      case 'Analytics':
        return (
          <div className="flex flex-col h-full w-full overflow-auto">
            <AnalyticsDashboard workspaceId={currentWorkspace?.id} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderCollections = () => {
    return (
      <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-100 overflow-hidden">
     
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-sm text-zinc-400 truncate">{currentWorkspace?.name}</span>
            <span className="text-zinc-600 shrink-0">›</span>
            <span className="text-sm font-medium shrink-0">Collections</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <HelpCircle className="w-4 h-4 text-zinc-400 hover:text-zinc-300 cursor-pointer" />
            <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300 cursor-pointer" />
          </div>
        </div>
        

     
        <div className="p-4 border-b border-zinc-800 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

      
        <div className="p-4 border-b border-zinc-800 shrink-0">
          <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New</span>
          </Button>
        </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {collections && collections.length > 0 ? (
          collections.map((collection) => (
            <div className='flex flex-col justify-start items-start p-3 border-b border-zinc-800 w-full' key={collection.id}>
            <CollectionFolder  collection={collection} />
            </div>
          ))
        ) : (
          <EmptyCollections />
        )}
      </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full bg-zinc-900">
      {/* Tab Sidebar */}
      <div className="w-14 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4 space-y-4 shrink-0">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(item.label)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              activeTab === item.label
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 bg-zinc-900 overflow-hidden">{renderTabContent()}</div>

      <CreateCollection
        workspaceId={currentWorkspace?.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      
    </div>
  );
};

export default TabbedSidebar;
