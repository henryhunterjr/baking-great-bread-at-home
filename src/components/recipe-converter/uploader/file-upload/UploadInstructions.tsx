
import React from 'react';
import { Upload, FileText, Image } from 'lucide-react';

const UploadInstructions: React.FC = () => {
  return (
    <>
      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Upload Recipe File</h3>
      <p className="text-muted-foreground mb-2">
        Upload an image or PDF of your recipe
      </p>
      <div className="flex justify-center items-center gap-2 mb-2">
        <Image className="h-4 w-4 text-muted-foreground" />
        <FileText className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground">
        Word documents must be saved as PDF first
      </p>
    </>
  );
};

export default UploadInstructions;
