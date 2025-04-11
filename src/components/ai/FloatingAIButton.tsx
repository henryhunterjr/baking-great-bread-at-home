
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import './floating-button.css';

const FloatingAIButton = () => {
  const { toggleAssistant } = useBreadAssistant();
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleAssistant}
            className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-bread-700 hover:bg-bread-800 text-white shadow-lg transition-all duration-300 transform hover:scale-110 ${
              isGlowing ? 'animate-glow' : ''
            }`}
            aria-label="Bread Assistant"
          >
            <MessageSquare className="w-6 h-6" />
            {isGlowing && (
              <span className="absolute inset-0 rounded-full animate-ping bg-bread-500 opacity-50"></span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Ask the Bread Assistant for baking help</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingAIButton;
