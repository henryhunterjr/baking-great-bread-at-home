
import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Info } from 'lucide-react';

interface FeatureTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  id: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
}

export const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  children,
  content,
  id,
  side = 'top',
  showIcon = false
}) => {
  const [dismissedTooltips, setDismissedTooltips] = useLocalStorage<string[]>('dismissedTooltips', []);

  // Check if this tooltip has been dismissed
  const isDismissed = dismissedTooltips.includes(id);

  const dismissTooltip = () => {
    setDismissedTooltips([...dismissedTooltips, id]);
  };

  // If dismissed and no icon should be shown, just render children
  if (isDismissed && !showIcon) {
    return <>{children}</>;
  }

  const tooltipContent = (
    <div className="max-w-xs">
      <div className="mb-1">{content}</div>
      {!isDismissed && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dismissTooltip();
          }}
          className="text-xs text-muted-foreground hover:text-primary underline"
        >
          Don't show again
        </button>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="relative inline-flex">
            {children}
            {showIcon && (
              <div className="absolute -top-1 -right-1 text-primary">
                <Info className="h-4 w-4" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className="p-2">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeatureTooltip;
