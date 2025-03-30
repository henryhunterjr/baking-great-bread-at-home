
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelpCircle } from "lucide-react";

const RecipeHelp: React.FC = () => {
  return (
    <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
      <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription>
        <p className="text-sm">
          Paste your recipe text or use one of the upload options below. For best results, include:
        </p>
        <ul className="text-sm list-disc ml-5 mt-2 space-y-1">
          <li>Recipe title</li>
          <li>List of ingredients with measurements</li>
          <li>Step-by-step instructions</li>
          <li>Any additional tips or notes</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default RecipeHelp;
