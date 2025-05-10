
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingState {
  hasCompletedTour: boolean;
  setHasCompletedTour: (completed: boolean) => void;
  showTour: boolean;
  setShowTour: (show: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  hasSeenWelcomeModal: boolean;
  setHasSeenWelcomeModal: (seen: boolean) => void;
}

const defaultState: OnboardingState = {
  hasCompletedTour: false,
  setHasCompletedTour: () => {},
  showTour: false,
  setShowTour: () => {},
  currentStep: 0,
  setCurrentStep: () => {},
  hasSeenWelcomeModal: false,
  setHasSeenWelcomeModal: () => {},
};

const OnboardingContext = createContext<OnboardingState>(defaultState);

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Force these to true to ensure tour/modal never shows
  const [hasCompletedTour, setHasCompletedTour] = useState<boolean>(true);
  const [showTour, setShowTour] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState<boolean>(true);

  // Load onboarding state from localStorage on mount, but ensure values are always
  // set to prevent the tour from showing
  useEffect(() => {
    // Force the tour to be completed and modal as seen
    setHasCompletedTour(true);
    setHasSeenWelcomeModal(true);
    
    // Save this state to localStorage
    localStorage.setItem('hasCompletedTour', 'true');
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  }, []);

  // Save onboarding state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hasCompletedTour', hasCompletedTour.toString());
  }, [hasCompletedTour]);

  useEffect(() => {
    localStorage.setItem('hasSeenWelcomeModal', hasSeenWelcomeModal.toString());
  }, [hasSeenWelcomeModal]);

  // Override any attempt to show the tour
  useEffect(() => {
    if (showTour) {
      // Immediately disable the tour if it somehow gets enabled
      setShowTour(false);
      console.log("Tour disabled by configuration");
    }
  }, [showTour]);

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedTour,
        setHasCompletedTour,
        showTour,
        setShowTour,
        currentStep,
        setCurrentStep,
        hasSeenWelcomeModal,
        setHasSeenWelcomeModal,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
