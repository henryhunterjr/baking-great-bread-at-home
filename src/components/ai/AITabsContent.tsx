
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useAIContext } from './context/AIContext';
import ChatTab from './tabs/ChatTab';
import ConvertTab from './tabs/ConvertTab';
import GenerateTab from './tabs/GenerateTab';
import SettingsTab from './tabs/SettingsTab';

const AITabsContent: React.FC = () => {
  const { 
    activeTab,
    setActiveTab,
    recipeText,
    setRecipeText,
    recipePrompt,
    setRecipePrompt,
    isProcessing,
    setIsProcessing,
    messages,
    setMessages,
    useAI,
    setUseAI,
    saveHistory,
    setSaveHistory,
    enhanceRecipes,
    setEnhanceRecipes
  } = useAIContext();
  
  return (
    <>
      <TabsContent value="chat" className="flex-1 flex flex-col p-0 h-full">
        <ChatTab 
          messages={messages}
          setMessages={setMessages}
          setActiveTab={setActiveTab}
          setRecipeText={setRecipeText}
          setRecipePrompt={setRecipePrompt}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </TabsContent>

      <TabsContent value="convert" className="flex-1 p-0 h-full">
        <ConvertTab 
          recipeText={recipeText}
          setRecipeText={setRecipeText}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setMessages={setMessages}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="generate" className="flex-1 p-0 h-full">
        <GenerateTab 
          recipePrompt={recipePrompt}
          setRecipePrompt={setRecipePrompt}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setMessages={setMessages}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="settings" className="flex-1 p-0 h-full">
        <SettingsTab 
          useAI={useAI}
          setUseAI={setUseAI}
          saveHistory={saveHistory}
          setSaveHistory={setSaveHistory}
          enhanceRecipes={enhanceRecipes}
          setEnhanceRecipes={setEnhanceRecipes}
        />
      </TabsContent>
    </>
  );
};

export default AITabsContent;
