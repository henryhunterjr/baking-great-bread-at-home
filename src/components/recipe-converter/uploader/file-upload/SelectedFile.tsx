
import React from 'react';
import { FileText } from 'lucide-react';

interface SelectedFileProps {
  fileName: string | null;
}

const SelectedFile: React.FC<SelectedFileProps> = ({ fileName }) => {
  if (!fileName) return null;
  
  return (
    <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center">
      <FileText className="h-4 w-4 mr-1" />
      <p>Selected: {fileName}</p>
    </div>
  );
};

export default SelectedFile;
