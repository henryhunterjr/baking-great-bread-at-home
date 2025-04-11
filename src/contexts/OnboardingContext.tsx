
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
  const [hasCompletedTour, setHasCompletedTour] = useState<boolean>(false);
  const [showTour, setShowTour] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState<boolean>(false);

  // Load onboarding state from localStorage on mount
  useEffect(() => {
    const savedHasCompletedTour = localStorage.getItem('hasCompletedTour');
    const savedHasSeenWelcomeModal = localStorage.getItem('hasSeenWelcomeModal');
    
    if (savedHasCompletedTour) {
      setHasCompletedTour(savedHasCompletedTour === 'true');
    }
    
    if (savedHasSeenWelcomeModal) {
      setHasSeenWelcomeModal(savedHasSeenWelcomeModal === 'true');
    } else {
      // If this is the first visit, show the welcome modal
      setHasSeenWelcomeModal(false);
    }
  }, []);

  // Save onboarding state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hasCompletedTour', hasCompletedTour.toString());
  }, [hasCompletedTour]);

  useEffect(() => {
    localStorage.setItem('hasSeenWelcomeModal', hasSeenWelcomeModal.toString());
  }, [hasSeenWelcomeModal]);

  // Initialize tour for new users
  useEffect(() => {
    if (!hasCompletedTour && !hasSeenWelcomeModal) {
      // Don't automatically show tour, wait for welcome modal interaction
      setShowTour(false);
    }
  }, [hasCompletedTour, hasSeenWelcomeModal]);

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
