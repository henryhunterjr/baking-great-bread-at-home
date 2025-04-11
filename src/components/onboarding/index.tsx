
import React from 'react';
import GuidedTour from './GuidedTour';
import WelcomeModal from './WelcomeModal';
import HelpCenter from './HelpCenter';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export const OnboardingComponents: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <OnboardingProvider>
      {children}
      <WelcomeModal />
      <GuidedTour />
      <HelpCenter />
    </OnboardingProvider>
  );
};

export * from './FeatureTooltip';
export { default as FeatureTooltip } from './FeatureTooltip';
export { TOUR_STEPS } from './TourSteps';
