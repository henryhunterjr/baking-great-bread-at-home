
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AIHomeProps {
  aiInitialized: boolean;
}

const AIHome: React.FC<AIHomeProps> = ({ aiInitialized }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>
      
      {!aiInitialized ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">API Key Required</h2>
          <p className="text-amber-700 mb-4">
            To use the AI features, you need to provide an OpenAI API key. Your key is stored locally and never sent to our servers.
          </p>
          <div className="flex gap-4">
            <Button>
              Add API Key
            </Button>
            <Link to="/">
              <Button variant="outline">
                Go Back
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recipe Conversion</h2>
            <p className="mb-4">
              Convert any recipe from text, image, or PDF into a structured, editable format.
            </p>
            <Link to="/recipe-converter">
              <Button>
                Convert a Recipe
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cooking Assistant</h2>
            <p className="mb-4">
              Ask cooking questions, get substitution ideas, or get help with techniques.
            </p>
            <Button>
              Ask a Question
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">About Our AI Features</h2>
        <p className="mb-4">
          Our application uses AI technology to help you manage and convert recipes. The AI can:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Convert unstructured recipe text into a structured format</li>
          <li>Extract recipes from images and PDF files</li>
          <li>Answer cooking-related questions</li>
          <li>Suggest ingredient substitutions</li>
        </ul>
        <p>
          All processing is done securely using OpenAI's API. Your recipes and data remain private.
        </p>
      </div>
    </div>
  );
};

export default AIHome;
