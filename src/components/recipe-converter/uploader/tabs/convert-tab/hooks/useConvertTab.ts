
import { useState, useEffect } from 'react';

interface UseConvertTabProps {
  recipeText: string;
}

export const useConvertTab = ({ recipeText }: UseConvertTabProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHelpTip, setShowHelpTip] = useState(true);
  
  // Reset the success state when recipeText changes
  useEffect(() => {
    if (recipeText) {
      setShowSuccess(false);
    }
  }, [recipeText]);
  
  // Show help tip only if there's no recipe text
  useEffect(() => {
    setShowHelpTip(!recipeText);
  }, [recipeText]);
  
  return {
    showSuccess,
    setShowSuccess,
    showHelpTip,
    setShowHelpTip
  };
};
