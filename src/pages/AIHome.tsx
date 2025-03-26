
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AIHomeProps {
  aiInitialized: boolean;
}

const AIHome: React.FC<AIHomeProps> = ({ aiInitialized }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>
      
      {!aiInitialized && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            AI service is not initialized. You'll need to set up your API key in Settings to use all features.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Chat with AI</h2>
            <p className="mb-4">
              Ask questions about cooking, get recipe suggestions, and more with our AI assistant.
            </p>
            <Button asChild className="w-full">
              <Link to="/ai/chat">Start Chat</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Generate Recipes</h2>
            <p className="mb-4">
              Generate custom recipes based on ingredients, dietary preferences, or cuisine types.
            </p>
            <Button asChild className="w-full">
              <Link to="/ai/generate">Generate Recipe</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIHome;
