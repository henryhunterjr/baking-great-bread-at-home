
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
  const [hasCompletedTour, setHasCompletedTour] = useState<boolean>(true); // Default to true to disable tour
  const [showTour, setShowTour] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState<boolean>(true); // Default to true to disable modal

  // Load onboarding state from localStorage on mount
  useEffect(() => {
    const savedHasCompletedTour = localStorage.getItem('hasCompletedTour');
    const savedHasSeenWelcomeModal = localStorage.getItem('hasSeenWelcomeModal');
    
    // Always consider the tour as completed and the modal as seen for now
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

  // Reset tour state when tour is shown
  useEffect(() => {
    if (showTour) {
      // Reset to first step when tour is started
      setCurrentStep(0);
      
      // Log for debugging
      console.log("Tour started, reset to step 0");
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
