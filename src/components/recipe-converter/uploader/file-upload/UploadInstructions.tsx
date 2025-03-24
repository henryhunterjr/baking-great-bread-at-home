
import React from 'react';
import { Upload } from 'lucide-react';

const UploadInstructions: React.FC = () => {
  return (
    <>
      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Upload Recipe File</h3>
      <p className="text-muted-foreground mb-4">
        Upload an image, PDF, or document of your recipe
      </p>
    </>
  );
};

export default UploadInstructions;
