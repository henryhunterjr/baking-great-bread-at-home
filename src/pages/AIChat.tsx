
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import AIAssistantChat from '@/components/ai/AIAssistantChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isOpenAIConfigured } from '@/lib/ai-services/ai-config';
import APIKeyForm from '@/components/ai/settings/APIKeyForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const AIChat: React.FC = () => {
  useScrollToTop();
  const [isConfigured, setIsConfigured] = useState(isOpenAIConfigured());

  const handleAPIKeyConfigured = () => {
    setIsConfigured(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        <h1 className="text-3xl font-serif font-bold mb-6">AI Kitchen Assistant</h1>
        
        {!isConfigured ? (
          <div className="max-w-2xl mx-auto">
            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription>
                To use the AI assistant features, you'll need to add your OpenAI API key.
              </AlertDescription>
            </Alert>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-medium mb-4">Add Your OpenAI API Key</h2>
              <APIKeyForm onKeyConfigured={handleAPIKeyConfigured} />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
              <TabsTrigger value="recipe">Recipe Generator</TabsTrigger>
              <TabsTrigger value="convert">Recipe Converter</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="p-0">
              <AIAssistantChat />
            </TabsContent>
            
            <TabsContent value="recipe" className="p-0">
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Recipe Generator</h3>
                <p className="text-muted-foreground">Ask me to create a custom recipe for you!</p>
              </div>
            </TabsContent>
            
            <TabsContent value="convert" className="p-0">
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Recipe Converter</h3>
                <p className="text-muted-foreground">
                  Convert your recipes to a standardized format or adjust measurements
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AIChat;
