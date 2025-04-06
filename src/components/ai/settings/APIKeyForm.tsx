import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Check, AlertCircle, Loader2 } from 'lucide-react';
import { 
  configureAIKey, 
  verifyAPIKey, 
  isAIConfigured,
  checkAPIKeyStatus,
  getOpenAIApiKey
} from '@/lib/ai-services/key-management';
import { useToast } from '@/hooks/use-toast';

interface APIKeyFormProps {
  onKeyConfigured?: () => void;
}

const APIKeyForm: React.FC<APIKeyFormProps> = ({ onKeyConfigured }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const status = checkAPIKeyStatus();
    setIsConfigured(status.hasKey && status.keyFormat);
    
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      const maskedKey = storedKey.substring(0, 3) + '••••••••••••••••' + storedKey.substring(storedKey.length - 4);
      setApiKey(maskedKey);
    }
  }, []);
  
  const handleSaveKey = async () => {
    setError(null);
    
    if (apiKey.includes('••••')) {
      toast({
        title: "No Changes Made",
        description: "The API key was not updated because it wasn't changed.",
      });
      return;
    }
    
    if (!apiKey.trim() || !apiKey.startsWith('sk-') || apiKey.length < 20) {
      setError("Please enter a valid OpenAI API key. It should start with 'sk-' and be at least 20 characters long.");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      configureAIKey(apiKey);
      
      const isValid = await verifyAPIKey();
      
      if (isValid) {
        setIsConfigured(true);
        
        if (onKeyConfigured) {
          onKeyConfigured();
        }
        
        toast({
          title: "API Key Saved",
          description: "Your OpenAI API key has been successfully saved and verified.",
        });
      } else {
        setError("The API key appears to be invalid. Please check the key and try again.");
        
        toast({
          variant: "destructive",
          title: "Invalid API Key",
          description: "The provided API key could not be verified with OpenAI.",
        });
      }
    } catch (err) {
      setError("An error occurred while verifying the API key. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Failed to verify the API key with OpenAI.",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsConfigured(false);
    setError(null);
    
    toast({
      title: "API Key Cleared",
      description: "Your OpenAI API key has been removed.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="openai-api-key">OpenAI API Key</Label>
        <div className="text-sm text-muted-foreground mb-2">
          Provide your OpenAI API key to enable AI features like recipe conversion and generation.
        </div>
        <Input
          id="openai-api-key"
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="font-mono"
        />
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isConfigured && !error && (
        <Alert>
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription>API key is configured and verified.</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleSaveKey}
          disabled={isVerifying || !apiKey.trim()}
          className="flex-1"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>Save API Key</>
          )}
        </Button>
        
        {isConfigured && (
          <Button
            variant="outline"
            onClick={handleClearKey}
            disabled={isVerifying}
          >
            Clear Key
          </Button>
        )}
      </div>
      
      <div className="pt-2">
        <div className="text-sm text-muted-foreground flex items-start">
          <InfoIcon className="h-4 w-4 mr-2 mt-0.5" />
          <div>
            <p>Need an OpenAI API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one here</a>.</p>
            <p className="mt-1">Your API key is stored only in your browser and never sent to our servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyForm;
