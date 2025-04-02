
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { CircleCheck, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FormProgressProps {
  errors: FieldErrors;
}

const FormProgress: React.FC<FormProgressProps> = ({ errors }) => {
  const errorCount = Object.keys(errors).length;
  const hasErrors = errorCount > 0;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            {hasErrors ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CircleCheck className="h-5 w-5 text-green-500" />
            )}
            <span className={`text-sm ${hasErrors ? 'text-red-500' : 'text-green-500'}`}>
              {hasErrors ? `${errorCount} error${errorCount > 1 ? 's' : ''}` : 'Valid'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {hasErrors ? (
            <div>
              <p className="font-medium">Form has errors:</p>
              <ul className="list-disc pl-4 text-sm">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{field}: {error?.message?.toString() || 'Invalid'}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Form is valid and ready to submit</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FormProgress;
