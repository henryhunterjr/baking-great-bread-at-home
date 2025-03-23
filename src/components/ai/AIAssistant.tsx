
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { AIProvider, useAIContext } from './context/AIContext';
import AITabsNavigation from './AITabsNavigation';
import AITabsContent from './AITabsContent';

const AIAssistantContent = () => {
  const { activeTab, setActiveTab } = useAIContext();
  
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <AITabsNavigation />
        <AITabsContent />
      </Tabs>
    </div>
  );
};

const AIAssistant = () => {
  return (
    <AIProvider>
      <AIAssistantContent />
    </AIProvider>
  );
};

export default AIAssistant;
