
import React from 'react';
import HelpCenter from './HelpCenter';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export const OnboardingComponents: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <OnboardingProvider>
      {children}
      {/* WelcomeModal commented out for now */}
      {/* <WelcomeModal /> */}
      {/* GuidedTour commented out for now */}
      {/* <GuidedTour /> */}
      <HelpCenter />
    </OnboardingProvider>
  );
};

export * from './FeatureTooltip';
export { default as FeatureTooltip } from './FeatureTooltip';
export { default as HelpButton } from './HelpButton';
export { TOUR_STEPS } from './TourSteps';
