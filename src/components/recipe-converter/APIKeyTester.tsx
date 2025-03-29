
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { verifyAPIKey, checkAPIKeyStatus } from '@/lib/ai-services/ai-config';
import { Link } from 'react-router-dom';

interface APIKeyTesterProps {
  onComplete?: (isValid: boolean) => void;
}

const APIKeyTester: React.FC<APIKeyTesterProps> = ({ onComplete }) => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<null | { valid: boolean; message: string }>(null);
  
  const checkAPIKey = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      // Check if API key exists
      const keyStatus = checkAPIKeyStatus();
      
      if (!keyStatus.hasKey) {
        setResult({
          valid: false,
          message: "No API key found. Please add your OpenAI API key in the settings."
        });
        return;
      }
      
      if (!keyStatus.keyFormat) {
        setResult({
          valid: false,
          message: "Invalid API key format. OpenAI API keys should start with 'sk-'."
        });
        return;
      }
      
      // Try to verify the key
      const isValid = await verifyAPIKey();
      
      if (isValid) {
        setResult({
          valid: true,
          message: "API key is valid! You can now use AI features."
        });
      } else {
        setResult({
          valid: false,
          message: "API key validation failed. The key may be invalid or expired."
        });
      }
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(isValid);
      }
    } catch (error) {
      setResult({
        valid: false,
        message: "Error testing API key. Please check your internet connection."
      });
    } finally {
      setTesting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {result && (
        <Alert variant={result.valid ? "default" : "destructive"}>
          {result.valid ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>{result.valid ? "Success" : "API Key Issue"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
          
          {!result.valid && (
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/settings">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Update API Key
                </Link>
              </Button>
            </div>
          )}
        </Alert>
      )}
      
      <Button 
        onClick={checkAPIKey} 
        disabled={testing}
        className="w-full"
      >
        {testing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing API Key...
          </>
        ) : (
          "Test OpenAI API Key"
        )}
      </Button>
    </div>
  );
};

export default APIKeyTester;
