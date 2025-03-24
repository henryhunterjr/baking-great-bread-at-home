
import React from 'react';

interface FileUploadErrorProps {
  error: string | null;
}

const FileUploadError: React.FC<FileUploadErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
      {error}
    </div>
  );
};

export default FileUploadError;
