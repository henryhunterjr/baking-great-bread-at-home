
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileProcessingErrorProps {
  error: string;
  onSwitchToTextInput?: () => void;
}

const FileProcessingError: React.FC<FileProcessingErrorProps> = ({
  error,
  onSwitchToTextInput
}) => {
  // Check if this is a Word document error
  const isWordDocError = error?.toLowerCase().includes('word document') || 
                        error?.toLowerCase().includes('.doc');

  // Check if this is a worker-related error
  const isWorkerError = error?.toLowerCase().includes('worker') || 
                        error?.toLowerCase().includes('pdf') ||
                        error?.toLowerCase().includes('ocr') ||
                        error?.toLowerCase().includes('tesseract');

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-medium">File Processing Error</AlertTitle>
      <AlertDescription className="mt-1">
        {error}
        
        {isWordDocError && (
          <div className="mt-3 text-sm">
            <p className="mb-2">
              Word documents (.doc/.docx) cannot be processed directly. You can:
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Copy the text from your Word document</li>
              <li>Switch to the Text tab and paste the content there</li>
              <li>Save your Word document as a PDF and upload the PDF instead</li>
            </ul>
            
            {onSwitchToTextInput && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSwitchToTextInput}
                className="mt-1"
              >
                <FileText className="mr-2 h-4 w-4" />
                Switch to text input
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {isWorkerError && !isWordDocError && (
          <div className="mt-3 text-sm">
            <p className="mb-2">
              It looks like we're having trouble with the file processing. You can:
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Try refreshing the page and trying again</li>
              <li>Try a different file format (e.g., a simple text file)</li>
              <li>
                Copy and paste your recipe text directly into the text input instead
              </li>
            </ul>
            
            {onSwitchToTextInput && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSwitchToTextInput}
                className="mt-1"
              >
                <FileText className="mr-2 h-4 w-4" />
                Switch to text input
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default FileProcessingError;
