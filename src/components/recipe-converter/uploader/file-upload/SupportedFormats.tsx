
import React from 'react';
import { FileText, Image, AlertCircle } from 'lucide-react';

const SupportedFormats: React.FC = () => {
  return (
    <div className="text-center text-sm">
      <div className="text-muted-foreground flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-4 w-4" />
          <Image className="h-4 w-4" />
          <span>Supported formats: Images (JPEG, PNG), PDF, TXT</span>
        </div>
        <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>Word documents must be saved as PDF first</span>
        </div>
      </div>
    </div>
  );
};

export default SupportedFormats;
