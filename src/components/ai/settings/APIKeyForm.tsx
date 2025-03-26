
import React, { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Key, ExternalLink } from 'lucide-react';
import { configureAI, verifyAPIKey, isOpenAIConfigured } from '@/lib/ai-services/ai-config';
import { verifyAIServiceStatus } from '@/lib/ai-services/initialize';
import { useToast } from '@/hooks/use-toast';
import { logInfo } from '@/utils/logger';

interface APIKeyFormProps {
  onConfigured?: () => void;
}

interface APIStatus {
  isConfigured: boolean;
  keySource: string | null;
  model: string;
}

const APIKeyForm: React.FC<APIKeyFormProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isKeySet, setIsKeySet] = useState(false);
  const [status, setStatus] = useState<APIStatus>({ 
    isConfigured: false, 
    keySource: null, 
    model: '' 
  });
  const { toast } = useToast();

  // Check the configuration status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check if API key is configured
        const isValid = isOpenAIConfigured();
        
        // If there's a key, verify it
        if (isValid) {
          const keyVerified = await verifyAPIKey();
          setIsKeySet(keyVerified);
          setStatus({
            isConfigured: keyVerified,
            keySource: keyVerified ? 'localStorage' : null,
            model: 'gpt-4o-mini'
          });
          
          if (keyVerified && onConfigured) {
            onConfigured();
          }
          
          logInfo('API key status checked', { isConfigured: keyVerified });
        } else {
          setIsKeySet(false);
          setStatus({
            isConfigured: false,
            keySource: null,
            model: ''
          });
        }
      } catch (error) {
        console.error('Error checking API status:', error);
      }
    };
    
    checkStatus();
  }, [onConfigured]);

  const handleSubmit = async (e: FormEvent) => {
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
      // Validate API key format (simple validation)
      if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        toast({
          title: 'Invalid API Key Format',
          description: 'The API key does not appear to be in the correct format. OpenAI API keys typically start with "sk-"',
          variant: 'destructive'
        });
        setIsConfiguring(false);
        return;
      }
      
      // Configure the AI service with the key
      configureAI(apiKey);
      
      // Verify the key after configuring
      const isValid = await verifyAPIKey();
      
      if (isValid) {
        // Update status
        setIsKeySet(true);
        setStatus({
          isConfigured: true,
          keySource: 'localStorage',
          model: 'gpt-4o-mini'
        });
        
        toast({
          title: 'API Key Configured',
          description: 'Your API key has been successfully configured.',
          variant: 'default'
        });
        
        if (onConfigured) {
          onConfigured();
        }
        
        logInfo('API key successfully configured');
      } else {
        toast({
          title: 'Invalid API Key',
          description: 'The API key could not be verified. Please check and try again.',
          variant: 'destructive'
        });
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
          OpenAI API Configuration
        </CardTitle>
        <CardDescription>
          Enter your OpenAI API key to enable AI-powered features like recipe conversion, blog search, and more.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isKeySet ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Check className="h-5 w-5" />
              <p>API key configured successfully.</p>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Status:</strong> Active</p>
              <p><strong>Key Source:</strong> {status.keySource || 'Unknown'}</p>
              <p><strong>Model:</strong> {status.model}</p>
            </div>
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

              <div className="pt-2">
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="h-3 w-3" />
                  Get your OpenAI API key
                </a>
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
              setStatus({ isConfigured: false, keySource: null, model: '' });
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
