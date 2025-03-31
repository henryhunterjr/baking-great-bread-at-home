
import React from 'react';
import { HelpCircle } from 'lucide-react';

const RecipeHelp: React.FC = () => {
  return (
    <div className="bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="text-sm">
          <p className="mb-2 font-medium">Recipe Text Format Tips:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Type or paste your recipe text below</li>
            <li>Include the recipe title, ingredients list, and instructions</li>
            <li>Separate ingredients from instructions clearly</li>
            <li>List ingredients with amounts when possible</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeHelp;
