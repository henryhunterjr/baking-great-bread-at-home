
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Wand2, Sparkles, Settings, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './utils/types';
import ChatTab from './tabs/ChatTab';
import ConvertTab from './tabs/ConvertTab';
import GenerateTab from './tabs/GenerateTab';
import SettingsTab from './tabs/SettingsTab';
import { henryQuotes } from './utils/data';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RecipeDisplay from './recipe/RecipeDisplay';
import { RecipeData } from '@/types/recipeTypes';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi, I'm your Baking Assistant! I can help you with bread recipes, answer baking questions, search for Henry's recipes, recommend books, tell you about the current baking challenge, or convert recipes from images or text. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  
  // Find the message with a recipe attachment
  const recipeMessage = messages.find(msg => msg.attachedRecipe);
  
  // Create a proper RecipeData object from the attached recipe
  const displayRecipe = recipeMessage?.attachedRecipe ? {
    title: recipeMessage.attachedRecipe.title || "Untitled Recipe",
    introduction: recipeMessage.attachedRecipe.description || "",
    ingredients: recipeMessage.attachedRecipe.fullRecipe?.ingredients || [],
    instructions: recipeMessage.attachedRecipe.fullRecipe?.instructions || [],
    imageUrl: recipeMessage.attachedRecipe.imageUrl || "",
    tips: recipeMessage.attachedRecipe.fullRecipe?.tips || [],
    servings: recipeMessage.attachedRecipe.fullRecipe?.servings || "1",
    isConverted: recipeMessage.attachedRecipe.isGenerated || false,
    notes: recipeMessage.attachedRecipe.fullRecipe?.notes || []
  } as RecipeData : undefined;
  
  // Settings state
  const [useAI, setUseAI] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [enhanceRecipes, setEnhanceRecipes] = useState(true);
  
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="inline-flex items-center mr-4 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Recipe display on the left */}
        {displayRecipe && (
          <div className="w-1/2 border-r overflow-y-auto p-4">
            <RecipeDisplay recipe={displayRecipe} />
          </div>
        )}
        
        {/* Tabs and chat on the right */}
        <div className={`${displayRecipe ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
