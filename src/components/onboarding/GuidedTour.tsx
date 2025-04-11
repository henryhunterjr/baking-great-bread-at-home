
import React, { useState, useEffect, useRef } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TOUR_STEPS, TourStep } from './TourSteps';

const GuidedTour = () => {
  const { showTour, setShowTour, setHasCompletedTour, currentStep, setCurrentStep } = useOnboarding();
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Handle positioning and visibility of the tooltip
  useEffect(() => {
    if (!showTour) return;
    
    const handlePositioning = () => {
      const step = TOUR_STEPS[currentStep];
      const target = document.querySelector(step.target);
      
      if (target) {
        setTargetElement(target);
        const rect = target.getBoundingClientRect();
        const tooltipHeight = tooltipRef.current?.offsetHeight || 150;
        const tooltipWidth = tooltipRef.current?.offsetWidth || 300;
        
        let top = 0;
        let left = 0;
        
        switch (step.placement) {
          case 'top':
            top = rect.top - tooltipHeight - 12;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'bottom':
            top = rect.bottom + 12;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left - tooltipWidth - 12;
            break;
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + 12;
            break;
          default:
            top = rect.bottom + 12;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        }
        
        // Ensure tooltip stays within viewport
        if (left < 20) left = 20;
        if (left + tooltipWidth > window.innerWidth - 20) {
          left = window.innerWidth - tooltipWidth - 20;
        }
        if (top < 20) top = 20;
        if (top + tooltipHeight > window.innerHeight - 20) {
          top = window.innerHeight - tooltipHeight - 20;
        }
        
        setPosition({ top, left });
        
        // Scroll element into view if needed
        if (
          rect.top < 0 ||
          rect.left < 0 ||
          rect.bottom > window.innerHeight ||
          rect.right > window.innerWidth
        ) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }
    };
    
    // Initial positioning
    handlePositioning();
    
    // Reposition on window resize
    window.addEventListener('resize', handlePositioning);
    window.addEventListener('scroll', handlePositioning);
    
    // Add mutation observer to detect DOM changes
    const observer = new MutationObserver(handlePositioning);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true 
    });
    
    return () => {
      window.removeEventListener('resize', handlePositioning);
      window.removeEventListener('scroll', handlePositioning);
      observer.disconnect();
    };
  }, [showTour, currentStep]);
  
  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinish = () => {
    setShowTour(false);
    setHasCompletedTour(true);
  };
  
  if (!showTour) return null;
  
  const currentTourStep = TOUR_STEPS[currentStep];
  
  return (
    <>
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={handleFinish}
        aria-hidden="true"
      />
      
      {/* Highlighted target element */}
      {targetElement && (
        <div
          className="fixed z-[70] rounded-lg ring-4 ring-primary animate-pulse pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top + window.scrollY,
            left: targetElement.getBoundingClientRect().left + window.scrollX,
            width: targetElement.getBoundingClientRect().width,
            height: targetElement.getBoundingClientRect().height,
          }}
        />
      )}
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[80] w-[300px] bg-card rounded-lg shadow-lg overflow-hidden"
        style={{
          top: position.top + window.scrollY,
          left: position.left,
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
            onClick={handleFinish}
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
              onClick={handlePrevious}
              disabled={currentStep === 0}
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
                    index === currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
              className="h-8 px-2"
            >
              {currentStep < TOUR_STEPS.length - 1 ? (
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
    </>
  );
};

export default GuidedTour;
