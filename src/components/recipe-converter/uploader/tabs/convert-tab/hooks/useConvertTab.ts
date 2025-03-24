
import { useState, useEffect } from 'react';

interface UseConvertTabProps {
  recipeText: string;
}

export const useConvertTab = ({ recipeText }: UseConvertTabProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHelpTip, setShowHelpTip] = useState(false);
  
  // Show success message when text is extracted from an image or PDF
  useEffect(() => {
    if (recipeText.trim().length > 50) {
      setShowSuccess(true);
      
      // Auto-hide success after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [recipeText]);
  
  // Show help tip if recipe text is empty
  useEffect(() => {
    if (!recipeText.trim()) {
      // Show tip after 2 seconds
      const timer = setTimeout(() => {
        setShowHelpTip(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowHelpTip(false);
    }
  }, [recipeText]);

  return {
    showSuccess,
    showHelpTip
  };
};
