
import React from 'react';
import { AlertCircle, FileText, Camera, Clipboard, HelpCircle } from 'lucide-react';

const RecipeHelp: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground mt-4 bg-muted/50 p-3 rounded-md space-y-3">
      <div>
        <p className="font-medium mb-1 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          Where to find your converted recipes:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>After converting, you'll see your recipe in the main view</li>
          <li>Click "Save Recipe" to store it permanently</li>
          <li>Saved recipes appear in the "My Recipes" tab on the right side</li>
        </ol>
      </div>
      
      <div>
        <p className="font-medium mb-1 flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" />
          Input methods available:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-medium">Text:</span> Type or paste your recipe directly</li>
          <li><span className="font-medium">File:</span> Upload PDF, text, or image files</li>
          <li><span className="font-medium">Camera:</span> Take a photo of a printed recipe</li>
          <li><span className="font-medium">Clipboard:</span> Quick paste from your clipboard</li>
        </ul>
      </div>
      
      <div>
        <p className="font-medium mb-1 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          Troubleshooting tips:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>For PDF files, ensure they're text-based and not scanned images</li>
          <li>When using camera capture, ensure good lighting and clear text</li>
          <li>If extraction fails, try typing the recipe manually</li>
          <li>Large files may take longer to process - please be patient</li>
        </ul>
      </div>
    </div>
  );
};

export default RecipeHelp;
