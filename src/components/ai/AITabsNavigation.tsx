
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Wand2, Sparkles, Settings } from 'lucide-react';
import { useAIContext } from './context/AIContext';

const AITabsNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useAIContext();
  
  return (
    <div className="px-4 py-2 border-b">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </TabsTrigger>
        <TabsTrigger value="convert" className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          <span>Convert</span>
        </TabsTrigger>
        <TabsTrigger value="generate" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Generate</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AITabsNavigation;
