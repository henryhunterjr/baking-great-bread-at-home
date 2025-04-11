
import React, { useState, useEffect } from 'react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import './floating-button.css';

const FloatingAIButton = () => {
  const { toggleAssistant, isAssistantOpen } = useBreadAssistant();
  const [isGlowing, setIsGlowing] = useState(false);
  
  // Add glowing effect every 30 seconds to draw attention
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing(true);
      
      // Turn off the glow after 3 seconds
      setTimeout(() => {
        setIsGlowing(false);
      }, 3000);
    }, 30000);
    
    // Initial glow after 5 seconds
    const initialGlow = setTimeout(() => {
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 3000);
    }, 5000);
    
    return () => {
      clearInterval(glowInterval);
      clearTimeout(initialGlow);
    };
  }, []);

  const handleButtonClick = () => {
    console.log("AI Button clicked, toggling assistant");
    toggleAssistant();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleButtonClick}
            className={`fixed bottom-6 right-6 z-40 p-1 rounded-full bg-bread-700 hover:bg-bread-800 text-white shadow-lg transition-all duration-300 transform hover:scale-110 floating-ai-button ${
              isGlowing ? 'animate-glow' : ''
            } ${isAssistantOpen ? 'ring-2 ring-bread-400' : ''}`}
            aria-label="Bread Assistant"
          >
            <img 
              src="/lovable-uploads/ff068c44-2bb2-450c-8583-fb7072a4850e.png" 
              alt="Chef Assistant" 
              className="w-12 h-12 rounded-full"
            />
            {isGlowing && (
              <span className="absolute inset-0 rounded-full animate-ping bg-bread-500 opacity-50"></span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ask the Bread Assistant for baking help</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingAIButton;
