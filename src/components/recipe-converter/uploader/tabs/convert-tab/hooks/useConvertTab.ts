
import { useState, useEffect } from 'react';

interface UseConvertTabProps {
  recipeText: string;
}

export const useConvertTab = ({ recipeText }: UseConvertTabProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHelpTip, setShowHelpTip] = useState(true);
  
  useEffect(() => {
    if (recipeText && recipeText.trim().length > 0) {
      setShowSuccess(true);
      setShowHelpTip(false);
    } else {
      setShowSuccess(false);
      setShowHelpTip(true);
    }
  }, [recipeText]);
  
  return {
    showSuccess,
    showHelpTip
  };
};
