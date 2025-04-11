
import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { TOUR_STEPS } from './TourSteps';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const GuidedTour: React.FC = () => {
  const { 
    showTour, 
    setShowTour, 
    currentStep, 
    setCurrentStep,
    setHasCompletedTour 
  } = useOnboarding();
  
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });

  // Find and position the highlight and tooltip based on the current step
  useEffect(() => {
    if (!showTour) return;
    
    const currentTourStep = TOUR_STEPS[currentStep];
    
    // Give the DOM a chance to render
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(currentTourStep.target);
      setTargetElement(element);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        
        // Position highlight
        setHighlightPosition({
          top: rect.top + scrollTop,
          left: rect.left + scrollLeft,
          width: rect.width,
          height: rect.height
        });
        
        // Position tooltip based on placement
        const placement = currentTourStep.placement || 'bottom';
        let tooltipTop = 0;
        let tooltipLeft = 0;
        
        switch (placement) {
          case 'top':
            tooltipTop = rect.top + scrollTop - 110;
            tooltipLeft = rect.left + scrollLeft + (rect.width / 2) - 150;
            break;
          case 'bottom':
            tooltipTop = rect.bottom + scrollTop + 10;
            tooltipLeft = rect.left + scrollLeft + (rect.width / 2) - 150;
            break;
          case 'left':
            tooltipTop = rect.top + scrollTop + (rect.height / 2) - 50;
            tooltipLeft = rect.left + scrollLeft - 310;
            break;
          case 'right':
            tooltipTop = rect.top + scrollTop + (rect.height / 2) - 50;
            tooltipLeft = rect.right + scrollLeft + 10;
            break;
        }
        
        // Ensure tooltip stays within viewport
        tooltipTop = Math.max(10, tooltipTop);
        tooltipLeft = Math.max(10, tooltipLeft);
        tooltipLeft = Math.min(tooltipLeft, window.innerWidth - 310);
        
        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
        
        // Scroll element into view if needed
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Target element not found, try to move to next step
        if (currentStep < TOUR_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          handleFinishTour();
        }
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [showTour, currentStep, setCurrentStep]);

  const handleNextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishTour();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishTour = () => {
    setShowTour(false);
    setHasCompletedTour(true);
    toast.success("Tour completed! You can restart it anytime from the help menu.");
  };

  if (!showTour) return null;

  const currentTourStep = TOUR_STEPS[currentStep];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity" 
        onClick={handleFinishTour}
      />
      
      {/* Highlight */}
      {targetElement && (
        <div
          className="absolute z-[60] rounded-md ring-2 ring-primary ring-offset-2 transition-all duration-200"
          style={{
            top: `${highlightPosition.top}px`,
            left: `${highlightPosition.left}px`,
            width: `${highlightPosition.width}px`,
            height: `${highlightPosition.height}px`,
          }}
        />
      )}
      
      {/* Tooltip */}
      <div
        className="fixed z-[70] w-[300px] bg-card shadow-lg rounded-lg p-4 transition-all duration-300"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        {/* Close button */}
        <button 
          onClick={handleFinishTour}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          aria-label="Close tour"
        >
          <X size={16} />
        </button>
        
        {/* Icon and title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="text-primary">
            {currentTourStep.icon}
          </div>
          <h3 className="font-medium">{currentTourStep.title}</h3>
        </div>
        
        {/* Content */}
        <p className="text-sm text-muted-foreground mb-4">{currentTourStep.content}</p>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80 disabled:opacity-50"
              aria-label="Previous step"
            >
              <ArrowLeft size={12} />
              <span>Previous</span>
            </button>
            
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label={currentStep < TOUR_STEPS.length - 1 ? "Next step" : "Finish tour"}
            >
              <span>{currentStep < TOUR_STEPS.length - 1 ? 'Next' : 'Finish'}</span>
              <ArrowRight size={12} />
            </button>
          </div>
          
          {/* Progress dots */}
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full",
                  index === currentStep ? "bg-primary" : "bg-muted"
                )}
                onClick={() => setCurrentStep(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuidedTour;
