
import { useState, useEffect } from 'react';

export const useTabState = () => {
  const [activeTab, setActiveTab] = useState("assistant");
  
  // Check localStorage for saved recipes on mount
  useEffect(() => {
    const savedRecipesCount = JSON.parse(localStorage.getItem('savedRecipes') || '[]').length;
    if (savedRecipesCount > 0) {
      // If we have saved recipes, default to the favorites tab
      setActiveTab("favorites");
    }
  }, []);

  return {
    activeTab,
    setActiveTab
  };
};
