
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { TOUR_STEPS } from './TourSteps';
import TourTooltip from './tour/TourTooltip';
import TourOverlay from './tour/TourOverlay';
import TourHighlight from './tour/TourHighlight';
import { useTourPositioning } from './tour/useTourPositioning';

const GuidedTour = () => {
  const { showTour, setShowTour, setHasCompletedTour, currentStep, setCurrentStep } = useOnboarding();
  const { targetElement, position, tooltipRef } = useTourPositioning(showTour, currentStep);
  
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
  
  return (
    <>
      <TourOverlay onFinish={handleFinish} />
      <TourHighlight targetElement={targetElement} />
      <TourTooltip 
        step={currentStep}
        position={position}
        tooltipRef={tooltipRef}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onFinish={handleFinish}
      />
    </>
  );
};

export default GuidedTour;
