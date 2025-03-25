
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Key } from 'lucide-react';
import { configureAI, isAIConfigured } from '@/lib/ai-services';
import { useToast } from '@/hooks/use-toast';

interface APIKeyFormProps {
  onConfigured?: () => void;
}

const APIKeyForm: React.FC<APIKeyFormProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isKeySet, setIsKeySet] = useState(isAIConfigured());
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter a valid API key',
        variant: 'destructive'
      });
      return;
    }
    
    setIsConfiguring(true);
    
    try {
      // Store API key in localStorage for persisting between sessions
      localStorage.setItem('openai_api_key', apiKey);
      
      // Configure the AI service with the key
      configureAI(apiKey);
      
      setIsKeySet(true);
      
      toast({
        title: 'API Key Configured',
        description: 'Your API key has been successfully configured.',
        variant: 'default'
      });
      
      if (onConfigured) {
        onConfigured();
      }
    } catch (error) {
      toast({
        title: 'Configuration Error',
        description: 'There was an error configuring your API key.',
        variant: 'destructive'
      });
    } finally {
      setIsConfiguring(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2 h-5 w-5" />
          AI Service Configuration
        </CardTitle>
        <CardDescription>
          Enter your OpenAI API key to enable AI-powered features like recipe conversion, blog search, and more.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isKeySet ? (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <Check className="h-5 w-5" />
            <p>API key configured successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-start space-x-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Your API key is stored locally and never sent to our servers. It is used only for direct communication between your browser and OpenAI.
                </p>
              </div>
            </div>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!isKeySet && (
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isConfiguring || !apiKey.trim()}
          >
            {isConfiguring ? 'Configuring...' : 'Configure API Key'}
          </Button>
        )}
        
        {isKeySet && (
          <Button
            variant="outline"
            onClick={() => {
              setIsKeySet(false);
              setApiKey('');
              localStorage.removeItem('openai_api_key');
              toast({
                title: 'API Key Removed',
                description: 'Your API key has been removed.',
                variant: 'default'
              });
            }}
          >
            Change API Key
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default APIKeyForm;
