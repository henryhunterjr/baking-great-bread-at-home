
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TOUR_STEPS } from '../TourSteps';

interface TourTooltipProps {
  step: number;
  position: { top: number; left: number };
  tooltipRef: React.RefObject<HTMLDivElement>;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
}

const TourTooltip = ({ 
  step, 
  position, 
  tooltipRef, 
  onNext, 
  onPrevious, 
  onFinish 
}: TourTooltipProps) => {
  const currentTourStep = TOUR_STEPS[step];

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[80] w-[300px] bg-card rounded-lg shadow-lg overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="bg-muted p-3 flex items-center justify-between">
        <span className="font-medium text-sm flex items-center gap-2">
          {currentTourStep.icon}
          {currentTourStep.title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onFinish}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close tour</span>
        </Button>
      </div>
      
      <div className="p-4">
        <p className="text-sm mb-4">{currentTourStep.content}</p>
        
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={step === 0}
            className="h-8 px-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-1 items-center">
            {TOUR_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === step ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            className="h-8 px-2"
          >
            {step < TOUR_STEPS.length - 1 ? (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              'Finish'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourTooltip;
