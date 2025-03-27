
import React from 'react';
import { AlertTriangle, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NoAPIKeyMessageProps {
  showSettings?: boolean;
}

const NoAPIKeyMessage: React.FC<NoAPIKeyMessageProps> = ({ showSettings = true }) => {
  return (
    <Alert variant="destructive" className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
      <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
      <AlertTitle className="text-amber-600">API Key Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          To convert recipes using AI, you need to add your OpenAI API key in the settings.
        </p>
        {showSettings && (
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link to="/settings">
              <KeyRound className="h-4 w-4 mr-2" />
              Go to Settings
            </Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default NoAPIKeyMessage;
