
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HelpButtonProps {
  className?: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({ className }) => {
  const { setShowTour, setCurrentStep, setHasCompletedTour } = useOnboarding();

  const handleStartTour = () => {
    // Reset tour state
    setCurrentStep(0);
    setHasCompletedTour(false);
    setShowTour(true);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStartTour}
            className={className}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help & Tour</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Start guided tour</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpButton;
