
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import APIKeyForm from '../settings/APIKeyForm';

interface SettingsTabProps {
  useAI: boolean;
  setUseAI: (value: boolean) => void;
  saveHistory: boolean;
  setSaveHistory: (value: boolean) => void;
  enhanceRecipes: boolean;
  setEnhanceRecipes: (value: boolean) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  useAI,
  setUseAI,
  saveHistory,
  setSaveHistory,
  enhanceRecipes,
  setEnhanceRecipes
}) => {
  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      
      <Tabs defaultValue="general" className="flex-1">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="use-ai" className="font-medium">Use AI Assistant</Label>
              <p className="text-sm text-muted-foreground">Enable AI-powered recipe suggestions and conversions</p>
            </div>
            <Switch
              id="use-ai"
              checked={useAI}
              onCheckedChange={setUseAI}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="save-history" className="font-medium">Save Chat History</Label>
              <p className="text-sm text-muted-foreground">Store conversations between sessions</p>
            </div>
            <Switch
              id="save-history"
              checked={saveHistory}
              onCheckedChange={setSaveHistory}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enhance-recipes" className="font-medium">Enhance Recipe Conversions</Label>
              <p className="text-sm text-muted-foreground">Use AI to improve recipe structure and formatting</p>
            </div>
            <Switch
              id="enhance-recipes"
              checked={enhanceRecipes}
              onCheckedChange={setEnhanceRecipes}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Configure your OpenAI API key to enable AI-powered features. Your key is stored locally on your device
            and is never sent to our servers.
          </p>
          
          <APIKeyForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
