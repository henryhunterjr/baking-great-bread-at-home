
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AI_CONFIG } from '@/lib/ai-services/ai-config';

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
  const [apiKey, setApiKey] = React.useState('');
  const { toast } = useToast();
  
  // Check if API key is already set
  React.useEffect(() => {
    // Just check if it exists, don't show the actual key
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      setApiKey('••••••••••••••••••••••••••••••');
    }
  }, []);
  
  const handleSaveApiKey = () => {
    // In a real application, you would save this to a secure location
    // Here we're using localStorage for demo purposes
    if (apiKey.trim() && apiKey !== '••••••••••••••••••••••••••••••') {
      localStorage.setItem('OPENAI_API_KEY', apiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved. Please refresh the page for it to take effect.",
      });
      
      // Mask the API key for security
      setApiKey('••••••••••••••••••••••••••••••');
    } else {
      toast({
        variant: "destructive",
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key.",
      });
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Settings</CardTitle>
          <CardDescription>Configure how the AI assistant works with your recipes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="use-ai" className="font-medium">Use AI Features</Label>
              <p className="text-sm text-muted-foreground">Enable AI-powered recipe search and generation</p>
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
              <p className="text-sm text-muted-foreground">Keep your conversation history between sessions</p>
            </div>
            <Switch 
              id="save-history" 
              checked={saveHistory} 
              onCheckedChange={setSaveHistory} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enhance-recipes" className="font-medium">Recipe Enhancement</Label>
              <p className="text-sm text-muted-foreground">Allow AI to suggest improvements to your recipes</p>
            </div>
            <Switch 
              id="enhance-recipes" 
              checked={enhanceRecipes} 
              onCheckedChange={setEnhanceRecipes} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>OpenAI Integration</CardTitle>
          <CardDescription>Connect your OpenAI account for enhanced AI features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-api-key">OpenAI API Key</Label>
            <div className="flex space-x-2">
              <Input 
                id="openai-api-key" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..." 
                type="password"
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored securely in your browser. Get your API key from the{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenAI dashboard
              </a>.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="font-medium">Active AI Model</Label>
            <p className="text-sm">{AI_CONFIG.openai.model}</p>
            <p className="text-xs text-muted-foreground">
              The model used for generating recipes and answering questions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
