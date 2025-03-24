
import React from 'react';

const RecipeHelp: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground mt-4 bg-muted/50 p-3 rounded-md">
      <p className="font-medium mb-1">🔍 Where to find your converted recipes:</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>After converting, you'll see your recipe in the main view</li>
        <li>Click "Save Recipe" to store it permanently</li>
        <li>Saved recipes appear in the "My Recipes" tab on the right side</li>
      </ol>
    </div>
  );
};

export default RecipeHelp;
